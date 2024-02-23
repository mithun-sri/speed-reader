import logging
import os
import random

from mongoengine import connect, get_db
from rich.progress import track
from sqlalchemy import create_engine
from sqlalchemy.orm import Session

from .factories.history import HistoryFactory, ResultFactory
from .factories.question import QuestionFactory
from .factories.text import TextFactory
from .factories.user import UserFactory
from .models import Base

POSTGRES_URL = os.environ.get("POSTGRES_URL")
MONGO_URL = os.environ.get("MONGO_URL")

# Connect to PostgreSQL database
if not POSTGRES_URL:
    raise Exception("POSTGRES_URL environment variable is not set")
try:
    engine = create_engine(POSTGRES_URL, pool_pre_ping=True)
    with engine.connect():
        logging.info("Postgres connection established")
except Exception as e:
    logging.error("Postgres connection failed: %s", e)

# Connect to MongoDB database
if not MONGO_URL:
    raise Exception("MONGO_URL environment variable is not set")
try:
    connect(host=MONGO_URL)
    logging.info("MongoDB connection established")
except Exception as e:
    logging.error("MongoDB connection failed: %s", e)


def get_session():
    try:
        with Session(engine) as session:
            yield session
    except Exception as e:
        logging.error("Failed to get PostgreSQL session: %s", e)


def reset_postgres_tables():
    Base.metadata.drop_all(engine)
    Base.metadata.create_all(engine)


def reset_mongodb_collections():
    mongodb = get_db()
    for collection_name in mongodb.list_collection_names():
        if collection_name.startswith("system."):
            continue
        mongodb[collection_name].drop()


def reset_database():
    reset_postgres_tables()
    reset_mongodb_collections()


def seed_database():
    with Session(engine) as session:
        users = []
        for _ in track(range(10)):
            user = UserFactory.build()
            users.append(user)
            session.add(user)

        texts = []
        for _ in track(range(10)):
            text = TextFactory.build()
            questions = QuestionFactory.build_batch(100, text=text)
            texts.append(text)
            session.add(text)
            session.add_all(questions)

        for _ in track(range(1000)):
            user = random.choice(users)
            text = random.choice(texts)
            questions = random.sample(text.questions, 10)
            question_ids = [question.id for question in questions]
            results = [
                ResultFactory.build(
                    question_id=question.id,
                    correct_option=question.correct_option,
                )
                for question in questions
            ]
            history = HistoryFactory.build(
                user_id=user.id,
                text_id=text.id,
                question_ids=question_ids,
                results=results,
            )
            history.save(force_insert=True)

        session.commit()

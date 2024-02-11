import logging
import os

from mongoengine import connect, get_db
from sqlalchemy import create_engine
from sqlalchemy.orm import Session

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


def reset_postgres_tables():
    Base.metadata.drop_all(engine)
    Base.metadata.create_all(engine)


def reset_mongodb_collections():
    mongodb = get_db()
    for collection_name in mongodb.list_collection_names():
        if collection_name.startswith("system."):
            continue
        mongodb[collection_name].drop()


# TODO: Move this function into `dependencies.py` together with `get_token` etc.
def get_session():
    try:
        with Session(engine) as session:
            yield session
    except Exception as e:
        logging.error("Failed to get PostgreSQL session: %s", e)

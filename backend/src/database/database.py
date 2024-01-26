import os
from contextlib import closing

from sqlalchemy import (
    TIMESTAMP,
    Column,
    Integer,
    MetaData,
    String,
    Table,
    Text,
    create_engine,
    func,
)
from sqlalchemy.orm import Session

DATABASE_URL = os.environ.get("DATABASE_URL")
if not DATABASE_URL:
    raise Exception("DATABASE_URL environment variable is not set")

try:
    engine = create_engine(DATABASE_URL, pool_pre_ping=True)
    with engine.connect():
        print("Database connection established")
except Exception as e:
    print("Database connection failed")
    print(e)

metadata = MetaData()

text_table = Table(
    "text",
    metadata,
    Column("text_id", Integer, primary_key=True, autoincrement=True),
    Column("title", String(255)),
    Column("content", Text),
    Column("difficulty_level", String(50)),
    Column("word_count", Integer),
    Column("created_at", TIMESTAMP, server_default=func.now()),
)


def get_db():
    db = None
    try:
        # TODO: Is closing() necessary?
        with closing(Session(bind=engine)) as db:
            yield db
    finally:
        pass

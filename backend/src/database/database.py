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

try:
    engine = create_engine(DATABASE_URL, pool_pre_ping=True)
    with engine.connect():
        print("Database connection established")
except Exception as exception:
    print("Database connection failed")
    print(exception)
    raise ValueError("Database connection failed") from exception

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
    database = None
    try:
        with closing(Session(bind=engine)) as database:
            yield database
    finally:
        pass

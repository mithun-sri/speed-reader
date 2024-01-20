from sqlalchemy import create_engine, Column, Integer, String, Text, TIMESTAMP, func, MetaData, Table
from sqlalchemy.orm import Session
from contextlib import closing
import os

DATABASE_URL = "postgresql://postgres:dfef07d5f299649990b0602eb709f942@dokku-postgres-speed-reader-database:5432/speed_reader_database"

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
        with closing(Session(bind=engine)) as db:
            yield db
    finally:
        pass  # Add cleanup or disconnect actions if needed

from sqlalchemy import create_engine, Column, Integer, String, Text, TIMESTAMP, func, MetaData, Table
from sqlalchemy.orm import Session
from contextlib import closing

DATABASE_URL = "postgresql://postgres:3715f905f274304093b0e4f9b0beee8f@cloud-vm-42-173.doc.ic.ac.uk:5432/speed_reader_db"
print("Database URL:", DATABASE_URL)
try:
    engine = create_engine(DATABASE_URL, pool_pre_ping=True)
    with engine.connect() as connection:
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
        pass  # The session will be closed by the closing context manager

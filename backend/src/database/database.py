import os
from contextlib import closing

from sqlalchemy import (
    MetaData,
    create_engine,
)
from sqlalchemy.orm import (
    Session
)

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

def get_db():
    db = None
    try:
        with Session(bind=engine) as db:
            yield db
    finally:
        pass

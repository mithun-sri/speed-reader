import os

from sqlalchemy import create_engine
from sqlalchemy.orm import Session

if database_url := os.environ.get("DATABASE_URL"):
    try:
        engine = create_engine(database_url, pool_pre_ping=True)
        with engine.connect():
            print("Database connection established")

    except Exception as e:
        print("Database connection failed")
        print(e)


def get_session():
    session = None
    # TODO: We should not ignore the exception here.
    try:
        with Session(engine) as session:
            yield session
    finally:
        pass

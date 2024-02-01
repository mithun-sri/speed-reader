import os

from sqlalchemy import MetaData, create_engine
from sqlalchemy.orm import Session

engine = None

if not os.environ.get("NO_DATABASE"):
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


def get_session():
    session = None
    # TODO: We should not ignore the exception here.
    # TODO: No need to specify bind= here as it is the first argument.
    try:
        with Session(bind=engine) as session:
            yield session
    finally:
        pass

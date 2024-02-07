import os

from mongoengine import connect
from sqlalchemy import create_engine
from sqlalchemy.orm import Session

POSTGRES_URL = os.environ.get("POSTGRES_URL")
MONGO_URL = os.environ.get("MONGO_URL")

# Connect to PostgreSQL database
if not POSTGRES_URL:
    raise Exception("POSTGRES_URL environment variable is not set")
try:
    engine = create_engine(POSTGRES_URL, pool_pre_ping=True)
    with engine.connect():
        print("Postgres connection established")
except Exception as e:
    print("Postgres connection failed")
    print(e)

# Connect to MongoDB database
if not MONGO_URL:
    raise Exception("MONGO_URL environment variable is not set")
try:
    mongodb = connect(host=MONGO_URL)
    print("MongoDB connection established")
except Exception as e:
    print("MongoDB connection failed")
    print(e)


# TODO: Move this function into `dependencies.py` together with `get_token` etc.
def get_session():
    # TODO: This line may be redundant.
    session = None
    try:
        with Session(engine) as session:
            yield session
    except Exception as exception:
        print("Failed to get PostgreSQL session")
        print(exception)

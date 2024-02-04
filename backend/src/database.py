import os

from mongoengine import connect
from sqlalchemy import create_engine
from sqlalchemy.orm import Session

DATABASE_URL = os.environ.get("DATABASE_URL")
DATABASE_URL = "postgresql://postgres:d944ba8979acc540c9c89b3d2f867674@cloud-vm-42-173.doc.ic.ac.uk:5432/speed_reader_database"
MONGO_URL = os.environ.get("MONGO_URL")
MONGO_URL = "mongodb://speed-reader-mongodb:e6c9fe95da031c86319a226a1ef59b38@cloud-vm-42-173.doc.ic.ac.uk:27017/speed_reader_mongodb"

# Connect to PostgreSQL database

if not DATABASE_URL:
    raise Exception("DATABASE_URL environment variable is not set")

try:
    engine = create_engine(DATABASE_URL, pool_pre_ping=True)
    with engine.connect():
        print("Database connection established")
except Exception as e:
    print("Database connection failed")
    print(e)

# Connect to MongoDB database

if not MONGO_URL:
    raise Exception("MONGO_URL environment variable is not set")

try:
    connect(host=MONGO_URL)
    print("MongoDB connection established")
except Exception as e:
    print("MongoDB connection failed")
    print(e)


def get_session():
    session = None
    try:
        with Session(engine) as session:
            yield session
    except Exception as exception:
        print("Failed to get PostgreSQL session")
        print(exception)
    finally:
        pass

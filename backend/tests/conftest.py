import os

# Override database connection strings before importing modules.
POSTGRES_TEST_URL = os.environ.get("POSTGRES_TEST_URL")
MONGO_TEST_URL = os.environ.get("MONGO_TEST_URL")

if not POSTGRES_TEST_URL:
    raise Exception("POSTGRES_TEST_URL environment variable is not set")
if not MONGO_TEST_URL:
    raise Exception("MONGO_TEST_URL environment variable is not set")

os.environ["POSTGRES_URL"] = POSTGRES_TEST_URL
os.environ["MONGO_URL"] = MONGO_TEST_URL


# pylint: disable=wrong-import-position
from fastapi import FastAPI
from fastapi.testclient import TestClient
from mongoengine import get_db
from pytest import fixture
from sqlalchemy.orm import Session
from src.database import (
    engine,
    get_session,
    reset_mongodb_collections,
    reset_postgres_tables,
)
from src.main import app
from src.services.auth import get_current_user, get_refresh_token, get_token


# Set auto-use to True to make sure Postgres tables are recreated
# for tests that do not depend on this fixture explicitly.
@fixture(name="session", scope="function", autouse=True)
def session_fixture():
    # Reset Postgres tables before each test.
    reset_postgres_tables()

    with Session(engine) as session:
        yield session


@fixture(name="mongodb", scope="function", autouse=True)
def mongodb_fixture():
    # Reset MongoDB collections before each test.
    reset_mongodb_collections()

    yield get_db()


@fixture(name="app", scope="function")
def app_fixture(session: Session):
    app.dependency_overrides[get_session] = lambda: session
    app.dependency_overrides[get_token] = lambda: ""
    app.dependency_overrides[get_refresh_token] = lambda: ""

    yield app

    app.dependency_overrides.clear()


@fixture(name="client", scope="function")
# pylint: disable=redefined-outer-name
def client_fixture(app: FastAPI):
    app.dependency_overrides[get_current_user] = lambda: None

    yield TestClient(app)

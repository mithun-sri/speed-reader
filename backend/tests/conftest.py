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
from src.services.auth import get_current_user


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

    yield app

    app.dependency_overrides.clear()


@fixture(name="client", scope="function")
# pylint: disable=redefined-outer-name
def client_fixture(app: FastAPI):
    app.dependency_overrides[get_current_user] = lambda: None

    yield TestClient(app)


@fixture(name="admin_client", scope="function")
# pylint: disable=redefined-outer-name
def admin_client_fixture(app: FastAPI):
    app.dependency_overrides[get_current_user] = lambda: None

    yield TestClient(app)

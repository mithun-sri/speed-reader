from fastapi import FastAPI
from fastapi.testclient import TestClient
from pytest import fixture
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from sqlalchemy.pool import StaticPool
from src.database import get_session
from src.main import app
from src.models import Base
from src.services.auth import get_current_user, get_refresh_token, get_token


@fixture(name="session")
def session_fixture():
    engine = create_engine(
        "sqlite://",
        echo=True,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(engine)

    with Session(engine) as session:
        yield session


@fixture(name="app")
def app_fixture(session: Session):
    app.dependency_overrides[get_session] = lambda: session
    app.dependency_overrides[get_token] = lambda: ""
    app.dependency_overrides[get_refresh_token] = lambda: ""

    yield app

    app.dependency_overrides.clear()


@fixture(name="client")
# pylint: disable=redefined-outer-name
def client_fixture(app: FastAPI):
    app.dependency_overrides[get_current_user] = lambda: None

    yield TestClient(app)

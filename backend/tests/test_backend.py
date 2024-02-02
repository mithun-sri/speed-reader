from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from sqlalchemy.sql.expression import delete
from src import __version__
from src.database import get_session
from src.main import app
from src.models.base import Base
from src.models.text import Text

TEST_DATABASE_FILENAME = "test_database.db"

engine = create_engine(f"sqlite:///{TEST_DATABASE_FILENAME}")
Base.metadata.create_all(engine)


def override_get_session():
    session = None
    try:
        with Session(engine) as session:
            yield session
    finally:
        pass


test_client = TestClient(app)
app.dependency_overrides[get_session] = override_get_session


def test_version():
    assert __version__ == "0.1.0"


def test_texts_random_returns_404_when_text_table_is_empty():
    with Session(engine) as session:
        session.execute(delete(Text))
        session.commit()

    response = test_client.get("/api/v1/game/texts/random")
    assert response.status_code == 404


def test_texts_random_returns_text():
    test_text = Text(
        title="test_title",
        content="test text",
        difficulty="test_difficulty",
        word_count=2,
    )
    with Session(engine) as session:
        session.execute(delete(Text))
        session.add(test_text)
        session.commit()

    response = test_client.get("/api/v1/game/texts/random")
    assert response.status_code == 200
    response_json = response.json()
    assert response_json["title"] == "test_title"
    assert response_json["content"] == "test text"
    assert response_json["difficulty"] == "test_difficulty"
    assert response_json["word_count"] == 2

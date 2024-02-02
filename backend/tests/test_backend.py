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
    with Session(engine) as session:
        session.execute(delete(Text))
        session.add(
            Text(
                title="test_title",
                content="test text",
                difficulty="test_difficulty",
                word_count=2,
            )
        )
        session.commit()

    response = test_client.get("/api/v1/game/texts/random")
    assert response.status_code == 200
    response_json = response.json()
    assert response_json["title"] == "test_title"
    assert response_json["content"] == "test text"
    assert response_json["difficulty"] == "test_difficulty"
    assert response_json["word_count"] == 2


def test_texts_id_returns_404_when_no_text_matches_id():
    with Session(engine) as session:
        session.execute(delete(Text))
        session.add(
            Text(
                id="abcd",
                title="test_title",
                content="test text",
                difficulty="test_difficulty",
                word_count=2,
            )
        )
        session.commit()

    assert test_client.get("/api/v1/game/texts/dcba").status_code == 404


def test_texts_id_returns_requested_text():
    with Session(engine) as session:
        session.execute(delete(Text))
        for i in range(5):
            session.add(
                Text(
                    id=f"id{i}",
                    title="test_title",
                    content=f"test text {i}",
                    difficulty="test_difficulty",
                    word_count=2,
                )
            )
        session.commit()

    response = test_client.get("/api/v1/game/texts/id3")
    assert response.status_code == 200
    assert response.json()["content"] == "test text 3"

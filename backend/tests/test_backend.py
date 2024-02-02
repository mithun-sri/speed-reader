from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.sql.expression import delete
from src import __version__
from src.database import get_session
from src.main import app
from src.models.base import Base
from src.models.question import Question
from src.models.text import Text

TEST_DATABASE_FILENAME = "test_database.db"

engine = create_engine(f"sqlite:///{TEST_DATABASE_FILENAME}")
Base.metadata.create_all(engine)

Session = sessionmaker(engine)


def override_get_session():
    session = None
    try:
        with Session() as session:
            yield session
    finally:
        pass


test_client = TestClient(app)
app.dependency_overrides[get_session] = override_get_session


def test_version():
    assert __version__ == "0.1.0"


class TestTextsRandom:

    def test_returns_404_when_text_table_is_empty(self):
        with Session() as session:
            session.execute(delete(Text))
            session.commit()

        response = test_client.get("/api/v1/game/texts/random")
        assert response.status_code == 404

    def test_returns_text(self):
        with Session() as session:
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
        response_body = response.json()
        assert response_body["title"] == "test_title"
        assert response_body["content"] == "test text"
        assert response_body["difficulty"] == "test_difficulty"
        assert response_body["word_count"] == 2


class TestTextsID:

    def test_returns_404_when_no_text_matches_id(self):
        with Session() as session:
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

    def test_returns_requested_text(self):
        with Session() as session:
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


class TestQuestions:

    def test_returns_404_when_no_text_matches_id(self):
        with Session() as session:
            session.execute(delete(Text))
            session.execute(delete(Question))
            test_text = Text(
                id="not_a",
                title="",
                content="",
                difficulty="",
                word_count=0,
            )
            session.add(test_text)
            session.add(
                Question(content="", options=[], correct_option=0, text=test_text)
            )
            session.commit()

        response = test_client.get("/api/v1/game/texts/a/questions")
        assert response.status_code == 404

    def test_returns_all_questions_for_the_text(self):
        with Session() as session:
            session.execute(delete(Text))
            session.execute(delete(Question))
            test_text = Text(
                id="a",
                title="",
                content="",
                difficulty="",
                word_count=0,
            )
            session.add(test_text)
            for i in range(10):
                session.add(
                    Question(
                        id=str(i),
                        content="",
                        options=[],
                        correct_option=0,
                        text=test_text,
                    )
                )
            session.commit()

        response = test_client.get("/api/v1/game/texts/a/questions")
        assert response.status_code == 200
        response_body = response.json()
        # TODO: Check number of questions returned
        assert all(
            question["id"] in (str(i) for i in range(10)) for question in response_body
        )

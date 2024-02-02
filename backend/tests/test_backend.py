from fastapi.testclient import TestClient
from pytest import fixture
from sqlalchemy.orm import sessionmaker
from sqlalchemy.sql.expression import delete
from src import __version__
from src.database import engine
from src.main import app
from src.models.base import Base
from src.models.question import Question
from src.models.text import Text

TEST_DATABASE_FILENAME = "test_database.db"

Base.metadata.create_all(engine)
Session = sessionmaker(engine)
test_client = TestClient(app)


def test_version():
    assert __version__ == "0.1.0"


class TextsEndpointTestClass:

    @fixture
    def empty_text(self):
        return Text(
            id="empty",
            title="",
            content="",
            difficulty="",
            word_count=0,
        )


class TestTextsRandom(TextsEndpointTestClass):
    URL: str = "/api/v1/game/texts/next"

    def test_returns_404_when_text_table_is_empty(self):
        with Session() as session:
            session.execute(delete(Text))
            session.commit()

        response = test_client.get(self.URL)
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

        response = test_client.get(self.URL)
        assert response.status_code == 200
        response_body = response.json()
        assert response_body["title"] == "test_title"
        assert response_body["content"] == "test text"
        assert response_body["difficulty"] == "test_difficulty"
        assert response_body["word_count"] == 2


class TextIDGetEndpointTestClass(TextsEndpointTestClass):
    PATH: str = ""

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

        assert test_client.get("/api/v1/game/texts/dcba" + self.PATH).status_code == 404


class TestTextsID(TextIDGetEndpointTestClass):

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


class TestQuestions(TextIDGetEndpointTestClass):
    PATH: str = "/questions/next"

    def test_returns_all_questions_for_the_text(self, empty_text):
        with Session() as session:
            session.execute(delete(Text))
            session.execute(delete(Question))
            session.add(empty_text)
            for i in range(10):
                session.add(
                    Question(
                        id=str(i),
                        content="",
                        options=[],
                        correct_option=0,
                        text=empty_text,
                    )
                )
            session.commit()

        response = test_client.get("/api/v1/game/texts/empty/questions/next")
        assert response.status_code == 200
        response_body = response.json()
        assert len(response_body) == 3
        assert all(
            question["id"] in (str(i) for i in range(10)) for question in response_body
        )


class TestAnswers(TextsEndpointTestClass):

    def test_returns_404_if_question_does_not_exist(self, empty_text):
        with Session() as session:
            session.execute(delete(Text))
            session.execute(delete(Question))
            session.add(empty_text)
            session.commit()

        response = test_client.post(
            "/api/v1/game/texts/empty/answers",
            json=[{"question_id": "a", "selected_option": 0}],
        )
        assert response.status_code == 404

    def test_returns_400_if_questions_do_not_match_text_id(self, empty_text):
        with Session() as session:
            session.execute(delete(Text))
            session.execute(delete(Question))
            session.add(empty_text)
            session.add(
                Question(
                    id="a", content="", options=[], correct_option=0, text=empty_text
                )
            )
            session.commit()

        response = test_client.post(
            "/api/v1/game/texts/not_empty/answers",
            json=[{"question_id": "a", "selected_option": 0}],
        )
        assert response.status_code == 400

    def test_returns_results_and_correct_answers(self, empty_text):
        with Session() as session:
            session.execute(delete(Text))
            session.execute(delete(Question))
            session.add(empty_text)
            for i in range(5):
                session.add(
                    Question(
                        id=str(i),
                        content="",
                        options=[],
                        correct_option=i,
                        text=empty_text,
                    )
                )
            session.commit()

        response = test_client.post(
            "/api/v1/game/texts/empty/answers",
            json=[
                {"question_id": "0", "selected_option": 4},
                {"question_id": "1", "selected_option": 1},
                {"question_id": "2", "selected_option": 2},
                {"question_id": "4", "selected_option": 3},
                {"question_id": "3", "selected_option": 4},
            ],
        )
        assert response.status_code == 200
        response_body = response.json()
        assert all(
            (answer["correct_option"] == int(answer["question_id"]))
            and (
                answer["correct"]
                == (answer["selected_option"] == answer["correct_option"])
            )
            for answer in response_body
        )

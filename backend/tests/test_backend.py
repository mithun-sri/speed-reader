import ulid
from fastapi import FastAPI
from fastapi.testclient import TestClient
from pytest import fixture
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from sqlalchemy.pool import StaticPool
from src import schemas
from src.database import get_session
from src.factories import QuestionFactory, TextFactory
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
    print("Table keys: ", Base.metadata.sorted_tables)

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


class TestGetNextText:
    @staticmethod
    def test_returns_404_when_text_table_is_empty(client: TestClient):
        response = client.get("/api/v1/game/texts/next")
        assert response.status_code == 404

    @staticmethod
    def test_returns_text(client: TestClient, session: Session):
        text = TextFactory.build()
        session.add(text)
        session.commit()

        response = client.get("/api/v1/game/texts/next")
        assert response.status_code == 200

        response_body = response.json()
        assert response_body["id"] == text.id


class TextGetText:
    @staticmethod
    def test_returns_404_when_no_text_matches_id(client: TestClient, session: Session):
        text = TextFactory.build()
        session.add(text)
        session.commit()

        new_text_id = str(ulid.new())
        assert text.id != new_text_id
        response = client.get(f"/api/v1/game/texts/{new_text_id}")
        assert response.status_code == 404

    @staticmethod
    def test_returns_requested_text(client: TestClient, session: Session):
        texts = TextFactory.build_batch(5)
        session.add_all(texts)
        session.commit()

        text = texts[3]
        response = client.get(f"/api/v1/game/texts/{text.id}")
        assert response.status_code == 200


class TestGetQuestions:
    @staticmethod
    def test_returns_all_questions_for_the_text(client: TestClient, session: Session):
        text = TextFactory.build()
        questions = QuestionFactory.build_batch(10, text=text)
        session.add(text)
        session.add_all(questions)
        session.commit()

        response = client.get(f"/api/v1/game/texts/{text.id}/questions/next")
        assert response.status_code == 200

        response_body = response.json()
        assert len(response_body) == 3  # picks 3 questions
        # fmt: off
        assert set(question["id"] for question in response_body) \
            .issubset(question.id for question in questions)


class TestSubmitAnswers:
    @staticmethod
    def test_returns_404_if_question_does_not_exist(
        client: TestClient, session: Session
    ):
        text = TextFactory.build()
        session.add(text)
        session.commit()

        question_id = str(ulid.new())
        response = client.post(
            f"/api/v1/game/texts/{text.id}/answers",
            json=[
                schemas.QuestionAnswer(
                    question_id=question_id,
                    selected_option=0,
                ).model_dump()
            ],
        )
        assert response.status_code == 404

    @staticmethod
    def test_returns_400_if_questions_do_not_match_text_id(
        client: TestClient, session: Session
    ):
        text1 = TextFactory.build()
        text2 = TextFactory.build()
        question = QuestionFactory.build(text=text2)
        session.add(text1)
        session.add(text2)
        session.add(question)
        session.commit()

        response = client.post(
            f"/api/v1/game/texts/{text1.id}/answers",
            json=[
                schemas.QuestionAnswer(
                    question_id=question.id,
                    selected_option=0,
                ).model_dump()
            ],
        )
        assert response.status_code == 400

    @staticmethod
    def test_returns_results_and_correct_answers(client: TestClient, session: Session):
        text = TextFactory.build()
        questions = QuestionFactory.build_batch(5, text=text)
        session.add(text)
        session.add_all(questions)
        session.commit()

        response = client.post(
            f"/api/v1/game/texts/{text.id}/answers",
            json=[
                schemas.QuestionAnswer(
                    question_id=question.id,
                    selected_option=question.correct_option,
                ).model_dump()
                for question in questions
            ],
        )
        assert response.status_code == 200
        data = response.json()
        assert len(data) == len(questions)
        assert all(
            result["correct"] and result["selected_option"] == result["correct_option"]
            for result in data
        )

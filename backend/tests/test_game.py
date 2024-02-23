import pytest
import ulid
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from src import schemas
from src.factories.history import HistoryFactory, ResultFactory
from src.factories.question import QuestionFactory
from src.factories.text import TextFactory
from src.factories.user import UserFactory


class TestGetNextText:
    def test_returns_404_when_text_table_is_empty(
        self,
        user_client: TestClient,
    ):
        response = user_client.get("/game/texts/next")
        assert response.status_code == 404

    def test_returns_text(
        self,
        user_client: TestClient,
        session: Session,
    ):
        text = TextFactory.build()
        session.add(text)
        session.commit()

        response = user_client.get("/game/texts/next")
        assert response.status_code == 200

        response_body = response.json()
        assert response_body["id"] == text.id


class TextGetText:
    def test_returns_404_when_no_text_matches_id(
        self,
        user_client: TestClient,
        session: Session,
    ):
        text = TextFactory.build()
        session.add(text)
        session.commit()

        new_text_id = str(ulid.new())
        response = user_client.get(f"/game/texts/{new_text_id}")
        assert response.status_code == 404

    def test_returns_requested_text(
        self,
        client: TestClient,
        session: Session,
    ):
        texts = TextFactory.build_batch(5)
        session.add_all(texts)
        session.commit()

        text = texts[3]
        response = client.get(f"/game/texts/{text.id}")
        assert response.status_code == 200


class TestGetQuestions:
    def test_returns_all_questions_for_the_text(
        self,
        user_client: TestClient,
        session: Session,
    ):
        text = TextFactory.build()
        questions = QuestionFactory.build_batch(10, text=text)
        session.add(text)
        session.add_all(questions)
        session.commit()

        response = user_client.get(f"/game/texts/{text.id}/questions/next")
        assert response.status_code == 200

        response_body = response.json()
        assert len(response_body) == 10  # Picks 10 questions
        # fmt: off
        assert set(question["id"] for question in response_body) \
            .issubset(question.id for question in questions)


class TestPostAnswers:
    @pytest.fixture(autouse=True)
    def setup_fixture(
        self,
        session: Session,
    ):
        self.user = UserFactory.build()
        self.text = TextFactory.build()
        self.questions = QuestionFactory.build_batch(10, text=self.text)
        session.add(self.text)
        session.commit()

        self.results = [
            ResultFactory.build(
                question_id=question.id,
                correct_option=question.correct_option,
            )
            for question in self.questions
        ]
        self.history = HistoryFactory.build(
            text_id=self.text.id,
            user_id=self.user.id,
            question_ids=[question.id for question in self.questions],
            results=self.results,
        )

    def test_returns_404_if_question_does_not_exist(
        self,
        user_client: TestClient,
    ):
        response = user_client.post(
            f"/game/texts/{self.text.id}/answers",
            json={
                "answers": [
                    schemas.Answer(
                        question_id=str(ulid.new()),
                        selected_option=question.correct_option,
                    ).model_dump()
                    for question in self.questions
                ],
                "average_wpm": self.history.average_wpm,
                "interval_wpms": self.history.interval_wpms,
                "game_mode": self.history.game_mode,
                "game_submode": self.history.game_submode,
                "summary": self.history.summary,
            },
        )
        assert response.status_code == 404

    def test_returns_400_if_questions_do_not_match_text_id(
        self,
        user_client: TestClient,
        session: Session,
    ):
        new_text = TextFactory.build()
        new_questions = QuestionFactory.build_batch(10, text=new_text)
        session.add(new_text)
        session.add_all(new_questions)
        session.commit()

        response = user_client.post(
            f"/game/texts/{self.text.id}/answers",
            json={
                "answers": [
                    schemas.Answer(
                        question_id=question.id,
                        selected_option=question.correct_option,
                    ).model_dump()
                    for question in new_questions
                ],
                "average_wpm": self.history.average_wpm,
                "interval_wpms": self.history.interval_wpms,
                "game_mode": self.history.game_mode,
                "game_submode": self.history.game_submode,
                "summary": self.history.summary,
            },
        )
        assert response.status_code == 400

    def test_returns_results_and_correct_answers(
        self,
        user_client: TestClient,
    ):
        response = user_client.post(
            f"/game/texts/{self.text.id}/answers",
            json={
                "answers": [
                    schemas.Answer(
                        question_id=question.id,
                        selected_option=question.correct_option,
                    ).model_dump()
                    for question in self.questions
                ],
                "average_wpm": self.history.average_wpm,
                "interval_wpms": self.history.interval_wpms,
                "game_mode": self.history.game_mode,
                "game_submode": self.history.game_submode,
                "summary": self.history.summary,
            },
        )
        assert response.status_code == 200
        data = response.json()
        assert len(data) == len(self.questions)
        assert all(
            result["correct"] and result["selected_option"] == result["correct_option"]
            for result in data
        )

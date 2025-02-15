import json
import random
from typing import List

import openai
import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from src import models
from src.factories.history import HistoryFactory, ResultFactory
from src.factories.question import QuestionFactory
from src.factories.text import TextFactory
from src.factories.user import UserFactory


class TestGetAdminStatistics:
    @pytest.fixture(autouse=True)
    def setup_fixture(
        self,
        session: Session,
    ):
        self.users = UserFactory.build_batch(10)
        self.texts = TextFactory.build_batch(10)
        # fmt: off
        self.questions = [QuestionFactory.build_batch(50, text=text) for text in self.texts]
        self.questions = sum(self.questions, [])
        session.add_all(self.users)
        session.add_all(self.texts)
        session.add_all(self.questions)
        session.commit()

        self.histories = []
        for user in self.users:
            for text in self.texts:
                results = [
                    ResultFactory.build(
                        question_id=question.id,
                        correct_option=random.randint(0, 2),
                    )
                    for question in random.sample(self.questions, 10)
                ]
                history = HistoryFactory.build(
                    user_id=user.id,
                    text_id=text.id,
                    question_ids=[question.id for question in self.questions],
                    results=results,
                )
                history.save(force_insert=True)
                self.histories.append(history)

    def test_calculates_statistics_correctly(self, admin_client: TestClient):
        game_mode = "standard"  # TODO: Randomise game_mode
        response = admin_client.get(
            "/admin/statistics",
            params={"game_mode": game_mode},
        )
        assert response.status_code == 200

        histories = [
            history for history in self.histories if history.game_mode == game_mode
        ]
        min_wpm = min(history.average_wpm for history in histories)
        max_wpm = max(history.average_wpm for history in histories)
        # fmt: off
        average_wpm = sum(history.average_wpm for history in histories) // len(histories)
        average_score = sum(history.score for history in histories) // len(histories)

        data = response.json()
        assert data["min_wpm"] == min_wpm
        assert data["max_wpm"] == max_wpm
        assert data["average_wpm"] == average_wpm
        assert data["average_score"] == average_score


class TestGetTexts:
    @pytest.fixture(autouse=True)
    def setup_fixture(
        self,
        session: Session,
    ):
        self.texts = TextFactory.build_batch(10)
        session.add_all(self.texts)
        session.commit()

    def test_get_all_texts(self, admin_client: TestClient):
        response = admin_client.get("/admin/texts")
        assert response.status_code == 200

        data = response.json()
        assert len(data) == len(self.texts)
        assert set(text["id"] for text in data) == set(text.id for text in self.texts)


class TestGetText:
    @pytest.fixture(autouse=True)
    def setup_fixture(
        self,
        session: Session,
    ):
        self.text = TextFactory.build()
        session.add(self.text)
        session.commit()

    def test_get_text_by_id(self, admin_client: TestClient):
        response = admin_client.get(f"/admin/texts/{self.text.id}")
        assert response.status_code == 200

        data = response.json()
        assert data["id"] == self.text.id
        assert data["title"] == self.text.title
        assert data["content"] == self.text.content
        assert data["word_count"] == self.text.word_count


class TestDeleteText:
    @pytest.fixture(autouse=True)
    def setup_fixture(
        self,
        session: Session,
    ):
        self.text = TextFactory.build()
        self.questions = QuestionFactory.build_batch(15, text=self.text)
        session.add(self.text)
        session.commit()

    def test_delete_text_by_id(self, admin_client: TestClient, session: Session):
        response = admin_client.delete(f"/admin/texts/{self.text.id}")
        assert response.status_code == 200

        assert session.get(models.Text, self.text.id) is None

        query = session.query(models.Question).filter_by(text_id=self.text.id)
        questions = session.scalars(query).all()
        assert len(questions) == 0


class TestGetQuestions:
    @pytest.fixture(autouse=True)
    def setup_fixture(
        self,
        session: Session,
    ):
        self.text = TextFactory.build()
        self.questions = QuestionFactory.build_batch(10, text=self.text)
        session.add(self.text)
        session.add_all(self.questions)
        session.commit()

    def test_get_all_questions(self, admin_client: TestClient):
        response = admin_client.get(f"/admin/texts/{self.text.id}/questions")
        assert response.status_code == 200

        data = response.json()
        assert len(data) == len(self.questions)
        # fmt: off
        assert set(question["id"] for question in data) \
            == set(question.id for question in self.questions)


class TestGetQuestion:
    @pytest.fixture(autouse=True)
    def setup_fixture(
        self,
        session: Session,
    ):
        self.text = TextFactory.build()
        self.question = QuestionFactory.build(text=self.text)
        session.add(self.text)
        session.add(self.question)
        session.commit()

    def test_get_question_by_id(self, admin_client: TestClient):
        response = admin_client.get(
            f"/admin/texts/{self.text.id}/questions/{self.question.id}"
        )
        assert response.status_code == 200

        data = response.json()
        assert data["id"] == self.question.id
        assert data["content"] == self.question.content
        assert data["options"] == self.question.options
        assert data["correct_option"] == self.question.correct_option


class TestDeleteQuestion:
    @pytest.fixture(autouse=True)
    def setup_fixture(
        self,
        session: Session,
    ):
        self.text = TextFactory.build()
        self.questions = QuestionFactory.build_batch(15, text=self.text)
        session.add(self.text)
        session.add_all(self.questions)
        session.commit()

    def test_delete_question_by_id(self, admin_client: TestClient, session: Session):
        response = admin_client.delete(
            f"/admin/texts/{self.text.id}/questions/{self.questions[0].id}"
        )
        assert response.status_code == 200

        assert session.get(models.Question, self.questions[0].id) is None
        assert session.get(models.Text, self.text.id) is not None


class MockChatCompletionMessage:
    content: str = json.dumps(
        {
            "title": "test title",
            "extract": "test extract",
            "author": "test author",
            "gutenberg_link": "test link",
            "questions": [
                {
                    "question": "test question",
                    "options": [
                        "test option 0",
                        "test option 1",
                        "test option 2",
                    ],
                    "correct_option": "test option 2",
                }
            ],
            "summarised": "test summary",
            "description": "test description",
        }
    )


class MockChoice:
    message: MockChatCompletionMessage = MockChatCompletionMessage()


class MockChatCompletion:
    choices: List[MockChoice] = [MockChoice()]


class MockCompletions:

    def create(self, *args, **kwargs):
        _ = args, kwargs
        return MockChatCompletion()


class MockChat:
    completions = MockCompletions()


class MockOpenAI:
    chat = MockChat()

    def __init__(self, *args, **kwargs):
        _ = args, kwargs


class TestGenerateText:

    def test_generate_text(self, monkeypatch, admin_client: TestClient):
        monkeypatch.setattr(openai, "OpenAI", MockOpenAI)
        response = admin_client.post(
            "/admin/generate-text?difficulty=easy&fiction=false"
        )
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == "test title"
        assert data["content"] == "test extract"
        assert data["difficulty"] == "easy"
        assert data["fiction"] is False
        assert data["word_count"] == 2

        assert len(data["questions"]) == 1
        data_question = data["questions"][0]
        assert data_question["content"] == "test question"
        assert data_question["options"] == [
            "test option 0",
            "test option 1",
            "test option 2",
        ]
        assert data_question["correct_option"] == 2
        assert data["summary"] == "test summary"
        assert data["source"] == "test link"
        assert data["description"] == "test description"
        assert data["author"] == "test author"

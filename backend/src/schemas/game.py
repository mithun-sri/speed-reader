from typing import Optional

from pydantic import BaseModel


class Question(BaseModel):
    id: str
    content: str
    options: list[str]
    correct_option: int


class QuestionAnswer(BaseModel):
    question_id: str
    selected_option: int


class QuestionAnswersWithWpm(QuestionAnswer):
    answers: list[QuestionAnswer]
    average_wpm: int
    interval_wpms: list[int]
    game_mode: str
    game_submode: Optional[str]


class QuestionResult(BaseModel):
    question_id: str
    correct: bool
    selected_option: int
    correct_option: int

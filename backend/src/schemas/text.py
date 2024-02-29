# TODO: Organise schemas into appropriate modules.
from typing import Optional

from pydantic import BaseModel

from .game import Question, QuestionCreate


class TextBase(BaseModel):
    title: str
    content: str
    summary: Optional[str]
    source: str
    fiction: bool  # TODO: Rename to `is_fiction`
    difficulty: str
    word_count: int


class Text(TextBase):
    id: str


class TextWithQuestions(Text):
    questions: list[Question]


class TextWithStatistics(Text):
    min_wpm: int
    max_wpm: int
    average_wpm: int
    average_score: int


# TODO: Duplicate
class TextWithQuestionsAndStatistics(TextWithQuestions):
    min_wpm: int
    max_wpm: int
    average_wpm: int
    average_score: int


class TextCreate(TextBase):
    pass


class TextCreateWithQuestions(TextCreate):
    questions: list[QuestionCreate]

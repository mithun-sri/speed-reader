# TODO: Organise schemas into appropriate modules.
from typing import Optional

from pydantic import BaseModel

from .game import Question, QuestionCreate


class TextBase(BaseModel):
    title: str
    content: str
    summary: Optional[str]
    source: str
    # TODO: Rename to `is_fiction`
    fiction: bool
    difficulty: str
    word_count: int
    description: str
    author: str


class Text(TextBase):
    id: str

    # NOTE:
    # These fields are optional because some endpoints do not require image data.
    # In the future we should create a separate Pydantic schema for this.
    image_type: Optional[str] = None
    image_base64: Optional[str] = None


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
    image_url: str


class TextCreateWithQuestions(TextCreate):
    questions: list[QuestionCreate]

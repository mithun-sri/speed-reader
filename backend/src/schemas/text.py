# TODO: Organise schemas into appropriate modules.
from pydantic import BaseModel

from .game import Question, QuestionCreate


class TextBase(BaseModel):
    title: str
    content: str
    summary: str
    source: str
    fiction: bool  # TODO: Rename to `is_fiction`
    difficulty: str
    word_count: int


class Text(TextBase):
    id: str


class TextWithQuestions(Text):
    questions: list[Question]


class TextCreate(TextBase):
    pass


class TextCreateWithQuestions(TextCreate):
    questions: list[QuestionCreate]

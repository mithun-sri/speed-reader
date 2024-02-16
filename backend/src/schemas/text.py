from pydantic import BaseModel

from .game import QuestionWithCorrectOption


class Text(BaseModel):
    id: str
    title: str
    content: str
    difficulty: str
    word_count: int


class TextWithQuestions(Text):
    questions: list[QuestionWithCorrectOption]

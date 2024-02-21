from pydantic import BaseModel

from .game import GeneratedQuestion, QuestionWithCorrectOption


class Text(BaseModel):
    id: str
    title: str
    content: str
    difficulty: str
    word_count: int


class TextWithQuestions(Text):
    questions: list[QuestionWithCorrectOption]


class GeneratedText(BaseModel):
    title: str
    content: str
    difficulty: str
    word_count: int
    questions: list[GeneratedQuestion]
    author: str
    gutenberg_link: str
    summarised: str

from pydantic import BaseModel


class Question(BaseModel):
    id: str
    content: str
    options: list[str]
    correct_option: int


class QuestionAnswer(BaseModel):
    question_id: str
    selected_option: int


class QuestionResult(BaseModel):
    question_id: str
    correct: bool
    selected_option: int
    correct_option: int

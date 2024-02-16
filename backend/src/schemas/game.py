from pydantic import BaseModel


class Question(BaseModel):
    id: str
    content: str
    options: list[str]


class Answer(BaseModel):
    question_id: str
    selected_option: int


class Result(BaseModel):
    question_id: str
    correct: bool
    correct_option: int
    selected_option: int


class QuestionWithCorrectOption(Question):
    correct_option: int


class QuestionStatistics(BaseModel):
    question_id: str
    average_score: int
    options: list[str]
    correct_option: int
    selected_options: list[int]


class AdminStatistics(BaseModel):
    average_score: int
    average_wpm: int
    min_wpm: int
    max_wpm: int

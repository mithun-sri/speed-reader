# TODO: Organise schemas into appropriate modules.
from pydantic import BaseModel


class QuestionBase(BaseModel):
    content: str
    options: list[str]
    correct_option: int


class Question(QuestionBase):
    id: str


# TODO: Maybe rename to `QuestionWithoutCorrectOption`?
class QuestionMasked(BaseModel):
    id: str
    content: str
    options: list[str]


class QuestionWithStatistics(Question):
    percentages: list[int]
    accuracy: int


class QuestionCreate(QuestionBase):
    pass


class Answer(BaseModel):
    question_id: str
    selected_option: int


class Result(BaseModel):
    question_id: str
    correct: bool
    correct_option: int
    selected_option: int


class ResultWithQuestion(Result):
    content: str
    options: list[str]


class QuestionStatistics(BaseModel):
    question_id: str
    options: list[str]
    correct_option: int
    selected_options: list[int]


class AdminStatistics(BaseModel):
    average_score: int
    average_wpm: int
    min_wpm: int
    max_wpm: int

class TextStatistics(BaseModel):
    average_score: int
    average_wpm: int
    min_wpm: int
    max_wpm: int
    twenty_fifth_percentile: int
    fiftieth_percentile: int
    seventy_fifth_percentile: int

class OverallTextStatistics(BaseModel):
    id: str
    title: str
    content: str
    summary: str
    original_standard: TextStatistics
    original_adaptive: TextStatistics
    summarised_standard: TextStatistics
    summarised_adaptive: TextStatistics
    summarised_overall: TextStatistics
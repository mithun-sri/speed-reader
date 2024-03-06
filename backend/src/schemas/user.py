# TODO: Organise schemas into appropriate modules.
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field

from .game import Result, ResultWithQuestion
from .text import Text


class User(BaseModel):
    id: str
    username: str
    role: str


class UserRegister(BaseModel):
    username: str = Field(
        min_length=3,
        max_length=30,
        pattern=r"[a-zA-Z0-9_]+",
    )
    password: str = Field(
        min_length=8,
        max_length=30,
    )


class UserLogin(BaseModel):
    username: str
    password: str


class UserStatisticsAverageWpmPerDay(BaseModel):
    date: datetime
    wpm: int


class UserStatistics(BaseModel):
    user_id: str  # TODO: Is this necessary?
    username: str  # TODO: Is this necessary?
    min_wpm: int
    max_wpm: int
    average_wpm: int
    average_wpm_per_day: list[UserStatisticsAverageWpmPerDay]
    average_score: int


class UserAvailableTexts(BaseModel):
    texts: list[Text]
    page: int
    page_size: int
    total_texts: int


class TextFilter(BaseModel):
    difficulty: Optional[str] = None
    include_fiction: Optional[bool] = True
    include_nonfiction: Optional[bool] = True
    only_unplayed: Optional[bool] = False
    keyword: Optional[str] = None


class HistoryBase(BaseModel):
    text_id: str
    date: datetime
    game_mode: str
    game_submode: str
    difficulty: str
    summary: bool
    average_wpm: int
    interval_wpms: list[int]
    score: int


class History(HistoryBase):
    id: str
    results: list[Result]


class HistoryWithText(HistoryBase):
    text_title: str
    id: str
    results: list[Result]


class HistoryWithQuestions(HistoryBase):
    id: str
    results: list[ResultWithQuestion]

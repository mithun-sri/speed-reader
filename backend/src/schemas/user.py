# TODO: Organise schemas into appropriate modules.
from typing import Optional

from pydantic import BaseModel

from .game import Result
from .text import Text


class User(BaseModel):
    id: str
    username: str
    email: str
    role: str


class UserStatistics(BaseModel):
    user_id: str
    username: str
    email: str
    min_wpm: int
    max_wpm: int
    average_wpm: int
    average_score: int


class UserAvailableTexts(BaseModel):
    texts: list[Text]
    page: int
    page_size: int
    total_texts: int


# TODO: Move the schemas below to where appropriate.
class TextSort(BaseModel):
    field: str
    ascending: bool = False


class TextFilter(BaseModel):
    game_mode: Optional[str] = None
    difficulty: Optional[str] = None


class History(BaseModel):
    text_id: str
    game_mode: str
    game_submode: Optional[str]
    summary: bool
    average_wpm: int
    interval_wpms: list[int]
    score: int
    results: list[Result]

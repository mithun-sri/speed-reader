from datetime import datetime
from typing import Optional

from pydantic import BaseModel

from .text import Text


class UserRegister(BaseModel):
    email: str
    password: str
    created_at: datetime


class UserLogin(BaseModel):
    email: str
    password: str


# TODO: Update fields of `UserResponse` class.
# TODO: Rename `UserResponse` to `User` - read models in Pydantic are named without any suffix.
class UserResponse(BaseModel):
    id: int
    email: str
    created_at: datetime

    class Config:
        from_attributes = True


class RegistrationUserRepsonse(BaseModel):
    message: str
    data: UserResponse


class UserStatistics(BaseModel):
    user_id: str
    username: str
    email: str
    min_wpm: int
    max_wpm: int
    average_wpm: int
    average_score: int


# TODO: Move the schemas below to where appropriate.
class TextSort(BaseModel):
    field: str
    ascending: bool = False


class TextFilter(BaseModel):
    game_mode: Optional[str] = None
    difficulty: Optional[str] = None


class UserAvailableTexts(BaseModel):
    texts: list[Text]
    page: int
    page_size: int
    total_texts: int


class History(BaseModel):
    text_id: str
    game_mode: str
    game_submode: Optional[str]
    average_wpm: int
    interval_wpms: list[int]
    score: int
    answers: list[int]

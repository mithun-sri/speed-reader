from typing import Optional

from fastapi import Query
from pydantic import BaseModel


class Text(BaseModel):
    id: str
    title: str
    content: str
    difficulty: str
    word_count: int


class TextFilterSort(BaseModel):
    field: str
    ascending: bool = False


class TextFilter(BaseModel):
    page: int = Query(1, ge=1)
    page_size: int = Query(10, ge=1, le=100)
    difficulty: Optional[str] = Query(None)
    game_mode: Optional[int] = Query(None)
    sort: Optional[TextFilterSort] = Query(None)

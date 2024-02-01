from pydantic import BaseModel


class Text(BaseModel):
    id: str
    title: str
    content: str
    difficulty: str
    word_count: int

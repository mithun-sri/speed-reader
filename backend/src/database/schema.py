from typing import List

from sqlalchemy import (
    TIMESTAMP,
    Integer,
    func,
    String,
    ARRAY,
    ForeignKey
)

from sqlalchemy.orm import (
    DeclarativeBase,
    Mapped,
    mapped_column
)

class Base(DeclarativeBase):
    pass

class Text(Base):
    __tablename__ = "text"

    text_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    title: Mapped[str]
    content: Mapped[str]
    difficulty_level: Mapped[str]
    word_count: Mapped[int]
    created_at: Mapped[str] = mapped_column(TIMESTAMP, server_default=func.now())

class Question(Base):
    __tablename__ = "questions"

    question_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    text_id: Mapped[int] = mapped_column(ForeignKey("text.text_id"), autoincrement=True)
    question_text: Mapped[str]
    correct_option: Mapped[int]
    options: Mapped[List[str]] = mapped_column(ARRAY(String))
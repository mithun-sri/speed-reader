from datetime import datetime
from typing import List

import ulid
from sqlalchemy import ARRAY, ForeignKey, String
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class Base(DeclarativeBase):
    pass


class TimestampMixin(Base):
    created_at: Mapped[datetime] = mapped_column(
        default_factory=datetime.utcnow,
    )
    updated_at: Mapped[datetime] = mapped_column(
        default_factory=datetime.utcnow,
        onupdate=datetime.utcnow,
    )


class Text(TimestampMixin, Base):
    __tablename__ = "text"

    id: Mapped[str] = mapped_column(
        primary_key=True,
        default_factory=lambda: str(ulid.new()),
    )
    title: Mapped[str]
    content: Mapped[str]
    difficulty: Mapped[str]
    word_count: Mapped[int]

    questions: Mapped[List["Question"]] = relationship(back_populates="text")


class Question(TimestampMixin, Base):
    __tablename__ = "question"

    id: Mapped[str] = mapped_column(
        primary_key=True,
        default_factory=lambda: str(ulid.new()),
    )
    content: Mapped[str]
    options: Mapped[List[str]] = mapped_column(ARRAY(String))
    correct_option: Mapped[int]

    text_id: Mapped[int] = mapped_column(ForeignKey("text.text_id"))
    text: Mapped[Text] = relationship(back_populates="questions")

from datetime import datetime

import ulid
from sqlalchemy import ARRAY, DateTime, ForeignKey, String
from sqlalchemy.orm import (
    DeclarativeBase,
    Mapped,
    MappedAsDataclass,
    mapped_column,
    relationship,
)


# We need to set `kw_only=True` for mixins
# because the `id` field, which has a default value, gets defined
# before the child class's other fields, which may not have default values.
# https://docs.sqlalchemy.org/en/20/errors.html#error-dcte
class ULIDMixin(MappedAsDataclass, kw_only=True):
    id: Mapped[str] = mapped_column(
        primary_key=True,
        default_factory=lambda: str(ulid.new()),
    )


class TimestampMixin(MappedAsDataclass, kw_only=True):
    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        insert_default=datetime.utcnow,
        default=None,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        insert_default=datetime.utcnow,
        default=None,
        onupdate=datetime.utcnow,
    )


class Base(DeclarativeBase, MappedAsDataclass):
    pass


class Text(ULIDMixin, TimestampMixin, Base):
    __tablename__ = "text"

    title: Mapped[str]
    content: Mapped[str]
    difficulty: Mapped[str]
    word_count: Mapped[int]

    questions: Mapped[list["Question"]] = relationship(
        back_populates="text",
        default_factory=list,
    )


class Question(ULIDMixin, TimestampMixin, Base):
    __tablename__ = "question"

    content: Mapped[str]
    options: Mapped[list[str]] = mapped_column(ARRAY(String))
    correct_option: Mapped[int]

    text_id: Mapped[int] = mapped_column(ForeignKey("text.id"), init=False)
    text: Mapped[Text] = relationship(back_populates="questions")

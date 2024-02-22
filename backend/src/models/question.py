from typing import TYPE_CHECKING

from sqlalchemy import JSON, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base
from .mixins import TimestampMixin, ULIDMixin

if TYPE_CHECKING:
    from .text import Text


class Question(ULIDMixin, TimestampMixin, Base):
    __tablename__ = "question"

    content: Mapped[str]
    options: Mapped[list[str]] = mapped_column(JSON)
    correct_option: Mapped[int]

    text_id: Mapped[str] = mapped_column(ForeignKey("text.id"), init=False)
    text: Mapped["Text"] = relationship(back_populates="questions")

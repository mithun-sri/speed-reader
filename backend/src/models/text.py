from typing import TYPE_CHECKING

from sqlalchemy.orm import Mapped, relationship

from .base import Base
from .mixins import TimestampMixin, ULIDMixin

if TYPE_CHECKING:
    from .question import Question


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

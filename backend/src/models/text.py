from typing import TYPE_CHECKING, Optional

from sqlalchemy.orm import Mapped, relationship

from .base import Base
from .mixins import TimestampMixin, ULIDMixin

if TYPE_CHECKING:
    from .question import Question


class Text(ULIDMixin, TimestampMixin, Base):
    __tablename__ = "text"

    title: Mapped[str]
    content: Mapped[str]
    summary: Mapped[Optional[str]]
    source: Mapped[str]
    # TODO: Rename to `is_fiction`
    fiction: Mapped[bool]
    word_count: Mapped[int]
    difficulty: Mapped[str]
    author: Mapped[str]
    description: Mapped[str]
    image_type: Mapped[str]
    image_bytes: Mapped[bytes]

    questions: Mapped[list["Question"]] = relationship(
        back_populates="text",
        default_factory=list,
        cascade="all, delete",
    )

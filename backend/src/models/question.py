from sqlalchemy import ARRAY, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base
from .mixins import TimestampMixin, ULIDMixin
from .text import Text


class Question(ULIDMixin, TimestampMixin, Base):
    __tablename__ = "question"

    content: Mapped[str]
    options: Mapped[list[str]] = mapped_column(ARRAY(String))
    correct_option: Mapped[int]

    text_id: Mapped[int] = mapped_column(ForeignKey("text.id"), init=False)
    text: Mapped[Text] = relationship(back_populates="questions")

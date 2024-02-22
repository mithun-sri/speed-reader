from sqlalchemy.orm import Mapped, mapped_column

from .base import Base
from .mixins import TimestampMixin, ULIDMixin


class User(ULIDMixin, TimestampMixin, Base):
    __tablename__ = "user"

    username: Mapped[str]
    email: Mapped[str]
    password: Mapped[str]
    role: Mapped[str] = mapped_column(default="user")
    status: Mapped[str] = mapped_column(default="active")

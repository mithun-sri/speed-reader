from typing import Optional

from sqlalchemy.orm import Mapped, mapped_column

from .base import Base
from .mixins import TimestampMixin, ULIDMixin


class User(ULIDMixin, TimestampMixin, Base):
    __tablename__ = "user"

    username: Mapped[str]
    password: Mapped[str]
    role: Mapped[str] = mapped_column(default="user")
    status: Mapped[str] = mapped_column(default="active")

    # NOTE:
    # We stopped storing email for new users to avoid the complexity of email verification.
    # But we do not want to delete the existing emails so made the email column optional.
    email: Mapped[Optional[str]] = mapped_column(default=None)

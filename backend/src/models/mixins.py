from datetime import datetime

import ulid
from sqlalchemy import DateTime
from sqlalchemy.orm import Mapped, MappedAsDataclass, mapped_column


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

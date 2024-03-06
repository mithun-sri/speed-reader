"""make email column optional in user table

Revision ID: c82f5ade59dc
Revises: 1949ebd28376
Create Date: 2024-03-06 12:39:49.049493

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "c82f5ade59dc"
down_revision: Union[str, None] = "1949ebd28376"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.alter_column(
        "user",
        "email",
        existing_type=sa.VARCHAR(length=255),
        nullable=True,
    )


def downgrade() -> None:
    op.alter_column(
        "user",
        "email",
        existing_type=sa.VARCHAR(length=255),
        nullable=False,
    )

"""add role column to user table

Revision ID: d91e9d4c3fb5
Revises: 0ff8ebf4be84
Create Date: 2024-02-16 12:21:27.624310

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "d91e9d4c3fb5"
down_revision: Union[str, None] = "0ff8ebf4be84"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "user", sa.Column("role", sa.String(), default="user", nullable=False)
    )


def downgrade() -> None:
    op.drop_column("user", "role")

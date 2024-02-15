"""add fiction column to text table

Revision ID: 0ff8ebf4be84
Revises: 87646658be5c
Create Date: 2024-02-14 19:10:58.328849

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "0ff8ebf4be84"
down_revision: Union[str, None] = "87646658be5c"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "text",
        sa.Column("fiction", sa.Boolean(), nullable=False),
    )


def downgrade() -> None:
    op.drop_column("text", "fiction")

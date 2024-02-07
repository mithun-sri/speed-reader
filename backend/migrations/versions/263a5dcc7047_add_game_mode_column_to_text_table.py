"""add game_mode column to text table

Revision ID: 263a5dcc7047
Revises: 5893547353f5
Create Date: 2024-02-07 03:35:45.595788

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "263a5dcc7047"
down_revision: Union[str, None] = "5893547353f5"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "text",
        sa.Column("game_mode", sa.String(), nullable=True),
    )


def downgrade() -> None:
    op.drop_column("text", "game_mode")

"""remove game mode column from text table

Revision ID: 87646658be5c
Revises: d2b56440b8a9
Create Date: 2024-02-13 11:55:59.324826

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "87646658be5c"
down_revision: Union[str, None] = "d2b56440b8a9"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.drop_column("text", "game_mode")


def downgrade() -> None:
    op.add_column(
        "text",
        sa.Column("game_mode", sa.String(), nullable=True),
    )

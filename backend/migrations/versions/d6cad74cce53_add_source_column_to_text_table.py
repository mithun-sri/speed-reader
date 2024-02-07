"""add source column to text table

Revision ID: d6cad74cce53
Revises: 263a5dcc7047
Create Date: 2024-02-07 19:37:18.101435

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "d6cad74cce53"
down_revision: Union[str, None] = "263a5dcc7047"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "text",
        sa.Column("source", sa.String(), nullable=True),
    )


def downgrade() -> None:
    op.drop_column("text", "source")

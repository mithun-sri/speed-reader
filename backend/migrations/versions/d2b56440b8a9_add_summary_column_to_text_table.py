"""add summary column to text table

Revision ID: d2b56440b8a9
Revises: d6cad74cce53
Create Date: 2024-02-13 11:47:12.307684

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "d2b56440b8a9"
down_revision: Union[str, None] = "d6cad74cce53"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "text",
        sa.Column("summary", sa.Text(), nullable=True),
    )


def downgrade() -> None:
    op.drop_column("text", "summary")

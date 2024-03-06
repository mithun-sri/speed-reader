"""replace image url column with image columns in text table

Revision ID: 3ff9ef45e8f7
Revises: c82f5ade59dc
Create Date: 2024-03-06 15:15:37.883088

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "3ff9ef45e8f7"
down_revision: Union[str, None] = "c82f5ade59dc"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "text",
        sa.Column("image_bytes", sa.LargeBinary(), nullable=False),
    )
    op.add_column(
        "text",
        sa.Column("image_type", sa.String(), nullable=False),
    )
    op.drop_column("text", "image_url")


def downgrade() -> None:
    op.add_column(
        "text",
        sa.Column(
            "image_url",
            sa.String(),
            server_default="https://www.gutenberg.org/cache/epub/1342/pg1342.cover.medium.jpg",
            nullable=False,
        ),
    )
    op.drop_column("text", "image_type")
    op.drop_column("text", "image_bytes")

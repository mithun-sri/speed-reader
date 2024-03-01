"""Add image_url field to text

Revision ID: e413b3bf1e84
Revises: f2cf4d74fc78
Create Date: 2024-03-01 14:55:28.009556

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'e413b3bf1e84'
down_revision: Union[str, None] = 'f2cf4d74fc78'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("text", sa.Column("image_url", sa.String(), default="https://www.gutenberg.org/cache/epub/1342/pg1342.cover.medium.jpg", nullable=False))


def downgrade() -> None:
    op.drop_column("text", "image_url")

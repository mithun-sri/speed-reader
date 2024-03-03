"""Add author field to text

Revision ID: 1949ebd28376
Revises: e413b3bf1e84
Create Date: 2024-03-01 14:56:36.932603

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '1949ebd28376'
down_revision: Union[str, None] = 'e413b3bf1e84'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("text", sa.Column("author", sa.String(), server_default="Author", nullable=False))


def downgrade() -> None:
    op.drop_column("text", "author")

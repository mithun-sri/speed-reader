"""Add description field to text table

Revision ID: f2cf4d74fc78
Revises: d91e9d4c3fb5
Create Date: 2024-03-01 14:45:40.644074

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'f2cf4d74fc78'
down_revision: Union[str, None] = 'd91e9d4c3fb5'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("text", sa.Column("description", sa.String(), server_default="Sample description", nullable=False))


def downgrade() -> None:
    op.drop_column("text", "description")

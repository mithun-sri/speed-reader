"""create question table

Revision ID: 785e7c55a945
Revises: b44b7bd79a51
Create Date: 2024-01-31 10:59:41.718520

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "785e7c55a945"
down_revision: Union[str, None] = "b44b7bd79a51"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "question",
        sa.Column("id", sa.String(26), primary_key=True),
        sa.Column("text_id", sa.String(26), nullable=False),
        sa.Column("content", sa.Text(), nullable=False),
        sa.Column("options", sa.ARRAY(sa.String()), nullable=False),
        sa.Column("correct_option", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(["text_id"], ["text.id"], ondelete="CASCADE"),
    )


def downgrade() -> None:
    op.drop_table("question")

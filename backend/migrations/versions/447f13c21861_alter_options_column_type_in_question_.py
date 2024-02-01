"""alter options column type in question table

Revision ID: 447f13c21861
Revises: 785e7c55a945
Create Date: 2024-02-01 19:38:29.819527

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "447f13c21861"
down_revision: Union[str, None] = "785e7c55a945"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.alter_column(
        "question",
        "options",
        existing_type=sa.ARRAY(sa.String()),
        type_=sa.JSON(),
        postgresql_using="array_to_json(options)",
    )


def downgrade() -> None:
    op.alter_column(
        "question",
        "options",
        existing_type=sa.JSON(),
        type_=sa.ARRAY(sa.String()),
        postgresql_using="array_agg(json_array_elements_text(options))",
    )

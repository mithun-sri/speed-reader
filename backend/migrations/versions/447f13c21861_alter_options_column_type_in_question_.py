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
    # We cannot use `op.alter_column` to change the column type from JSON to ARRAY
    # because Postgres does not allow `json_array_elements_text()` in `ALTER COLUMN ... USING`.
    op.add_column("question", sa.Column("options_json", sa.ARRAY(sa.String())))
    op.execute(
        "UPDATE question SET options_json = ARRAY(SELECT options::text FROM question)"
    )
    op.drop_column("question", "options")
    op.alter_column("question", "options_json", new_column_name="options")

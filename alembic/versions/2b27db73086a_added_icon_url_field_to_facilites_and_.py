"""added icon_url field to facilites and applications tables.

Revision ID: 2b27db73086a
Revises: c4cfb030650c
Create Date: 2023-04-18 13:29:12.202688

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '2b27db73086a'
down_revision = 'c4cfb030650c'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('applications', sa.Column('icon_url', sa.String(length=255), nullable=True))
    op.add_column('facilities', sa.Column('icon_url', sa.String(length=255), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('facilities', 'icon_url')
    op.drop_column('applications', 'icon_url')
    # ### end Alembic commands ###

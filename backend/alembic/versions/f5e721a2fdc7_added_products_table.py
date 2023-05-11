"""Added products table

Revision ID: f5e721a2fdc7
Revises: 1d6e843867c7
Create Date: 2023-04-12 03:16:53.461625

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'f5e721a2fdc7'
down_revision = '1d6e843867c7'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('products',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=255), nullable=False),
    sa.Column('price', sa.Double(), nullable=False),
    sa.Column('status', sa.Boolean(), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_products_id'), 'products', ['id'], unique=False)
    op.alter_column('account_facilities', 'facility_id',
               existing_type=sa.INTEGER(),
               nullable=False)
    op.alter_column('account_facilities', 'application_id',
               existing_type=sa.INTEGER(),
               nullable=False)
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('account_facilities', 'application_id',
               existing_type=sa.INTEGER(),
               nullable=True)
    op.alter_column('account_facilities', 'facility_id',
               existing_type=sa.INTEGER(),
               nullable=True)
    op.drop_index(op.f('ix_products_id'), table_name='products')
    op.drop_table('products')
    # ### end Alembic commands ###
"""Added account_facilities table

Revision ID: 1d6e843867c7
Revises: 9ce6e94523e8
Create Date: 2023-04-10 12:15:18.685464

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '1d6e843867c7'
down_revision = '9ce6e94523e8'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('account_facilities',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('no_of_devices', sa.Integer(), nullable=True),
        sa.Column('floor_plan_image_url', sa.TEXT(), nullable=True),
        sa.Column('access_point_coordinates', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('no_of_access_points', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.Column('facility_id', sa.Integer(), nullable=True),
        sa.Column('application_id', sa.Integer(), nullable=True),
        sa.Column('account_id', sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(['account_id'], ['accounts.id'], ),
        sa.ForeignKeyConstraint(['application_id'], ['applications.id'], ),
        sa.ForeignKeyConstraint(['facility_id'], ['facilities.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_account_facilities_id'), 'account_facilities', ['id'], unique=False)
    op.drop_index('ix_accounts_plan_id', table_name='accounts')
    op.drop_column('accounts', 'is_active')
    op.drop_column('accounts', 'current_subscription_ends')
    op.drop_column('accounts', 'plan_id')
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('accounts', sa.Column('plan_id', sa.INTEGER(), autoincrement=False, nullable=True))
    op.add_column('accounts', sa.Column('current_subscription_ends', postgresql.TIMESTAMP(), autoincrement=False, nullable=True))
    op.add_column('accounts', sa.Column('is_active', sa.BOOLEAN(), autoincrement=False, nullable=True))
    op.create_index('ix_accounts_plan_id', 'accounts', ['plan_id'], unique=False)
    op.drop_index(op.f('ix_account_facilities_id'), table_name='account_facilities')
    op.drop_table('accountfacility')
    # ### end Alembic commands ###

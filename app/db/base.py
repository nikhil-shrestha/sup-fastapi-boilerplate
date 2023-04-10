# Import all the models, so that Base has them before being
# imported by Alembic
from app.db.base_class import Base  # noqa
from app.models.user import User  # noqa
from app.models.role import Role  # noqa
from app.models.user_role import UserRole  # noqa
from app.models.account import Account  # noqa
from app.models.device import Device  # noqa
from app.models.user_device import UserDevice  # noqa
from app.models.facility import Facility  # noqa

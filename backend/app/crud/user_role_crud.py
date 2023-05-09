from typing import Optional

from app.crud.base import CRUDBase
from app.models.user_role import UserRole
from app.schemas.user_role import UserRoleCreate, UserRoleUpdate
from sqlalchemy.orm import Session


class CRUDUserRole(CRUDBase[UserRole, UserRoleCreate, UserRoleUpdate]):
    def get_by_user_id(
        self, db: Session, *, user_id: int
    ) -> Optional[UserRole]:
        return db.query(UserRole).filter(UserRole.user_id == user_id).first()


user_role = CRUDUserRole(UserRole)

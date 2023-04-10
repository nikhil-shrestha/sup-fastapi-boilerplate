from typing import Optional

from app.crud.base import CRUDBase
from app.models.account_facilities import AccountFacilities
from app.schemas.account_facilities import AccountFacilitiesCreate, AccountFacilitiesUpdate
from sqlalchemy.orm import Session


class CRUDAccountFacilities(CRUDBase[AccountFacilities, AccountFacilitiesCreate, AccountFacilitiesUpdate]):
    def get_by_account_id(self, db: Session, *, account_id: str) -> Optional[AccountFacilities]:
        return db.query(self.model).filter(AccountFacilities.account_id == account_id).first()


account = CRUDAccountFacilities(AccountFacilities)

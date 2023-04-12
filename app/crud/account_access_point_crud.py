from typing import Optional

from app.crud.base import CRUDBase
from app.models.account_access_point import AccountAccessPoint
from app.schemas.account_access_point import AccountAccessPointCreate, AccountAccessPointUpdate
from sqlalchemy.orm import Session


class CRUDAccountAccessPoint(CRUDBase[AccountAccessPoint, AccountAccessPointCreate, AccountAccessPointUpdate]):
    def list_by_account_id(self, db: Session, *, account_id: str) -> Optional[AccountAccessPoint]:
        return db.query(self.model).filter(AccountAccessPoint.account_id == account_id).all()

    def get_by_serial_id(self, db: Session, *, serial_id: str) -> Optional[AccountAccessPoint]:
        return db.query(self.model).filter(AccountAccessPoint.serial_id == serial_id).first()


account_access_point = CRUDAccountAccessPoint(AccountAccessPoint)

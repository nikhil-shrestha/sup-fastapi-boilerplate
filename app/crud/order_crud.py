from typing import Optional

from app.crud.base import CRUDBase
from app.models.order import Order
from app.schemas.order import OrderCreate, OrderUpdate
from sqlalchemy.orm import Session


class CRUDOrder(CRUDBase[Order, OrderCreate, OrderUpdate]):
    def list_by_account_id(
        self, db: Session, *, account_id: int
    ) -> Optional[Order]:
        return db.query(Order).filter(Order.account_id == account_id).all()


order = CRUDOrder(Order)

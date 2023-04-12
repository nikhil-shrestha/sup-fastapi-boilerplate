from typing import Optional

from app.crud.base import CRUDBase
from app.models.order_item import OrderItem
from app.schemas.order_item import OrderItemCreate, OrderItemUpdate
from sqlalchemy.orm import Session


class CRUDOrderItem(CRUDBase[OrderItem, OrderItemCreate, OrderItemUpdate]):
    def list_by_order_id(
        self, db: Session, *, order_id: int
    ) -> Optional[OrderItem]:
        return db.query(OrderItem).filter(OrderItem.order_id == order_id).all()


order_item = CRUDOrderItem(OrderItem)

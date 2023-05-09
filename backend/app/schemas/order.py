from datetime import datetime
from typing import Optional, List

from app.schemas.order_item import OrderItem
from pydantic import BaseModel


# Shared properties
class OrderBase(BaseModel):
    account_id: Optional[int]
    status: Optional[bool] = True


class OrderItemInput(BaseModel):
    product_id: Optional[int]
    quantity: Optional[int]
    pass


class OrderInput(OrderBase):
    items: List[OrderItemInput]
    pass

# Properties to receive via API on creation
class OrderCreate(OrderBase):
    pass


# Properties to receive via API on update
class OrderUpdate(OrderBase):
    pass


class OrderInDBBase(OrderBase):
    id: int
    order_items: List[OrderItem]
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


# Additional properties to return via API
class Order(OrderInDBBase):
    pass


# Additional properties stored in DB
class OrderInDB(OrderInDBBase):
    pass

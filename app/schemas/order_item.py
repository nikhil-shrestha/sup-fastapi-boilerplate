from typing import Optional

from app.schemas.product import Product
from pydantic import BaseModel


# Shared properties
class OrderItemBase(BaseModel):
    order_id: Optional[int]
    product_id: Optional[int]
    quantity: Optional[int]


# Properties to receive via API on creation
class OrderItemCreate(OrderItemBase):
    pass


# Properties to receive via API on update
class OrderItemUpdate(BaseModel):
    pass


class OrderItemInDBBase(OrderItemBase):
    id: int
    product: Product

    class Config:
        orm_mode = True


# Additional properties to return via API
class OrderItem(OrderItemInDBBase):
    pass


class OrderItemInDB(OrderItemInDBBase):
    pass

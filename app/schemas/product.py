from datetime import datetime
from typing import Optional

from pydantic import BaseModel


# Shared properties
class ProductBase(BaseModel):
    name: Optional[str] = None
    desciprition: Optional[str] = None 
    price: Optional[int] = None
    type: Optional[str] = None
    link: Optional[str] = None
    is_preview: Optional[bool] = False
    status: Optional[bool] = True

# Properties to receive via API on creation
class ProductCreate(ProductBase):
    pass


# Properties to receive via API on update
class ProductUpdate(ProductBase):
    pass


class ProductInDBBase(ProductBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


# Additional properties to return via API
class Product(ProductInDBBase):
    pass


# Additional properties stored in DB
class ProductInDB(ProductInDBBase):
    pass

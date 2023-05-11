from typing import Optional

from app.crud.base import CRUDBase
from app.models.product import Product
from app.schemas.product import ProductCreate, ProductUpdate
from sqlalchemy.orm import Session


class CRUDProduct(CRUDBase[Product, ProductCreate, ProductUpdate]):
    def get_by_name(self, db: Session, *, name: str) -> Optional[Product]:
        return db.query(self.model).filter(Product.name == name).first()
    
    def get_by_type(self, db: Session, *, type: str) -> Optional[Product]:
        return db.query(self.model)\
            .filter(Product.type == type)\
            .filter(Product.status == True).first() 


product = CRUDProduct(Product)
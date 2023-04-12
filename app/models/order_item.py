import datetime

from app.db.base_class import Base
from sqlalchemy import Boolean, Column, DateTime, ForeignKey, String, Integer
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import JSONB, TEXT


class OrderItem(Base):
    __tablename__ = "order_items"
    order_id = Column(
       Integer,
        ForeignKey("orders.id"),
        nullable=False,
    )
    product_id = Column(
        Integer,
        ForeignKey("products.id"),
        nullable=False,
    )
    
    id = Column(Integer, primary_key=True, index=True)
    quantity = Column(Integer, default=1)

    product = relationship("Product")
    order = relationship("Order", back_populates="order_items")


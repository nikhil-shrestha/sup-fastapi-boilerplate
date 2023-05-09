import datetime

from app.db.base_class import Base
from sqlalchemy import Boolean, Column, DateTime, ForeignKey, String, Integer
from sqlalchemy.orm import relationship


class Order(Base):
    """
    Database Model for an application user
    """

    id = Column(Integer, primary_key=True, index=True)
    account_id = Column(Integer, index=True)
    status = Column(Boolean(), default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(
        DateTime,
        default=datetime.datetime.utcnow,
        onupdate=datetime.datetime.utcnow,
    )

    account_id = Column(Integer, ForeignKey("accounts.id"))

    order_items = relationship("OrderItem", back_populates="order")


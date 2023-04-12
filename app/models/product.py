import datetime

from app.db.base_class import Base
from sqlalchemy import Boolean, Column, DateTime, Integer, String, Double


class Product(Base):
    """
    Database model for an product
    """

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    price = Column(Double, nullable=False)
    status = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(
        DateTime,
        default=datetime.datetime.utcnow,
        onupdate=datetime.datetime.utcnow,
    )

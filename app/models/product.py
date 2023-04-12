import datetime
import enum

from app.db.base_class import Base
from sqlalchemy import Boolean, Column, DateTime, Integer, String, Double, Text, Enum

class TypeEnum(enum.Enum):
    one = 1
    two = 2
    three = 3

class Product(Base):
    """
    Database model for an product
    """

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    desciprition = Column(Text, nullable=True)
    price = Column(Double, nullable=True)
    link = Column(Text, nullable=True)
    type = Column(String(255), nullable=False)
    is_preview = Column(Boolean, default=False)
    status = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(
        DateTime,
        default=datetime.datetime.utcnow,
        onupdate=datetime.datetime.utcnow,
    )

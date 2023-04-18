import datetime

from app.db.base_class import Base
from sqlalchemy import Boolean, Column, DateTime, Integer, String
from sqlalchemy.orm import relationship


class Facility(Base):
    """
    Database model for an facility
    """

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    icon_url = Column(String(255), nullable=True)
    is_preview = Column(Boolean, default=False)
    is_other = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(
        DateTime,
        default=datetime.datetime.utcnow,
        onupdate=datetime.datetime.utcnow,
    )


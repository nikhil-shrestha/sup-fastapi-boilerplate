import datetime

from app.db.base_class import Base
from sqlalchemy import Boolean, Column, DateTime, Integer, String
from sqlalchemy.orm import relationship


class Application(Base):
    """
    Database model for an application
    """

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    is_preview = Column(Boolean, default=False)
    is_other = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(
        DateTime,
        default=datetime.datetime.utcnow,
        onupdate=datetime.datetime.utcnow,
    )


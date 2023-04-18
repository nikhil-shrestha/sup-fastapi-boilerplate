import datetime

from app.db.base_class import Base
from sqlalchemy import Boolean, Column, DateTime, ForeignKey, String, Integer
from sqlalchemy.orm import relationship


class User(Base):
    """
    Database Model for an application user
    """

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(255), index=True)
    email = Column(String(100), unique=True, index=True, nullable=False)
    phone_number = Column(String(13), unique=True, index=True, nullable=True)
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean(), default=True)
    last_login = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(
        DateTime,
        default=datetime.datetime.utcnow,
        onupdate=datetime.datetime.utcnow,
    )

    account_id = Column(Integer, ForeignKey("accounts.id"), nullable=True)

    user_role = relationship("UserRole", back_populates="user", uselist=False)
    account = relationship("Account", back_populates="users")

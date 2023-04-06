import datetime

from app.db.base_class import Base
from sqlalchemy import Column, DateTime, ForeignKey, String, Integer
from sqlalchemy.orm import relationship


class UserDevice(Base):
    __tablename__ = "user_devices"
    id = Column(Integer, primary_key=True, index=True)
    
    user_id = Column(
       Integer,
        ForeignKey("users.id"),
        nullable=False,
    )
    device_id = Column(
        Integer,
        ForeignKey("devices.id"),
        nullable=False,
    )
    
    server_username = Column(String(255), nullable=True)
    server_password = Column(String(255), nullable=True)
    url = Column(String(255), nullable=True)
    
    # created_at = Column(DateTime, default=datetime.datetime.utcnow)
    # updated_at = Column(
    #     DateTime,
    #     default=datetime.datetime.utcnow,
    #     onupdate=datetime.datetime.utcnow,
    # )
    
    device = relationship("Device")
    user = relationship("User")

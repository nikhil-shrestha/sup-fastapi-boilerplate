import datetime

from app.db.base_class import Base
from sqlalchemy import Column, DateTime, ForeignKey, String, Integer
from sqlalchemy.orm import relationship


class AccountAccessPoint(Base):
    __tablename__ = "account_access_points"
    id = Column(Integer, primary_key=True, index=True)
    
    account_id = Column(
       Integer,
        ForeignKey("accounts.id"),
        nullable=False,
    )
    ap_id = Column(
        Integer,
        ForeignKey("products.id"),
        nullable=False,
    )
    
    name = Column(String(255), nullable=True)
    serial_id = Column(String(255), nullable=True)
    qr_code = Column(String(255), nullable=True)
    nr_band = Column(String(255), nullable=True)
    nr_bandwidth = Column(String(255), nullable=True)
    tx_gain = Column(String(255), nullable=True)
    rx_gain = Column(String(255), nullable=True)
    epc_plmn = Column(String(255), nullable=True)
    status = Column(String(255), nullable=True)
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(
        DateTime,
        default=datetime.datetime.utcnow,
        onupdate=datetime.datetime.utcnow,
    )
    
    access_point = relationship("Product")
    account = relationship("Account")

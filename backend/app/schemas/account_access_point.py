from datetime import datetime
from typing import Optional

from app.schemas.product import Product
from pydantic import BaseModel


# Shared properties
class AccountAccessPointBase(BaseModel):
    account_id: Optional[int]
    ap_id: Optional[int]

class AccountAccessPointInput(AccountAccessPointBase):
    pass

# Properties to receive via API on creation
class AccountAccessPointCreate(AccountAccessPointBase):
    name: Optional[str] = None
    serial_id: Optional[str] = None
    qr_code: Optional[str] = None
    nr_band: Optional[str] = None
    nr_bandwidth: Optional[str] = None
    tx_gain: Optional[str] = None
    rx_gain: Optional[str] = None
    epc_plmn: Optional[str] = None
    pass


# Properties to receive via API on update
class AccountAccessPointUpdate(AccountAccessPointBase):
    status: Optional[str] = None


class AccountAccessPointInDBBase(AccountAccessPointBase):
    id: int
    access_point: Product
    name: Optional[str]
    serial_id: Optional[str]
    qr_code: Optional[str]
    nr_band: Optional[str]
    nr_bandwidth: Optional[str]
    tx_gain: Optional[str]
    rx_gain: Optional[str]
    epc_plmn: Optional[str]
    status: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


# Additional properties to return via API
class AccountAccessPoint(AccountAccessPointInDBBase):
    pass


class AccountAccessPointInDB(AccountAccessPointInDBBase):
    pass

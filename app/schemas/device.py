from datetime import datetime
from typing import Optional

from pydantic import BaseModel


# Shared properties
class DeviceBase(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    type: Optional[str] = None


# Properties to receive via API on creation
class DeviceCreate(DeviceBase):
    pass


# Properties to receive via API on update
class DeviceUpdate(DeviceBase):
    pass


class DeviceInDBBase(DeviceBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


# Additional properties to return via API
class Device(DeviceInDBBase):
    pass


# Additional properties stored in DB
class DeviceInDB(DeviceInDBBase):
    pass

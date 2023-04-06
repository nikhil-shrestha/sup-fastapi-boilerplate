from typing import Optional

from app.schemas.device import Device
from pydantic import  BaseModel


# Shared properties
class UserDeviceBase(BaseModel):
    user_id: Optional[int]
    device_id: Optional[int]
    server_username: Optional[str]
    server_password: Optional[str]
    url: Optional[str]


# Properties to receive via API on creation
class UserDeviceCreate(UserDeviceBase):
    pass


# Properties to receive via API on update
class UserDeviceUpdate(BaseModel):
    device_id: int


class UserDeviceInDBBase(UserDeviceBase):
    id: int
    device: Device

    class Config:
        orm_mode = True


# Additional properties to return via API
class UserDevice(UserDeviceInDBBase):
    pass


class UserDeviceInDB(UserDeviceInDBBase):
    pass

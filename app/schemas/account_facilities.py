from datetime import datetime
from typing import Optional

from app.schemas.facility import Facility
from app.schemas.application import Application
from pydantic import BaseModel


# Shared properties
class AccountFacilitiesBase(BaseModel):
    facility_id: Optional[int]
    application_id: Optional[int]
    no_of_devices: Optional[int]
    floor_plan_image_url: Optional[str]
    access_point_coordinates: Optional[dict]
    no_of_access_point: Optional[int]
    account_id: Optional[int]


# Properties to receive via API on creation
class AccountFacilitiesCreate(AccountFacilitiesBase):
    pass


# Properties to receive via API on update
class AccountFacilitiesUpdate(AccountFacilitiesBase):
    pass


class AccountFacilitiesInDBBase(AccountFacilitiesBase):
    id: int
    facility = Facility
    application = Application
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


# Additional properties to return via API
class AccountFacilities(AccountFacilitiesInDBBase):
    pass


class AccountFacilitiesInDB(AccountFacilitiesInDBBase):
    pass

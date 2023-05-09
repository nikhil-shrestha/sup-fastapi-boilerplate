from datetime import datetime
from typing import Optional

from pydantic import BaseModel


# Shared properties
class FacilityBase(BaseModel):
    name: Optional[str] = None
    icon_url: Optional[str] = None
    is_preview: Optional[bool] = False
    is_other: Optional[bool] = False

# Properties to receive via API on creation
class FacilityCreate(FacilityBase):
    pass


# Properties to receive via API on update
class FacilityUpdate(FacilityBase):
    pass


class FacilityInDBBase(FacilityBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


# Additional properties to return via API
class Facility(FacilityInDBBase):
    pass


# Additional properties stored in DB
class FacilityInDB(FacilityInDBBase):
    pass

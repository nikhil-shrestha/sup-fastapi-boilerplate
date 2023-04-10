from datetime import datetime
from typing import Optional

from pydantic import BaseModel


# Shared properties
class ApplicationBase(BaseModel):
    name: Optional[str] = None
    is_preview: Optional[bool] = False
    is_other: Optional[bool] = False

# Properties to receive via API on creation
class ApplicationCreate(ApplicationBase):
    pass


# Properties to receive via API on update
class ApplicationUpdate(ApplicationBase):
    pass


class ApplicationInDBBase(ApplicationBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


# Additional properties to return via API
class Application(ApplicationInDBBase):
    pass


# Additional properties stored in DB
class ApplicationInDB(ApplicationInDBBase):
    pass

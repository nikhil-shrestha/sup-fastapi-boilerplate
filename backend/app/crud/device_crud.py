from typing import Optional

from app.crud.base import CRUDBase
from app.models.device import Device
from app.schemas.device import DeviceCreate, DeviceUpdate
from sqlalchemy.orm import Session


class CRUDDevice(CRUDBase[Device, DeviceCreate, DeviceUpdate]):
    def get_by_name(self, db: Session, *, name: str) -> Optional[Device]:
        return db.query(self.model).filter(Device.name == name).first()


device = CRUDDevice(Device)

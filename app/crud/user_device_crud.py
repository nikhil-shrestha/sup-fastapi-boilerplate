from typing import Optional

from app.crud.base import CRUDBase
from app.models.device import Device
from app.models.user_device import UserDevice
from app.schemas.user_device import UserDeviceCreate, UserDeviceUpdate
from sqlalchemy.orm import Session


class CRUDUserDevice(CRUDBase[UserDevice, UserDeviceCreate, UserDeviceUpdate]):
    def get_by_user_id(
        self, db: Session, *, user_id: int
    ) -> Optional[UserDevice]:
        return db.query(UserDevice).filter(UserDevice.user_id == user_id).all()
    
    def get_devices_by_user_id(
        self, db: Session, *, user_id: int
    ) -> Optional[Device]:
        list = db.query(UserDevice).filter(UserDevice.user_id == user_id).all()
        print(list)
        return list.device



user_device = CRUDUserDevice(UserDevice)

from typing import Optional

from app.crud.base import CRUDBase
from app.models.application import Application
from app.schemas.application import ApplicationCreate, ApplicationUpdate
from sqlalchemy.orm import Session


class CRUDApplication(CRUDBase[Application, ApplicationCreate, ApplicationUpdate]):
    def get_by_name(self, db: Session, *, name: str) -> Optional[Application]:
        return db.query(self.model).filter(Application.name == name).first()


application = CRUDApplication(Application)

from typing import Optional

from app.crud.base import CRUDBase
from app.models.facility import Facility
from app.schemas.facility import FacilityCreate, FacilityUpdate
from sqlalchemy.orm import Session


class CRUDFacility(CRUDBase[Facility, FacilityCreate, FacilityUpdate]):
    def get_by_name(self, db: Session, *, name: str) -> Optional[Facility]:
        return db.query(self.model).filter(Facility.name == name).first()


facility = CRUDFacility(Facility)

from typing import Any, List

from app import crud, models, schemas
from app.api import deps
from app.constants.role import Role
from fastapi import APIRouter, Body, Depends, HTTPException, Security
from sqlalchemy.orm import Session

router = APIRouter(prefix="/facilities", tags=["facilities"])


@router.get("", response_model=List[schemas.Facility])
def get_facilities(
    *,
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve all facilities.
    """
    facilities = crud.facility.get_multi(db, skip=skip, limit=limit)
    return facilities


@router.post("", response_model=schemas.Facility)
def create_facility(
    *,
    db: Session = Depends(deps.get_db),
    facility_in: schemas.FacilityCreate,
    current_user: models.User = Security(
        deps.get_current_active_user,
        scopes=[Role.ADMIN["name"], Role.SUPER_ADMIN["name"]],
    ),
) -> Any:
    """
    Create a facility.
    """
    # facility = crud.facility.get_by_name(db, name=facility_in.name)
    # if facility:
    #     raise HTTPException(
    #         status_code=409, detail="An account with this name already exists",
    #     )
    facility = crud.facility.create(db, obj_in=facility_in)
    return facility

@router.get("/{facility_id}", response_model=schemas.Facility)
def read_facility_by_id(
    facility_id: int,
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Get a specific facility by id.
    """
    facility = crud.facility.get(db, id=facility_id)
    return facility
  

@router.put("/{facility_id}", response_model=schemas.Facility)
def update_facility(
    *,
    db: Session = Depends(deps.get_db),
    facility_id: int,
    facility_in: schemas.FacilityUpdate,
    current_user: models.User = Security(
        deps.get_current_active_user,
        scopes=[
            Role.ADMIN["name"],
            Role.SUPER_ADMIN["name"],
        ],
    ),
) -> Any:
    """
    Update a facility.
    """

    facility = crud.facility.get(db, id=facility_id)
    if not facility:
        raise HTTPException(
            status_code=404, detail="facility does not exist",
        )
    facility = crud.facility.update(db, db_obj=facility, obj_in=facility_in)
    return facility


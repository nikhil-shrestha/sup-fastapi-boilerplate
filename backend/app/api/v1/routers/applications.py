from typing import Any, List

from app import crud, models, schemas
from app.api import deps
from app.constants.role import Role
from fastapi import APIRouter, Body, Depends, HTTPException, Security
from sqlalchemy.orm import Session

router = APIRouter(prefix="/applications", tags=["applications"])


@router.get("", response_model=List[schemas.Application])
def list_applications(
    *,
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve all applications.
    """
    applications = crud.application.get_multi(db, skip=skip, limit=limit)
    return applications


@router.post("", response_model=schemas.Application)
def create_application(
    *,
    db: Session = Depends(deps.get_db),
    application_in: schemas.ApplicationCreate,
    current_user: models.User = Security(
        deps.get_current_active_user,
        scopes=[Role.ADMIN["name"], Role.SUPER_ADMIN["name"]],
    ),
) -> Any:
    """
    Create a application.
    """
    # application = crud.application.get_by_name(db, name=application_in.name)
    # if application:
    #     raise HTTPException(
    #         status_code=409, detail="An account with this name already exists",
    #     )
    application = crud.application.create(db, obj_in=application_in)
    return application

@router.get("/{application_id}", response_model=schemas.Application)
def read_application_by_id(
    application_id: int,
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Get a specific application by id.
    """
    application = crud.application.get(db, id=application_id)
    return application
  

@router.put("/{application_id}", response_model=schemas.Application)
def update_application(
    *,
    db: Session = Depends(deps.get_db),
    application_id: int,
    application_in: schemas.ApplicationUpdate,
    current_user: models.User = Security(
        deps.get_current_active_user,
        scopes=[
            Role.ADMIN["name"],
            Role.SUPER_ADMIN["name"],
        ],
    ),
) -> Any:
    """
    Update a application.
    """

    application = crud.application.get(db, id=application_id)
    if not application:
        raise HTTPException(
            status_code=404, detail="application does not exist",
        )
    application = crud.application.update(db, db_obj=application, obj_in=application_in)
    return application



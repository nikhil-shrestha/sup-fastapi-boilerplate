from typing import Any, List

from app import crud, models, schemas
from app.api import deps
from app.constants.role import Role
from fastapi import APIRouter, Body, Depends, HTTPException, Security
from sqlalchemy.orm import Session

router = APIRouter(prefix="/devices", tags=["devices"])


@router.get("", response_model=List[schemas.Device])
def get_devices(
    *,
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve all devices.
    """
    devices = crud.device.get_multi(db, skip=skip, limit=limit)
    return devices


@router.post("", response_model=schemas.Device)
def create_device(
    *,
    db: Session = Depends(deps.get_db),
    device_in: schemas.DeviceCreate,
    current_user: models.User = Security(
        deps.get_current_active_user,
        scopes=[Role.ADMIN["name"], Role.SUPER_ADMIN["name"]],
    ),
) -> Any:
    """
    Create a device.
    """
    # device = crud.device.get_by_name(db, name=device_in.name)
    # if device:
    #     raise HTTPException(
    #         status_code=409, detail="An account with this name already exists",
    #     )
    device = crud.device.create(db, obj_in=device_in)
    return device

@router.get("/{device_id}", response_model=schemas.Device)
def read_device_by_id(
    device_id: int,
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Get a specific device by id.
    """
    device = crud.device.get(db, id=device_id)
    return device
  

@router.put("/{device_id}", response_model=schemas.Device)
def update_device(
    *,
    db: Session = Depends(deps.get_db),
    device_id: int,
    device_in: schemas.DeviceUpdate,
    current_user: models.User = Security(
        deps.get_current_active_user,
        scopes=[
            Role.ADMIN["name"],
            Role.SUPER_ADMIN["name"],
        ],
    ),
) -> Any:
    """
    Update a device.
    """

    device = crud.account.get(db, id=device_id)
    if not device:
        raise HTTPException(
            status_code=404, detail="Device does not exist",
        )
    device = crud.device.update(db, db_obj=device, obj_in=device_in)
    return device



@router.post("/{device_id}/add-to-user", response_model=schemas.UserDevice)
def assign_user_devices(
    *,
    db: Session = Depends(deps.get_db),
    device_id: int,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Assign a device to a user.
    """
    device = crud.device.get(db, id=device_id)
    if not device:
        raise HTTPException(
            status_code=404, detail="Device does not exist",
        )
    user_device_in = schemas.UserDeviceCreate(
        user_id=current_user.id,
        device_id=device.id,
    )
    user_device = crud.user_device.create(db, obj_in=user_device_in)
    return user_device

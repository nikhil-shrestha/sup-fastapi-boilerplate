from typing import Any, List

from app import crud, models, schemas
from app.api import deps
from app.constants.role import Role
from fastapi import APIRouter, Body, Depends, HTTPException, Security
from sqlalchemy.orm import Session

import random
import math

router = APIRouter(prefix="/account-facilities", tags=["account-facilities"])


@router.get("", response_model=List[schemas.AccountFacilities])
def list_account_facilities(
    *,
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Security(
        deps.get_current_active_user,
        scopes=[Role.ADMIN["name"], Role.SUPER_ADMIN["name"]],
    ),
) -> Any:
    """
    Retrieve all accounts.
    """
    accounts = crud.account_facilities.get_multi(db, skip=skip, limit=limit)
    return accounts


@router.get("/me", response_model=schemas.AccountFacilities)
def get_account_facilities(
    *,
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Retrieve account for a logged in user.
    """
    account = crud.account_facilities.get(db, id=current_user.account_id)
    return account


@router.get("/{id}", response_model=List[schemas.AccountFacilities])
def read_account_facilities_by_id(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    current_user: models.User = Security(
        deps.get_current_active_user,
        scopes=[Role.ADMIN["name"], Role.SUPER_ADMIN["name"]],
    ),
) -> Any:
    """
    Get a specific account by id.
    """
    account = crud.account.get(db, id=id)
    return account


@router.post("", response_model=schemas.AccountFacilities)
def create_account(
    *,
    db: Session = Depends(deps.get_db),
    account_in: schemas.AccountFacilitiesCreate,
    current_user: models.User = Security(deps.get_current_active_user,),
) -> Any:
    """
    Create an company facilites.
    """
    
    random_number = random.randint(3, 10)
    
    center = (0, 0)
    radius = 5

    # Set the number of points to generate
    # num_points = 5

    # Generate the specified number of random points such that the circles do not intersect
    points = []
    # while len(points) < random_number:
    #     x = random.uniform(center[0] - radius, center[0] + radius)
    #     y = random.uniform(center[1] - radius, center[1] + radius)
    #     is_valid_point = True
    #     for p in points:
    #         if math.sqrt((x - p[0]) ** 2 + (y - p[1]) ** 2) < 2 * radius:
    #             is_valid_point = False
    #             break
    #     if is_valid_point:
    #         points.append((x, y))

    input_dict = account_in.dict()
    
    input_dict['no_of_access_points'] = 1
    input_dict['access_points_coordinates'] = points
    input_dict['account_id'] = current_user.account_id

    print(input_dict)
    
    account_facilities_in = schemas.AccountFacilitiesCreate(**input_dict)
    
    account = crud.account_facilities.create(db, obj_in=account_facilities_in)
    return account


@router.put("/{account_id}", response_model=schemas.AccountFacilities)
def update_account(
    *,
    db: Session = Depends(deps.get_db),
    account_id: int,
    account_in: schemas.AccountFacilitiesUpdate,
    current_user: models.User = Security(
        deps.get_current_active_user,
        scopes=[
            Role.ADMIN["name"],
            Role.SUPER_ADMIN["name"],
            Role.ACCOUNT_ADMIN["name"],
        ],
    ),
) -> Any:
    """
    Update an account.
    """

    # If user is an account admin, check ensure they update their own account.
    if current_user.user_role.role.name == Role.ACCOUNT_ADMIN["name"]:
        if current_user.account_id != account_id:
            raise HTTPException(
                status_code=401,
                detail=(
                    "This user does not have the permissions to "
                    "update this account"
                ),
            )
    account = crud.account_facilities.get(db, id=account_id)
    if not account:
        raise HTTPException(
            status_code=404, detail="Account does not exist",
        )
    account = crud.account_facilities.update(db, db_obj=account, obj_in=account_in)
    return account


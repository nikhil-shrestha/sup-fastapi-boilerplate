from typing import Any, List

from app import crud, models, schemas
from app.api import deps
from app.constants.role import Role
from fastapi import APIRouter, Body, Depends, HTTPException, Security
from sqlalchemy.orm import Session

router = APIRouter(prefix="/account-facilities", tags=["account-facilities"])


@router.get("", response_model=List[schemas.Account])
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
    accounts = crud.account.get_multi(db, skip=skip, limit=limit)
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
    account = crud.account.get(db, id=current_user.account_id)
    return account


@router.get("/{id}", response_model=List[schemas.Account])
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
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Create an user account
    """
    account = crud.account.get_by_name(db, name=account_in.name)
    if account:
        raise HTTPException(
            status_code=409, detail="An account with this name already exists",
        )
    account = crud.account.create(db, obj_in=account_in)
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
    account = crud.account.get(db, id=account_id)
    if not account:
        raise HTTPException(
            status_code=404, detail="Account does not exist",
        )
    account = crud.account.update(db, db_obj=account, obj_in=account_in)
    return account


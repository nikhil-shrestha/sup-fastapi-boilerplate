from typing import Any, List
import uuid
import requests
import time
import qrcode

from app import crud, models, schemas
from app.api import deps
from app.constants.role import Role
from fastapi import APIRouter, Body, Depends, HTTPException, Security
from sqlalchemy.orm import Session

from app.utils.misc import get_random_string

router = APIRouter(prefix="/account-ap", tags=["account_access_point"])


@router.get("", response_model=List[schemas.Account])
def get_account_access_point(
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
    Retrieve all account_access_point.
    """
    account_access_point = crud.account_access_point.get_multi(db, skip=skip, limit=limit)
    return account_access_point


@router.post("", response_model=schemas.AccountAccessPoint)
def create_account_access_point(
    *,
    db: Session = Depends(deps.get_db),
    account_in: schemas.AccountAccessPointInput,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Create an account
    """
    print(account_in)
    product = crud.product.get(db, id=account_in.ap_id)
    if not product:
        raise HTTPException(
            status_code=404, detail="Product ID not found!",
        )
    
    if product.type != "access_point":
        raise HTTPException(
            status_code=403, detail="Invalid Product ID!",
        )
    
    account_ap_in = schemas.AccountAccessPointCreate()
    account_ap_in.ap_id = product.id
    account_ap_in.account_id = current_user.account_id
    
    account_ap_in.name = product.name
    
    serial_num = get_random_string()
    
    account_ap_in.serial_id = serial_num
    
    if product.link:
      response = requests.get(product.link) # default configuration
      data = response.json()
      print(data)
      epc_plmn = data["properties"]["epc_plmn"]["default"]
      tx_gain = data["properties"]["tx_gain"]["default"]
      rx_gain = data["properties"]["rx_gain"]["default"]
      nr_band = data["properties"]["nr_band"]["default"]
      nr_bandwidth = data["properties"]["nr_bandwidth"]["default"]
      account_ap_in.nr_band = nr_band
      account_ap_in.nr_bandwidth = nr_bandwidth
      account_ap_in.epc_plmn = epc_plmn
      account_ap_in.tx_gain = tx_gain
      account_ap_in.rx_gain = rx_gain
      

    # Encoding data using make() function
    img = qrcode.make(serial_num)
    
    # Saving as an image file
    
    filename = str(uuid.uuid4())
    filepath = f'static/{filename}.png'
    img.save(filepath)
    account_ap_in.qr_code = filepath
        
    account = crud.account_access_point.create(db, obj_in=account_ap_in)
    return account


@router.get("/serial_id/{serial_id}", response_model=schemas.AccountAccessPoint)
def get_account_access_point_by_serial_id(
    *,
    db: Session = Depends(deps.get_db),
    serial_id: str,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Create an account
    """
    account = crud.account_access_point.get_by_serial_id(db, serial_id=serial_id)

    if current_user.account_id != account.account_id:
        raise HTTPException(
            status_code=401,
            detail=(
                "This user does not have the permissions for this operation"
            ),
        )
            
    return account

@router.post("/deploy/{serial_id}", response_model=None)
def get_account_access_point_by_serial_id(
    *,
    db: Session = Depends(deps.get_db),
    serial_id: str,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Deploy an account
    """
    account = crud.account_access_point.get_by_serial_id(db, serial_id=serial_id)

    if current_user.account_id != account.account_id:
        raise HTTPException(
            status_code=401,
            detail=(
                "This user does not have the permissions for this operation"
            ),
        )
        
    time.sleep(8)
            
    return { "message": f"Deployed Successfully AP {account.serial_id} with Gain of {account.rx_gain}" }



@router.get("/users/me", response_model=List[schemas.AccountAccessPoint])
def retrieve_access_points_for_own_account(
    *,
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
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
    Retrieve users for own account.
    """
    account = crud.account_access_point.get(db, id=current_user.account_id)
    if not account:
        raise HTTPException(
            status_code=404, detail="Account does not exist",
        )
    account_users = crud.user.get_by_account_id(
        db, account_id=account.id, skip=skip, limit=limit
    )
    return account_users

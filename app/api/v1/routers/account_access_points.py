import os
import subprocess
import uuid
import time
import requests
import qrcode

from typing import Any, List


from app import crud, models, schemas
from app.api import deps
from app.constants.role import Role
from fastapi import APIRouter, Body, Depends, HTTPException, Security
from sqlalchemy.orm import Session

from app.api.v1.routers.networks import write_var_to_file

from app.utils.misc import get_random_string

router = APIRouter(prefix="/account-ap", tags=["account_access_point"])


@router.get("", response_model=List[schemas.AccountAccessPoint])
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
      
    
    url = "https://5fi-new.vercel.app/#/add-ap/?serial=" + serial_num

    # Encoding data using make() function
    img = qrcode.make(url)
    
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
    Retrive Account - Access Point by Serial ID
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
def deploy_access_point_by_serial_id(
    *,
    db: Session = Depends(deps.get_db),
    serial_id: str,
    nr_band: str = Body(...),
    epc_plmn: str = Body(...),
    tx_gain: str = Body(...),
    rx_gain: str = Body(...),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Deploy an account
    """
    account = crud.account_access_point.get_by_serial_id(db, serial_id=serial_id)
    
    if not account:
        raise HTTPException(
            status_code=404,
            detail="The Access Point with this serial_id does not exist in the system",
        )

    if current_user.account_id != account.account_id:
        raise HTTPException(
            status_code=401,
            detail=(
                "This user does not have the permissions for this operation"
            ),
        )
    
    
    accout_update_in = schemas.AccountAccessPointUpdate(
        nr_band = nr_band,
        epc_plmn = epc_plmn,
        tx_gain = tx_gain
    )
    
    account = crud.account_access_point.update(db, db_obj=account, obj_in=accout_update_in)
        
    write_var_to_file(config_file="start_stop.py", variable_name="nr_band", variable_content=nr_band)
    write_var_to_file(config_file="start_stop.py", variable_name="tx_gain", variable_content=tx_gain)
    write_var_to_file(config_file="start_stop.py", variable_name="epc_plmn", variable_content=epc_plmn)
            
    print(subprocess.check_output('pwd'))

    command = "sudo su -c 'slapos console --cfg ~/.slapos/slapos-client.cfg /home/dolcera/5Fi_APIs/Deploy-APIs/start_stop.py'"

    ret = os.system(command)#subprocess.run(command, capture_output=True, shell=True)

    print(ret)
    # result =  f'Deployed Sucessfully with Gain {Sel_Gain}'
            
    return { "message": f"Deployed Successfully AP {account.serial_id} with Gain of {account.rx_gain}" }



@router.get("/users/me/all", response_model=List[schemas.AccountAccessPoint])
def retrieve_access_points_for_own_account(
    *,
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Security(deps.get_current_active_user),
) -> Any:
    """
    Retrieve users for own account.
    """
    account = crud.account_access_point.list_by_account_id(db, account_id=current_user.account_id)
    if not account:
        raise HTTPException(
            status_code=404, detail="Account Point does not exist",
        )
    return account

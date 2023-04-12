from typing import Any, List

from app import crud, models, schemas
from app.api import deps
from app.constants.role import Role
from fastapi import APIRouter, Body, Depends, HTTPException, Security
from sqlalchemy.orm import Session

router = APIRouter(prefix="/orders", tags=["orders"])


@router.get("", response_model=List[schemas.Order])
def get_orders(
    *,
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve all orders.
    """
    orders = crud.order.get_multi(db, skip=skip, limit=limit)
    return orders


@router.post("", response_model=schemas.Order)
def create_order(
    *,
    db: Session = Depends(deps.get_db),
    order_in: schemas.OrderInput,
    current_user: models.User = Security(deps.get_current_active_user,),
) -> Any:
    """
    Create a order.
    """
    # order = crud.order.get_by_name(db, name=order_in.name)
    # if order:
    #     raise HTTPException(
    #         status_code=409, detail="An account with this name already exists",
    #     )
    new_order_in = schemas.OrderCreate(
      account_id=current_user.account_id,
    )
    order = crud.order.create(db, obj_in=new_order_in)
    
    for item in order_in.items:
      new_order_item_in = schemas.OrderItemCreate(
        order_id=order.id,
        product_id=item.product_id,
        quantity=item.quantity,
      )
      order_item = crud.order_item.create(db, obj_in=new_order_item_in)
      order.order_items.append(order_item)
    
    return order

@router.get("/{order_id}", response_model=schemas.Order)
def read_order_by_id(
    order_id: int,
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Get a specific order by id.
    """
    order = crud.order.get(db, id=order_id)
    return order
  

@router.put("/{order_id}", response_model=schemas.Order)
def update_order(
    *,
    db: Session = Depends(deps.get_db),
    order_id: int,
    order_in: schemas.OrderUpdate,
    current_user: models.User = Security(
        deps.get_current_active_user,
        scopes=[
            Role.ADMIN["name"],
            Role.SUPER_ADMIN["name"],
        ],
    ),
) -> Any:
    """
    Update a order.
    """
    order = crud.order.get(db, id=order_id)
    if not order:
        raise HTTPException(
            status_code=404, detail="order does not exist",
        )
    order = crud.order.update(db, db_obj=order, obj_in=order_in)
    return order


@router.get("/users/me/all", response_model=List[schemas.Order])
def retrieve_orders_for_own_account(
    *,
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Security(deps.get_current_active_user),
) -> Any:
    """
    Retrieve users for own account.
    """
    account = crud.order.list_by_account_id(db, account_id=current_user.account_id)
    if not account:
        raise HTTPException(
            status_code=404, detail="Account Point does not exist",
        )
    return account
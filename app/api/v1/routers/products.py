from typing import Any, List

from app import crud, models, schemas
from app.api import deps
from app.constants.role import Role
from fastapi import APIRouter, Body, Depends, HTTPException, Security
from sqlalchemy.orm import Session

router = APIRouter(prefix="/products", tags=["products"])


@router.get("", response_model=List[schemas.Product])
def get_products(
    *,
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve all products.
    """
    products = crud.product.get_multi(db, skip=skip, limit=limit)
    return products


@router.post("", response_model=schemas.Product)
def create_product(
    *,
    db: Session = Depends(deps.get_db),
    product_in: schemas.ProductCreate,
    current_user: models.User = Security(
        deps.get_current_active_user,
        scopes=[Role.ADMIN["name"], Role.SUPER_ADMIN["name"]],
    ),
) -> Any:
    """
    Create a product.
    """
    # product = crud.product.get_by_name(db, name=product_in.name)
    # if product:
    #     raise HTTPException(
    #         status_code=409, detail="An account with this name already exists",
    #     )
    product = crud.product.create(db, obj_in=product_in)
    return product

@router.get("/{product_id}", response_model=schemas.Product)
def read_product_by_id(
    product_id: int,
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Get a specific product by id.
    """
    product = crud.product.get(db, id=product_id)
    return product
  

@router.put("/{product_id}", response_model=schemas.Product)
def update_product(
    *,
    db: Session = Depends(deps.get_db),
    product_id: int,
    product_in: schemas.ProductUpdate,
    current_user: models.User = Security(
        deps.get_current_active_user,
        scopes=[
            Role.ADMIN["name"],
            Role.SUPER_ADMIN["name"],
        ],
    ),
) -> Any:
    """
    Update a product.
    """

    product = crud.product.get(db, id=product_id)
    if not product:
        raise HTTPException(
            status_code=404, detail="Product does not exist",
        )
    product = crud.product.update(db, db_obj=product, obj_in=product_in)
    return product



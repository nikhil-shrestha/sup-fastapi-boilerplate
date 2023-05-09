from datetime import timedelta, datetime
from typing import Any

from app import crud, models, schemas
from app.api import deps
from app.core import security
from app.constants.role import Role
from app.core.config import settings
from fastapi import APIRouter, Body, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from pydantic.networks import EmailStr
from sqlalchemy.orm import Session

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=schemas.Token)
def login_access_token(
    db: Session = Depends(deps.get_db),
    form_data: OAuth2PasswordRequestForm = Depends(),
) -> Any:
    """
    OAuth2 compatible token login, get an access token for future requests
    """
    user = crud.user.authenticate(
        db, email=form_data.username, password=form_data.password
    )
    if not user:
        raise HTTPException(
            status_code=400, detail="Incorrect email or password"
        )
    elif not crud.user.is_active(user):
        raise HTTPException(status_code=400, detail="Inactive user")
   
    access_token_expires = timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )
    
    user_in = schemas.UserUpdate(
        last_login=datetime.now()
    )
    user = crud.user.update(db, db_obj=user, obj_in=user_in)
    
    if not user.user_role:
        role = "GUEST"
    else:
        role = user.user_role.role.name
    
    token_payload = {
        "id": str(user.id),
        "role": role,
        "account_id": str(user.account_id),
    }
    
    return {
        "access_token": security.create_access_token(
            token_payload, expires_delta=access_token_expires
        ),
        "token_type": "bearer",
    }



@router.post("/register", response_model=schemas.Token)
def register(
    *,
    db: Session = Depends(deps.get_db),
    email: EmailStr = Body(...),
    password: str = Body(...),
    full_name: str = Body(...),
    company_name: str = Body(...),
    phone_number: str = Body(None),
) -> Any:
    """
    Register new user.
    """
    if not settings.USERS_OPEN_REGISTRATION:
        raise HTTPException(
            status_code=403,
            detail="Open user registration is forbidden on this server",
        )
    user = crud.user.get_by_email(db, email=email)
    if user:
        raise HTTPException(
            status_code=409,
            detail="The user with this username already exists in the system",
        )
        
    user_in = schemas.UserCreate(
        email=email,
        password=password,
        full_name=full_name,
        phone_number=phone_number,
    )
    
    # create new account/company
    if (company_name):
        account_in = schemas.AccountCreate(name=company_name)
        account = crud.account.create(db, obj_in=account_in)
        
        user_in.account_id = account.id
    
    # create user
    user = crud.user.create(db, obj_in=user_in)

    # get role
    role = crud.role.get_by_name(db, name=Role.ACCOUNT_ADMIN["name"])

    # assign user_role
    user_role_in = schemas.UserRoleCreate(
        user_id=user.id,
        role_id=role.id
    )
    user_role = crud.user_role.create(db, obj_in=user_role_in)

    print(user)
    
    access_token_expires = timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )
    if not user.user_role:
        role = "GUEST"
    else:
        role = user.user_role.role.name
    token_payload = {
        "id": str(user.id),
        "role": role,
        "account_id": str(user.account_id),
    }
    return {
        "access_token": security.create_access_token(
            token_payload, expires_delta=access_token_expires
        ),
        "token_type": "bearer",
    }

@router.post("/test-token", response_model=schemas.User)
def test_token(
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """
    Test access token
    """
    return current_user


@router.post("/hash-password", response_model=str)
def hash_password(password: str = Body(..., embed=True),) -> Any:
    """
    Hash a password
    """
    return security.get_password_hash(password)

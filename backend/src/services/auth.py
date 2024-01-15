from typing import Annotated
from datetime import datetime
from fastapi import status, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm

from ..schema.user import RegistrationUserRepsonse, UserResponse, UserRegister
from ..utils.security.crypt import get_password_hash, verify_password

# TO DO
# Move keys to secrets, currently here just for logic implementation
SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


async def register_user(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db
) -> RegistrationUserRepsonse:
    email = form_data.username

    # TO DO
    # Make request to db client to see if user with email already exists
    if await user_registered(email, db):
        raise HTTPException(
            detail="Email is already registered", status_code=status.HTTP_409_CONFLICT
        )

    hashed_password = get_password_hash(form_data.password)
    created_at = datetime.utcnow()

    # TO DO
    # Add new user data to DB
    new_user = UserRegister(
        email=email, password=hashed_password, created_at=created_at
    )
    db[email] = new_user.model_dump()

    # Firestore assigns id if not specified
    # When adding to firestore, reference is returned so change later
    new_user_ref = {"id": 232}

    return RegistrationUserRepsonse(
        message="User registration successful",
        data=UserResponse(id=3232, email=email, created_at=created_at),
    )


async def login_user(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db):
    email = form_data.username

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials"
    )

    if not await user_registered(email, db):
        raise credentials_exception

    # TO DO
    # Get user password (hashed + salt) from Firestore
    valid_password = db.get("email")["password"]

    if not verify_password(form_data.password, valid_password):
        raise credentials_exception

    return {"message": "Successful"}


async def user_registered(email: str, db) -> bool:
    # TO DO
    # Make request to db and check if user registered
    query_result = db.get(email)

    return len(query_result) != 0

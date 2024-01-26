from datetime import datetime, timedelta
from typing import Annotated

from fastapi import Depends, Header, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import jwt

from ..schema.token import TokenResponse
from ..schema.user import RegistrationUserRepsonse, UserRegister, UserResponse
from ..utils.security.auth import create_access_token, create_refresh_token
from ..utils.security.crypt import get_password_hash, verify_password

ACCESS_TOKEN_EXPIRE_MINUTES = 10
ACCESS_TOKEN_SECRET_KEY = (
    "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
)
REFRESH_TOKEN_SECRET_KEY = (
    "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
)
ALGORITHM = "HS256"

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/token")


async def get_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db
) -> TokenResponse:
    email = form_data.username
    raw_password = form_data.password
    user = db.get(email)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    hashed_password = user.get("password")

    if not verify_password(raw_password, hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    payload = {"email": email}
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(payload, access_token_expires)
    refresh_token = create_refresh_token(payload)

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        expires=access_token_expires.seconds,
    )


async def get_refresh_token(refresh_token: Annotated[str, Header] = Header(), db=None):
    payload = jwt.decode(
        refresh_token, REFRESH_TOKEN_SECRET_KEY, algorithms=[ALGORITHM]
    )
    email = payload.get("sub", None)

    if not email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = db.get(email)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    payload = {"email": email}
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(payload, access_token_expires)

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        expires=access_token_expires.seconds,
    )


async def get_current_user(_token: Annotated[str, Depends(oauth2_scheme)]):
    _credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )


async def register_user(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db
) -> RegistrationUserRepsonse:
    email = form_data.username

    # TODO
    # Make request to db client to see if user with email already exists
    if await user_registered(email, db):
        raise HTTPException(
            detail="Email is already registered", status_code=status.HTTP_409_CONFLICT
        )

    hashed_password = get_password_hash(form_data.password)
    created_at = datetime.utcnow()

    # TODO
    # Add new user data to DB
    new_user = UserRegister(
        email=email, password=hashed_password, created_at=created_at
    )
    db[email] = new_user.model_dump()

    # Firestore assigns id if not specified
    # When adding to firestore, reference is returned so change later
    _new_user_ref = {"id": 232}

    return RegistrationUserRepsonse(
        message="User registration successful",
        data=UserResponse(id=3232, email=email, created_at=created_at),
    )


async def login_user(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db):
    email = form_data.username

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid credentials",
        headers={"WWW-Authenticate": "Bearer"},
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

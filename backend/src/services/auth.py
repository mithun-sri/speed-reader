from datetime import datetime, timedelta
from typing import Annotated

from fastapi import Depends, Header
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import jwt

from ..schemas.token import TokenResponse, TokenData
from ..schemas.user import RegistrationUserRepsonse, UserRegister, UserResponse
from ..utils.auth import (
    ACCESS_TOKEN_EXPIRE_MINUTES,
    ACCESS_TOKEN_SECRET_KEY,
    ALGORITHM,
    REFRESH_TOKEN_SECRET_KEY,
    create_access_token,
    create_refresh_token,
)
from ..utils.crypt import get_password_hash, verify_password
from .exceptions import (
    EmailAlreadyUsedException,
    InvalidCredentialsException,
    InvalidTokenException,
)
from ..database import Session, get_session
from ..models.user import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/token")


async def get_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db
) -> TokenResponse:
    email = form_data.username
    raw_password = form_data.password
    user = db.get(email)

    if not user:
        raise InvalidCredentialsException()

    hashed_password = user.get("password")

    if not verify_password(raw_password, hashed_password):
        raise InvalidCredentialsException()

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
        raise InvalidTokenException()

    user = db.get(email)

    if not user:
        raise InvalidTokenException()

    payload = {"email": email}
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(payload, access_token_expires)

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        expires=access_token_expires.seconds,
    )


async def get_current_user(_token: Annotated[str, Depends(oauth2_scheme)], session: Annotated[Session, Depends(get_session)]) -> UserResponse:
    try:
        payload = jwt.decode(_token, ACCESS_TOKEN_SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if username is None:
            raise InvalidCredentialsException()
        token_data = TokenData(username=username)
    except jwt.JWTError:
        raise InvalidCredentialsException()
    user = session.query(User).filter(User.username == token_data.username).first()
    if user is None:
        raise InvalidCredentialsException()
    return UserResponse(id=user.id, email=user.username, created_at=user.created_at)

async def register_user(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db
) -> RegistrationUserRepsonse:
    email = form_data.username

    # TODO: Make request to db client to see if user with email already exists
    if await user_registered(email, db):
        raise EmailAlreadyUsedException(email=email)

    hashed_password = get_password_hash(form_data.password)
    created_at = datetime.utcnow()

    # TODO: Add new user data to DB
    new_user = UserRegister(
        email=email, password=hashed_password, created_at=created_at
    )
    db[email] = new_user.model_dump()

    # Firestore assigns id if not specified
    # When adding to firestore, reference is returned so change later
    _new_user_ref = {"id": 232}

    return RegistrationUserRepsonse(
        # TODO: No need to return this message - client should be able to tell by the status code.
        # TODO: Also no need to prepare dedicated Pydantic model for this.
        message="User registration successful",
        data=UserResponse(id=3232, email=email, created_at=created_at),
    )


async def login_user(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db):
    email = form_data.username

    if not await user_registered(email, db):
        raise InvalidCredentialsException()

    # TODO: Get user password (hashed + salt) from Firestore.
    valid_password = db.get("email")["password"]

    if not verify_password(form_data.password, valid_password):
        raise InvalidCredentialsException()

    return {"message": "Successful"}


async def user_registered(email: str, db) -> bool:
    # TODO: Make request to db and check if user registered.
    query_result = db.get(email)

    return len(query_result) != 0

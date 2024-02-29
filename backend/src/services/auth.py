import os
import secrets
from typing import Annotated

from fastapi import Cookie, Depends, HTTPException, Response, status
from fastapi.security import HTTPBasic, HTTPBasicCredentials, OAuth2PasswordBearer
from sqlalchemy import select

from ..database import Session, get_session
from ..models.user import User
from ..utils.auth import get_access_token_payload
from .exceptions import (
    AlreadyAuthenticatedException,
    InvalidRoleException,
    InvalidTokenException,
    NotAuthenticatedException,
    TokenNotFoundException,
    UserNotFoundException,
)

TOKEN_URL = "/api/v1/auth/token"

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=TOKEN_URL)
basic_scheme = HTTPBasic()


def set_response_tokens(
    response: Response,
    access_token: str,
    refresh_token: str,
):
    response.set_cookie(
        "refresh_token",
        refresh_token,
        secure=True,
        httponly=True,
        samesite="strict",
        path=TOKEN_URL,
    )
    response.set_cookie(
        "access_token",
        access_token,
        secure=True,
        httponly=True,
        samesite="strict",
    )


def get_current_user_or_none(
    *,
    access_token: Annotated[str | None, Cookie()] = None,
    session: Annotated[Session, Depends(get_session)],
) -> User | None:
    if not access_token:
        raise TokenNotFoundException()

    payload = get_access_token_payload(access_token)
    username = payload.get("sub")
    if not username:
        raise InvalidTokenException()

    query = select(User).where(User.username == username)
    user = session.scalars(query).one_or_none()
    return user


def get_current_user(
    *,
    access_token: Annotated[str | None, Cookie()] = None,
    session: Annotated[Session, Depends(get_session)],
) -> User:
    user = get_current_user_or_none(access_token=access_token, session=session)
    if not user:
        # TODO: Raise proper exception.
        raise UserNotFoundException(user_id=None)
    return user


def verify_auth(
    user: Annotated[User, Depends(get_current_user_or_none)],
):
    if not user:
        raise NotAuthenticatedException()


def verify_guest(
    *,
    access_token: Annotated[str | None, Cookie()] = None,
    session: Annotated[Session, Depends(get_session)],
):
    try:
        # If it successfully gets user then raise exception.
        get_current_user(access_token=access_token, session=session)
        raise AlreadyAuthenticatedException()
    except Exception:
        pass


def verify_admin(
    user: Annotated[User, Depends(get_current_user)],
):
    if user.role != "admin":
        raise InvalidRoleException("admin")


def verify_user(
    user: Annotated[User, Depends(get_current_user)],
):
    if user.role != "user":
        raise InvalidRoleException("user")


TESTING_USERNAME = os.environ.get("TESTING_USERNAME")
TESTING_PASSWORD = os.environ.get("TESTING_PASSWORD")


def verify_testing(credentials: Annotated[HTTPBasicCredentials, Depends(basic_scheme)]):
    # NOTE:
    # Only raise exceptions if this dependency is used in testing environment.
    # In development, staging or production these environment variable may/should not be present.
    if not TESTING_USERNAME:
        raise Exception("TESTING_USERNAME environment variable not set")
    if not TESTING_PASSWORD:
        raise Exception("TESTING_PASSWORD environment variable not set")

    if not TESTING_USERNAME or not TESTING_PASSWORD:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No testing credentials",
            headers={"WWW-Authenticate": "Basic"},
        )

    is_correct_username = secrets.compare_digest(
        credentials.username.encode("utf8"),
        TESTING_USERNAME.encode("utf8"),
    )
    is_correct_password = secrets.compare_digest(
        credentials.password.encode("utf8"),
        TESTING_PASSWORD.encode("utf8"),
    )
    if not (is_correct_username and is_correct_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Basic"},
        )

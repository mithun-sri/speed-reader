import secrets
from typing import Annotated

from fastapi import Cookie, Depends, HTTPException, Response, status
from fastapi.security import HTTPBasic, HTTPBasicCredentials, OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy import select

from ..database import Session, get_session
from ..models.user import User
from ..utils.auth import ACCESS_TOKEN_SECRET_KEY, ALGORITHM
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

    try:
        payload = jwt.decode(
            access_token,
            ACCESS_TOKEN_SECRET_KEY,
            algorithms=[ALGORITHM],
        )
    except JWTError:
        raise InvalidTokenException()

    username = payload.get("sub")
    if not username:
        raise InvalidTokenException()

    query = select(User).filter(User.username == username)
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


# TODO:
# Move keys to GitLab CI/CD secrets
TESTING_USERNAME = b"admin"
TESTING_PASSWORD = b"sAzGmYEoi4#Y9jX3oue#U59Fg^p&%D55"


def verify_testing(credentials: Annotated[HTTPBasicCredentials, Depends(basic_scheme)]):
    is_correct_username = secrets.compare_digest(
        credentials.username.encode("utf8"),
        TESTING_USERNAME,
    )
    is_correct_password = secrets.compare_digest(
        credentials.password.encode("utf8"),
        TESTING_PASSWORD,
    )
    if not (is_correct_username and is_correct_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Basic"},
        )

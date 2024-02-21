from typing import Annotated

from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from jose import jwt
from sqlalchemy import select

from ..database import Session, get_session
from ..models.user import User
from ..utils.auth import ACCESS_TOKEN_SECRET_KEY, ALGORITHM
from .exceptions import InvalidCredentialsException

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/api/v1/auth/token",  # TODO: Refactor
)


async def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)],
    session: Annotated[Session, Depends(get_session)],
) -> User:
    payload = jwt.decode(token, ACCESS_TOKEN_SECRET_KEY, algorithms=[ALGORITHM])
    username = payload.get("sub")
    if not username:
        raise InvalidCredentialsException()

    query = select(User).filter(User.username == username)
    user = session.scalars(query).one_or_none()
    if not user:
        raise InvalidCredentialsException()

    return user

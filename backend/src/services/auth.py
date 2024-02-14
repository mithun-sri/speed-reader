from typing import Annotated

from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from jose import jwt

from ..database import Session, get_session
from ..models.user import User
from ..schemas.user import UserResponse
from ..utils.auth import ACCESS_TOKEN_SECRET_KEY, ALGORITHM
from .exceptions import InvalidCredentialsException

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/token")


async def get_current_user(
    _token: Annotated[str, Depends(oauth2_scheme)],
    session: Annotated[Session, Depends(get_session)],
) -> UserResponse:
    payload = jwt.decode(_token, ACCESS_TOKEN_SECRET_KEY, algorithms=[ALGORITHM])
    username = payload.get("sub")
    if username is None:
        raise InvalidCredentialsException()
    user = session.query(User).filter(User.username == username).first()
    if user is None:
        raise InvalidCredentialsException()
    return UserResponse(
        id=user.id, username=user.username, email=user.email, created_at=user.created_at
    )

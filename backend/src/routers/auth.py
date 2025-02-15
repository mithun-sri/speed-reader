from typing import Annotated

from fastapi import APIRouter, Cookie, Depends, Response
from jose import JWTError, jwt
from sqlalchemy import select

from ..database import Session, get_session
from ..logger import LoggerRoute
from ..models import User
from ..services.auth import set_response_tokens
from ..services.exceptions import (
    InvalidCredentialsException,
    InvalidTokenException,
    TokenNotFoundException,
)
from ..utils.auth import ALGORITHM, REFRESH_TOKEN_SECRET_KEY, create_access_token

router = APIRouter(
    prefix="/auth",
    tags=["auth"],
    route_class=LoggerRoute,
)


# NOTE:
# Do not add `verify_auth` to the dependencies otherwise it will fail
# if access token is invalid regardless of whether refresh token is still valid.
@router.post("/token")
async def get_token(
    *,
    refresh_token: Annotated[str | None, Cookie()] = None,
    response: Response,
    session: Annotated[Session, Depends(get_session)],
):
    """
    User passes their refresh token to get a new access token.
    TODO: Invalidate refresh token on use.
    """
    if not refresh_token:
        raise TokenNotFoundException()

    try:
        payload = jwt.decode(
            refresh_token,
            REFRESH_TOKEN_SECRET_KEY,
            algorithms=[ALGORITHM],
        )
    except JWTError:
        raise InvalidTokenException()

    username = payload.get("sub")
    if username is None:
        raise InvalidTokenException()

    query = select(User).where(User.username == username)
    user = session.scalars(query).one_or_none()
    if user is None:
        raise InvalidCredentialsException()

    access_token = create_access_token(data={"sub": user.username})
    set_response_tokens(response, access_token, refresh_token)

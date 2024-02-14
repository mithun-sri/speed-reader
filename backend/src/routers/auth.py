from typing import Annotated

from fastapi import APIRouter, Depends
from jose import JWTError, jwt

from ..database import Session, get_session
from ..logger import LoggerRoute
from ..models import User
from ..schemas.token import Token
from ..services.exceptions import InvalidCredentialsException, InvalidTokenException
from ..utils.auth import ALGORITHM, REFRESH_TOKEN_SECRET_KEY, create_access_token

router = APIRouter(prefix="/auth", tags=["auth"], route_class=LoggerRoute)


@router.post("/token")
async def get_token(
    refresh_token: str,
    session: Annotated[Session, Depends(get_session)],
):
    """
    User passes their refresh token to get a new access token.
    TODO: Validate the refresh token.
    """
    try:
        payload = jwt.decode(
            refresh_token, REFRESH_TOKEN_SECRET_KEY, algorithms=[ALGORITHM]
        )
        username = payload.get("sub")
    except JWTError:
        raise InvalidTokenException()
    if username is None:
        raise InvalidTokenException()
    user = session.query(User).filter(User.username == username).first()
    if user is None:
        raise InvalidCredentialsException()
    return Token(
        access_token=create_access_token(data={"sub": username}),
        refresh_token=refresh_token,
        token_type="bearer",
    )

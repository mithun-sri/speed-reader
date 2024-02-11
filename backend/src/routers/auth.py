from typing import Annotated

from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm
from jose import jwt

from ..database import Session, get_session
from ..logger import LoggerRoute
from ..models import User
from ..schemas.token import Token, TokenData
from ..services.exceptions import InvalidCredentialsException, InvalidTokenException
from ..utils.auth import (
    ALGORITHM,
    REFRESH_TOKEN_SECRET_KEY,
    create_access_token,
    create_refresh_token,
)
from ..utils.crypt import verify_password

router = APIRouter(prefix="/auth", tags=["auth"], route_class=LoggerRoute)


@router.post("/token")
async def get_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    session: Annotated[Session, Depends(get_session)],
):
    username = form_data.username
    password = form_data.password
    user = session.query(User).filter(User.username == username).first()
    if not user:
        raise InvalidCredentialsException()
    if not verify_password(password, user.password):
        raise InvalidCredentialsException()
    access_token = create_access_token(data={"sub": form_data.username})
    refresh_token = create_refresh_token(data={"sub": form_data.username})
    return Token(
        access_token=access_token, refresh_token=refresh_token, token_type="bearer"
    )


@router.post("/refresh")
async def refresh_access_token(refresh_token: str):
    payload = jwt.decode(
        refresh_token, REFRESH_TOKEN_SECRET_KEY, algorithms=[ALGORITHM]
    )
    username = payload.get("sub")
    if username is None:
        raise InvalidTokenException()
    token_data = TokenData(username=username)
    access_token = create_access_token(data={"sub": token_data.username})
    return Token(
        access_token=access_token, refresh_token=refresh_token, token_type="bearer"
    )

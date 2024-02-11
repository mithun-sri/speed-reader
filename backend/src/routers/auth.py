from typing import Annotated

from fastapi import APIRouter, Depends, Header, status
from fastapi.security import OAuth2PasswordRequestForm

from ..logger import LoggerRoute
from ..schemas.token import Token
from ..utils.auth import create_access_token, create_refresh_token
from ..database import Session, get_session
from ..models import User
from ..utils.crypt import verify_password
from ..services.exceptions import InvalidCredentialsException, InvalidTokenException
from ..schemas.token import TokenData
from ..utils.auth import ALGORITHM, REFRESH_TOKEN_SECRET_KEY
from jose import jwt

router = APIRouter(prefix="/auth", tags=["auth"], route_class=LoggerRoute)

@router.post("/token")
async def get_token(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], session: Annotated[Session, Depends(get_session)]):
    # TODO: No need to extract this `get_token` function into a separate service
    # - this makes it harder to keep track of logic and request/response models.
    username = form_data.username
    password = form_data.password
    user = session.query(User).filter(User.username == username).first()
    if not user:
        raise InvalidCredentialsException()
    
    if not verify_password(password, user.password):
        raise InvalidCredentialsException()
    access_token = create_access_token(data={"sub": form_data.username})
    refresh_token = create_refresh_token(data={"sub": form_data.username})
    return Token(access_token=access_token, refresh_token=refresh_token, token_type="bearer")

@router.post("/refresh")
async def refresh_token(refresh_token: str, session: Annotated[Session, Depends(get_session)]):
    try:
        payload = jwt.decode(refresh_token, REFRESH_TOKEN_SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if username is None:
            raise InvalidTokenException()
        token_data = TokenData(username=username)
    except jwt.JWTError:
        raise InvalidTokenException()
    access_token = create_access_token(data={"sub": token_data.username})
    return Token(access_token=access_token, refresh_token=refresh_token, token_type="bearer")
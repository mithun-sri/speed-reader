from typing import Annotated

from fastapi import APIRouter, Depends, Header, status
from fastapi.security import OAuth2PasswordRequestForm

from ..logger import LoggerRoute
from ..services.auth import get_refresh_token
from ..schemas.token import Token
from ..utils.auth import create_access_token
from ..database import Session, get_session
from ..models import User
from ..utils.crypt import verify_password
from ..services.exceptions import InvalidCredentialsException

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
    return Token(access_token=access_token, token_type="Bearer")

@router.post("/refresh", status_code=status.HTTP_200_OK)
# TODO: Use `Annotated` instead of default value for `refresh_token`.
async def refresh_access_token(refresh_token=Header()):
    # TODO: Rename `get_refresh_token` to `refresh_access_token`.
    return await get_refresh_token(refresh_token=refresh_token, db=db)

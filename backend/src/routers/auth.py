from typing import Annotated
from fastapi import APIRouter, status, Depends, Header
from fastapi.security import OAuth2PasswordRequestForm

from ..services.auth import get_token, get_refresh_token

router = APIRouter(
    prefix="/auth",
    tags=["auth"]
)

db = {"dwdw@gmail.com": {"email": "dwdw@gmail.com", "password": "$2b$12$KBRMXmFCxhG8P1MlMEVXkuB7NGnyadKLnZxGVG5kFRgvw568YJV8."}}

@router.post("/token", status_code=status.HTTP_200_OK)
async def authenticate_user(form_data: Annotated[OAuth2PasswordRequestForm, Depends()]):
    return await get_token(form_data=form_data, db=db)

@router.post("/refresh", status_code=status.HTTP_200_OK)
async def refresh_access_token(refresh_token = Header()):
    return await get_refresh_token(refresh_token=refresh_token, db=db)
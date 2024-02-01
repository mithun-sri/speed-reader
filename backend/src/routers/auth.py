from typing import Annotated

from fastapi import APIRouter, Depends, Header, status
from fastapi.security import OAuth2PasswordRequestForm

from ..logger import LoggerRoute
from ..services.auth import get_refresh_token, get_token

router = APIRouter(prefix="/auth", tags=["auth"], route_class=LoggerRoute)

db = {
    "dwdw@gmail.com": {
        "email": "dwdw@gmail.com",
        "password": "$2b$12$KBRMXmFCxhG8P1MlMEVXkuB7NGnyadKLnZxGVG5kFRgvw568YJV8.",
    }
}


# TODO: No need to set `status_code` here.
# TODO: Rename `authenticate_user` to `get_token`.
# TODO: Specify `response_model` for this endpoint.
@router.post("/token", status_code=status.HTTP_200_OK)
async def authenticate_user(form_data: Annotated[OAuth2PasswordRequestForm, Depends()]):
    # TODO: Pass actual database session instead of `db`.
    # TODO: No need to extract this `get_token` function into a separate service
    # - this makes it harder to keep track of logic and request/response models.
    return await get_token(form_data=form_data, db=db)


@router.post("/refresh", status_code=status.HTTP_200_OK)
# TODO: Use `Annotated` instead of default value for `refresh_token`.
async def refresh_access_token(refresh_token=Header()):
    # TODO: Rename `get_refresh_token` to `refresh_access_token`.
    return await get_refresh_token(refresh_token=refresh_token, db=db)

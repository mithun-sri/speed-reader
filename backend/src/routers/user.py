from fastapi import status, APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm
from typing import Annotated

from ..schema.user import RegistrationUserRepsonse
from ..services.auth import login_user, register_user

router = APIRouter(prefix="/user", tags=["user"])

user_db = {}


@router.post("/auth/signup", status_code=status.HTTP_201_CREATED, tags=["auth"])
async def user_signup(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()]
) -> RegistrationUserRepsonse:
    response = await register_user(form_data, user_db)

    return response


@router.post("/auth/login", tags=["auth"])
async def user_login(form_data: Annotated[OAuth2PasswordRequestForm, Depends()]):
    response = await login_user(form_data, user_db)

    return response


@router.get("/summary")
def get_user_summary():
    pass

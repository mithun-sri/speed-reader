from fastapi import status, APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm
from typing import Annotated

from ..schema.user import RegistrationUserRepsonse
from ..services.auth import login_user, register_user

router = APIRouter(prefix="/user", tags=["user"])

user_db = {}


@router.get("/summary")
def get_user_summary():
    pass

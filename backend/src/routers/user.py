# from typing import Annotated

from fastapi import APIRouter

# from ..schema.user import RegistrationUserRepsonse
# from ..services.auth import login_user, register_user
# from fastapi.security import OAuth2PasswordRequestForm


router = APIRouter(prefix="/user", tags=["user"])

user_db = {}


@router.get("/summary")
def get_user_summary():
    pass

from datetime import datetime

from pydantic import BaseModel


class UserRegister(BaseModel):
    email: str
    password: str
    created_at: datetime


class UserLogin(BaseModel):
    email: str
    password: str


# TODO: Update fields of `UserResponse` class.
# TODO: Rename `UserResponse` to `User` - read models in Pydantic are named without any suffix.
class UserResponse(BaseModel):
    id: int
    email: str
    created_at: datetime

    class Config:
        from_attributes = True


class RegistrationUserRepsonse(BaseModel):
    message: str
    data: UserResponse

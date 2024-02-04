from fastapi import Request
from fastapi.responses import JSONResponse

from .exceptions import (
    EmailAlreadyUsedException,
    InvalidCredentialsException,
    InvalidTokenException,
    UserAlreadyExistsException,
    UserNotFoundException,
)


async def invalid_credentials_exception_handler(
    request: Request,  # pylint: disable=unused-argument
    exc: InvalidCredentialsException,
):
    return JSONResponse(
        status_code=exc.status_code,
        content={"message": "Oops! The provided credentials are invalid."},
    )


async def invalid_token_exception_handler(
    request: Request, exc: InvalidTokenException  # pylint: disable=unused-argument
):
    return JSONResponse(
        status_code=exc.status_code,
        content={"message": exc.detail},
    )


async def user_not_found_exception_handler(
    request: Request, exc: UserNotFoundException  # pylint: disable=unused-argument
):
    return JSONResponse(
        status_code=exc.status_code,
        content={"message": f"Oops! User {exc.username} could not be found."},
    )


async def user_already_exists_exception_handler(
    request: Request, exc: UserAlreadyExistsException  # pylint: disable=unused-argument
):
    return JSONResponse(
        status_code=exc.status_code,
        content={"message": f"Oops! {exc.username} is already in use by another user."},
    )


async def email_already_used_exception_handler(
    request: Request, exc: EmailAlreadyUsedException  # pylint: disable=unused-argument
):
    return JSONResponse(
        status_code=exc.status_code,
        content={"message": f"Oops! {exc.email} is already in use by another user."},
    )

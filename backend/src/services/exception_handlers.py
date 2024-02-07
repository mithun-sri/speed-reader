from fastapi import Request
from fastapi.responses import JSONResponse

from .exceptions import (
    DuplicateQuestionsException,
    EmailAlreadyUsedException,
    HistoryNotFoundException,
    InvalidCredentialsException,
    InvalidTokenException,
    NotEnoughQuestionsException,
    QuestionNotBelongToTextException,
    QuestionNotFoundException,
    TextNotFoundException,
    UserAlreadyExistsException,
    UserNotFoundException,
)


async def invalid_credentials_exception_handler(
    _request: Request,
    exc: InvalidCredentialsException,
):
    return JSONResponse(
        status_code=exc.status_code,
        content={"message": "Oops! The provided credentials are invalid."},
    )


async def invalid_token_exception_handler(
    _request: Request,
    exc: InvalidTokenException,
):
    return JSONResponse(
        status_code=exc.status_code,
        content={"message": exc.detail},
    )


async def user_not_found_exception_handler(
    _request: Request,
    exc: UserNotFoundException,
):
    return JSONResponse(
        status_code=exc.status_code,
        content={"message": f"Oops! User {exc.user_id} could not be found."},
    )


async def user_already_exists_exception_handler(
    _request: Request,
    exc: UserAlreadyExistsException,
):
    return JSONResponse(
        status_code=exc.status_code,
        content={"message": f"Oops! {exc.username} is already in use by another user."},
    )


async def email_already_used_exception_handler(
    _request: Request,
    exc: EmailAlreadyUsedException,
):
    return JSONResponse(
        status_code=exc.status_code,
        content={"message": f"Oops! {exc.email} is already in use by another user."},
    )


async def text_not_found_exception_handler(
    _request: Request,
    exc: TextNotFoundException,
):
    return JSONResponse(
        status_code=exc.status_code,
        content={"message": f"Oops! Text {exc.text_id} could not be found."},
    )


async def question_not_found_exception_handler(
    _request: Request,
    exc: QuestionNotFoundException,
):
    return JSONResponse(
        status_code=exc.status_code,
        content={"message": f"Oops! Question {exc.question_id} could not be found."},
    )


async def not_enough_questions_exception_handler(
    _request: Request,
    exc: NotEnoughQuestionsException,
):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "message": f"Oops! Text {exc.text_id} does not have enough questions."
        },
    )


async def duplicate_questions_exception_handler(
    _request: Request,
    exc: DuplicateQuestionsException,
):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "message": f"Oops! Question {exc.question_id} has been answered already."
        },
    )


async def question_not_belong_to_text_exception_handler(
    _request: Request,
    exc: QuestionNotBelongToTextException,
):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "message": f"Oops! Question {exc.question_id} does not belong to text {exc.text_id}."
        },
    )


async def history_not_found_exception_handler(
    _request: Request,
    exc: HistoryNotFoundException,
):
    return JSONResponse(
        status_code=exc.status_code,
        content={"message": f"Oops! History {exc.history_id} could not be found."},
    )

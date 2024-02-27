import logging

from fastapi import Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from .exceptions import (
    BadResponseFromOpenAI,
    DuplicateAnswersException,
    EmailAlreadyUsedException,
    HistoryNotFoundException,
    InvalidCredentialsException,
    InvalidRoleException,
    InvalidTokenException,
    NotAuthenticatedException,
    NotEnoughAnswersException,
    NotEnoughQuestionsException,
    NoTextAvailableException,
    QuestionNotBelongToTextException,
    QuestionNotFoundException,
    TextAlreadyExistsException,
    TextNotFoundException,
    TokenNotFoundException,
    UserAlreadyExistsException,
    UserNotFoundException,
)


async def validation_exception_handler(
    _request: Request,
    exc: RequestValidationError,
):
    # Log more information on 422 unprocessable entity error.
    # By default FastAPI does not produce detailed error message.
    logging.error(exc)
    return JSONResponse(
        content={"message": str(exc), "data": None},
        status_code=422,
    )


async def invalid_credentials_exception_handler(
    _request: Request,
    exc: InvalidCredentialsException,
):
    return JSONResponse(
        status_code=exc.status_code,
        # TODO:
        # Provide both detail and message for each exception.
        # Detail will be used to handle the error programmatically in the frontend,
        # while message will be displayed to the user.
        content={"message": "Oops! The provided credentials are invalid."},
    )


async def token_not_found_exception_handler(
    _request: Request,
    exc: TokenNotFoundException,
):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
    )


async def invalid_token_exception_handler(
    _request: Request,
    exc: InvalidTokenException,
):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
    )


async def not_authenticated_exception_handler(
    _request: Request,
    exc: NotAuthenticatedException,
):
    return JSONResponse(
        status_code=exc.status_code,
        content={"message": "Oops! You are not authenticated."},
    )


async def already_authenticated_exception_handler(
    _request: Request,
    exc: NotAuthenticatedException,
):
    return JSONResponse(
        status_code=exc.status_code,
        content={"message": "Oops! You are already authenticated."},
    )


async def invalid_role_exception_handler(
    _request: Request,
    exc: InvalidRoleException,
):
    return JSONResponse(
        status_code=exc.status_code,
        content={"message": f"Oops! Expected role {exc.detail}."},
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


async def no_text_available_exception_handler(
    _request: Request,
    exc: NoTextAvailableException,
):
    return JSONResponse(
        status_code=exc.status_code,
        content={"message": "Oops! No text available."},
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


async def not_enough_answers_exception_handler(
    _request: Request,
    exc: NotEnoughAnswersException,
):
    return JSONResponse(
        status_code=exc.status_code,
        content={"message": "Oops! Not enough answers for a question."},
    )


async def duplicate_answers_exception_handler(
    _request: Request,
    exc: DuplicateAnswersException,
):
    return JSONResponse(
        status_code=exc.status_code,
        content={"message": "Oops! There are duplicate answers for a question."},
    )


async def history_not_found_exception_handler(
    _request: Request,
    exc: HistoryNotFoundException,
):
    return JSONResponse(
        status_code=exc.status_code,
        content={"message": f"Oops! History {exc.history_id} could not be found."},
    )


async def bad_response_from_openai_exception_handler(
    _request: Request,
    exc: BadResponseFromOpenAI,
):
    return JSONResponse(
        status_code=exc.status_code,
        content={"message": "Bad response from OpenAI"},
    )


async def text_already_exists_exception_handler(
    _request: Request,
    exc: TextAlreadyExistsException,
):
    return JSONResponse(
        status_code=exc.status_code,
        content={"message": "Text already exists."},
    )

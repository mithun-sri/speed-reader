from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware

from .database import engine
from .routers.admin import router as admin_router
from .routers.auth import router as auth_router
from .routers.game import router as game_router
from .routers.user import router as user_router
from .services.exception_handlers import (
    duplicate_answers_exception_handler,
    email_already_used_exception_handler,
    history_not_found_exception_handler,
    invalid_credentials_exception_handler,
    invalid_token_exception_handler,
    no_text_available_exception_handler,
    not_enough_questions_exception_handler,
    question_not_belong_to_text_exception_handler,
    question_not_found_exception_handler,
    text_not_found_exception_handler,
    user_already_exists_exception_handler,
    user_not_found_exception_handler,
    validation_exception_handler,
)
from .services.exceptions import (
    DuplicateAnswersException,
    EmailAlreadyUsedException,
    HistoryNotFoundException,
    InvalidCredentialsException,
    InvalidTokenException,
    NotEnoughQuestionsException,
    NoTextAvailableException,
    QuestionNotBelongToTextException,
    QuestionNotFoundException,
    TextNotFoundException,
    UserAlreadyExistsException,
    UserNotFoundException,
)

app = FastAPI(root_path="/api/v1")

app.include_router(router=admin_router)
app.include_router(router=auth_router)
app.include_router(router=user_router)
app.include_router(router=game_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_exception_handler(RequestValidationError, validation_exception_handler)  # type: ignore
app.add_exception_handler(InvalidCredentialsException, invalid_credentials_exception_handler)  # type: ignore
app.add_exception_handler(InvalidTokenException, invalid_token_exception_handler)  # type: ignore
app.add_exception_handler(UserNotFoundException, user_not_found_exception_handler)  # type: ignore
app.add_exception_handler(UserAlreadyExistsException, user_already_exists_exception_handler)  # type: ignore
app.add_exception_handler(EmailAlreadyUsedException, email_already_used_exception_handler)  # type: ignore
app.add_exception_handler(NoTextAvailableException, no_text_available_exception_handler)  # type: ignore
app.add_exception_handler(TextNotFoundException, text_not_found_exception_handler)  # type: ignore
app.add_exception_handler(QuestionNotFoundException, question_not_found_exception_handler)  # type: ignore
app.add_exception_handler(NotEnoughQuestionsException, not_enough_questions_exception_handler)  # type: ignore
app.add_exception_handler(DuplicateAnswersException, duplicate_answers_exception_handler)  # type: ignore
app.add_exception_handler(QuestionNotBelongToTextException, question_not_belong_to_text_exception_handler)  # type: ignore
app.add_exception_handler(HistoryNotFoundException, history_not_found_exception_handler)  # type: ignore


@app.on_event("startup")
async def startup():
    engine.connect()


@app.on_event("shutdown")
async def shutdown():
    # TODO: engine.disconnect() does not exist
    # await engine.disconnect()
    pass

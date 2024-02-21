import json

from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware

from .config import config
from .database import reset_database, seed_database
from .routers.admin import router as admin_router
from .routers.auth import router as auth_router
from .routers.game import router as game_router
from .routers.user import router as user_router
from .services.exception_handlers import (
    already_authenticated_exception_handler,
    bad_response_from_openai_exception_handler,
    duplicate_answers_exception_handler,
    email_already_used_exception_handler,
    history_not_found_exception_handler,
    invalid_credentials_exception_handler,
    invalid_role_exception_handler,
    invalid_token_exception_handler,
    no_text_available_exception_handler,
    not_authenticated_exception_handler,
    not_enough_questions_exception_handler,
    question_not_belong_to_text_exception_handler,
    question_not_found_exception_handler,
    text_not_found_exception_handler,
    token_not_found_exception_handler,
    user_already_exists_exception_handler,
    user_not_found_exception_handler,
    validation_exception_handler,
)
from .services.exceptions import (
    AlreadyAuthenticatedException,
    BadResponseFromOpenAI,
    DuplicateAnswersException,
    EmailAlreadyUsedException,
    HistoryNotFoundException,
    InvalidCredentialsException,
    InvalidRoleException,
    InvalidTokenException,
    NotAuthenticatedException,
    NotEnoughQuestionsException,
    NoTextAvailableException,
    QuestionNotBelongToTextException,
    QuestionNotFoundException,
    TextNotFoundException,
    TokenNotFoundException,
    UserAlreadyExistsException,
    UserNotFoundException,
)

app = FastAPI(
    root_path="/api/v1",
    # Default unique ID for function has path name and HTTP verb as a suffix.
    # This causes the method name in the auto-generated API client
    # to look like `getNextTextGameTextsNextGet` instead of `getNextText`.
    generate_unique_id_function=lambda route: route.name,
)

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

# TODO: Register exception handlers automatically.
app.add_exception_handler(RequestValidationError, validation_exception_handler)  # type: ignore
app.add_exception_handler(InvalidCredentialsException, invalid_credentials_exception_handler)  # type: ignore
app.add_exception_handler(InvalidTokenException, invalid_token_exception_handler)  # type: ignore
app.add_exception_handler(TokenNotFoundException, token_not_found_exception_handler)  # type: ignore
app.add_exception_handler(NotAuthenticatedException, not_authenticated_exception_handler)  # type: ignore
app.add_exception_handler(AlreadyAuthenticatedException, already_authenticated_exception_handler)  # type: ignore
app.add_exception_handler(InvalidRoleException, invalid_role_exception_handler)  # type: ignore
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
app.add_exception_handler(BadResponseFromOpenAI, bad_response_from_openai_exception_handler)  # type: ignore


@app.on_event("startup")
async def startup():
    # Save copy of OpenAPI specification.
    with open(f"{config.app_dir}/openapi.json", "w", encoding="utf-8") as file:
        spec = app.openapi()
        file.write(json.dumps(spec, indent=2))


@app.on_event("shutdown")
async def shutdown():
    pass


# Making an endpoint to seed the database is a common practice in integration tests:
# https://docs.cypress.io/guides/references/best-practices#Real-World-Example-1
# TODO:
# Protect this endpoint with a secret key.
# Disable this endpoint in production.
@app.post("/testing/db/seed")
async def seed():
    reset_database()
    seed_database()

    return {"message": "Database seeded successfully."}

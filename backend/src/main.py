from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import engine
from .routers.admin import router as admin_router
from .routers.auth import router as auth_router
from .routers.dashboard import router as dashboard_router
from .routers.game import router as game_router
from .routers.user import router as user_router
from .services.exception_handlers import (
    email_already_used_exception_handler,
    invalid_credentials_exception_handler,
    invalid_token_exception_handler,
    user_already_exists_exception_handler,
    user_not_found_exception_handler,
)
from .services.exceptions import (
    EmailAlreadyUsedException,
    InvalidCredentialsException,
    InvalidTokenException,
    UserAlreadyExistsException,
    UserNotFoundException,
)

app = FastAPI(root_path="/api/v1")

app.include_router(router=admin_router)
app.include_router(router=auth_router)
app.include_router(router=user_router)
app.include_router(router=dashboard_router)
app.include_router(router=game_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_exception_handler(InvalidCredentialsException, invalid_credentials_exception_handler)  # type: ignore
app.add_exception_handler(InvalidTokenException, invalid_token_exception_handler)  # type: ignore
app.add_exception_handler(UserNotFoundException, user_not_found_exception_handler)  # type: ignore
app.add_exception_handler(UserAlreadyExistsException, user_already_exists_exception_handler)  # type: ignore
app.add_exception_handler(EmailAlreadyUsedException, email_already_used_exception_handler)  # type: ignore


@app.on_event("startup")
async def startup():
    engine.connect()


@app.on_event("shutdown")
async def shutdown():
    # TODO: engine.disconnect() does not exist
    # await engine.disconnect()
    pass

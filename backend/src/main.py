from fastapi import FastAPI

from .routers.admin import router as admin_router
from .routers.game import router as game_router
from .routers.user import router as user_router

app = FastAPI(root_path="/api/v1")

app.include_router(router=admin_router)
app.include_router(router=user_router)
app.include_router(router=game_router)

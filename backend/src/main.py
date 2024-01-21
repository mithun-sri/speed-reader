from .database.database import engine
from fastapi import FastAPI
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware

from .routers.admin import router as admin_router
from .routers.auth import router as auth_router
from .routers.game import router as game_router
from .routers.user import router as user_router

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

@app.on_event("startup")
async def startup():
    engine.connect()

@app.on_event("shutdown")
async def shutdown():
    await engine.disconnect()



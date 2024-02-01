from typing import Any

from fastapi import APIRouter

from ..logger import LoggerRoute

router = APIRouter(prefix="/user", tags=["user"], route_class=LoggerRoute)

user_db: dict[str, Any] = {}


@router.get("/summary")
def get_user_summary():
    pass

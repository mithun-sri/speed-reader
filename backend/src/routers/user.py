from typing import Any

from fastapi import APIRouter

router = APIRouter(prefix="/user", tags=["user"])

user_db: dict[str, Any] = {}


@router.get("/summary")
def get_user_summary():
    pass

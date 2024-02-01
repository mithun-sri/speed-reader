from fastapi import APIRouter

from ..logger import LoggerRoute

router = APIRouter(prefix="/admin", tags=["admin"], route_class=LoggerRoute)


# TODO: Change `/quiz` to `/questions`.
# TODO: Do not use "question" and "quiz" interchangeably i.e. follow the database table name.
@router.post("/quiz")
async def create_quiz():
    pass


# TODO: Rename to `get_dashboard_data`.
@router.get("/dashboard")
async def get_admin_dashboard():
    pass

from fastapi import APIRouter

from ..logger import LoggerRoute

router = APIRouter(prefix="/admin", tags=["admin"], route_class=LoggerRoute)


@router.post("/quiz")
async def create_quiz():
    pass


@router.get("/dashboard")
async def get_admin_dashboard():
    pass

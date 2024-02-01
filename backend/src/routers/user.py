from fastapi import APIRouter

from ..logger import LoggerRoute

router = APIRouter(prefix="/user", tags=["user"], route_class=LoggerRoute)


# TODO: Create dedicated endpoints for stats, available texts and recent games.
@router.get("/summary")
def get_user_summary():
    pass

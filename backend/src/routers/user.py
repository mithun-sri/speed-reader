from fastapi import APIRouter, Query

from ..logger import LoggerRoute

router = APIRouter(prefix="/user", tags=["user"], route_class=LoggerRoute)


# TODO: Create dedicated endpoints for stats, available texts and recent games.
@router.get("/summary")
def get_user_summary():
    pass

# TODO: Create endpoint for collecting available texts for users.
@router.get("{user_id}/available_texts")
def get_available_texts(
    user_id: str,
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
):
    pass

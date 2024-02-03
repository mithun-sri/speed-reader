from fastapi import APIRouter, Query
from sqlalchemy import select
from sqlalchemy.orm import Session
from fastapi import Depends
from ..database import get_session
from uuid import UUID

from ..logger import LoggerRoute
from ..models.history import History
from ..models.text import Text

router = APIRouter(prefix="/user", tags=["user"], route_class=LoggerRoute)


# TODO: Create dedicated endpoints for stats, available texts and recent games.
@router.get("/summary")
def get_user_summary():
    pass

@router.get("/available_texts")
async def get_available_texts(
    user_id: str,
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    session: Session = Depends(get_session),
):
    # Collect texts read by user in user.history from MongoDB
    texts_read_by_user = History.objects(user_id=user_id).distinct("text_id")

    # Collect paginated texts from PostgreSQL of texts not read by user
    query = select(Text).where(~Text.id.in_(texts_read_by_user))
    results = session.scalars(query)

    response = {
        "texts": [text for text in results],
        "page": page,
        "page_size": page_size,
        # "total_texts": Text.query.count(),
    }
    return response
from fastapi import APIRouter, Depends, Query
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from ..database import get_session
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
    # Collect text_ids of texts read by user in user.history from MongoDB
    texts_read_by_user = History.objects(  # pylint: disable=no-member
        user_id=user_id
    ).distinct("text_id")

    # Calculate the total number of texts not read by the user
    total_texts = (
        session.query(func.count(Text.id))
        .filter(~Text.id.in_(texts_read_by_user))
        .scalar()
    )

    # Collect paginated texts from PostgreSQL of texts not read by user
    query = (
        select(Text)
        .where(~Text.id.in_(texts_read_by_user))
        .offset((page - 1) * page_size)
        .limit(page_size)
    )
    results = session.scalars(query)

    response = {
        "texts": list(results),
        "page": page,
        "page_size": page_size,
        "total_texts": total_texts,
    }

    return response

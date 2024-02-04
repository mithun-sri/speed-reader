from typing import Optional

from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel
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


class TextFilter(BaseModel):
    page: int = Query(1, ge=1)
    page_size: int = Query(10, ge=1, le=100)
    difficulty: Optional[str] = Query(None)
    game_mode: Optional[int] = Query(None)
    sort: Optional[str] = Query(None)


@router.get("/available_texts")
async def get_available_texts(
    user_id: str,
    text_filter: TextFilter = Depends(),
    session: Session = Depends(get_session),
):
    page, page_size, difficulty, game_mode, sort = (
        text_filter.page,
        text_filter.page_size,
        text_filter.difficulty,
        text_filter.game_mode,
        text_filter.sort,
    )
    # Collect text_ids of texts read by user in user.history from MongoDB
    texts_read_by_user = History.objects(  # pylint: disable=no-member
        user_id=user_id
    ).distinct("text_id")

    # Build the base query for texts not read by user
    base_query = session.query(Text).filter(~Text.id.in_(texts_read_by_user))

    if difficulty:
        base_query = base_query.filter(Text.difficulty == difficulty)
    if game_mode is not None:
        base_query = base_query.filter(Text.game_mode == game_mode)
    # Sort the texts by the given attribute
    if sort:
        if sort.startswith("-"):
            attr = getattr(Text, sort[1:])
            base_query = base_query.order_by(attr.desc())
        else:
            attr = getattr(Text, sort)
            base_query = base_query.order_by(sort)

    # Calculate the total number of texts not read by the user
    total_texts = base_query.count()

    # Collect paginated texts from PostgreSQL of texts not read by user
    query = base_query.offset((page - 1) * page_size).limit(page_size)
    results = session.scalars(query)

    response = {
        "texts": list(results),
        "page": page,
        "page_size": page_size,
        "total_texts": total_texts,
    }

    return response

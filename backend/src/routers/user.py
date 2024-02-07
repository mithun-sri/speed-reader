from typing import Annotated, Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_session
from ..logger import LoggerRoute
from ..services.exceptions import UserNotFoundException

router = APIRouter(prefix="/user", tags=["user"], route_class=LoggerRoute)


@router.get("/summary")
def get_user_summary():
    pass


@router.get(
    "/{user_id}/statistics",
    response_model=schemas.UserStatistics,
)
async def get_user_statistics(
    user_id: str,
    session: Annotated[Session, Depends(get_session)],
):
    """
    Gets the statistics based on the user's game history.
    """
    user = session.get(models.User, user_id)
    if not user:
        raise UserNotFoundException(user_id=user_id)

    pipeline = [
        {
            "$group": {
                "_id": user_id,
                "minWpm": {"$min": "$wpm"},
                "maxWpm": {"$max": "$wpm"},
                "avgWpm": {"$avg": "$wpm"},
                "avgScore": {"$avg": "$score"},
            }
        }
    ]
    data = models.History.objects(user_id=user_id).aggregate(pipeline)
    data = list(data)[0]

    return schemas.UserStatistics(
        user_id=user_id,
        username=user.username,
        email=user.email,
        min_wpm=data["minWpm"],
        max_wpm=data["maxWpm"],
        avg_wpm=data["avgWpm"],
        avg_score=data["avgScore"],
    )


@router.get(
    "/{user_id}/available_texts",
    response_model=schemas.UserAvailableTexts,
)
async def get_user_available_texts(
    *,
    user_id: str,
    page: Annotated[int, Query()] = 1,
    page_size: Annotated[int, Query()] = 10,
    text_filter: Optional[schemas.TextFilter] = None,
    text_sort: Optional[schemas.TextSort] = None,
    session: Annotated[Session, Depends(get_session)],
):
    """
    Gets the texts not read by the user.
    Returns the texts paginated and sorted/filtered by the given parameters.
    """

    def filter_query(query):
        # Build the base query for texts not read by user
        read_text_ids = models.History.objects(user_id=user_id).distinct("text_id")
        query = query.filter(models.Text.id.not_in(read_text_ids))

        if text_filter.game_mode:
            query = query.filter(models.Text.game_mode == text_filter.game_mode)
        if text_filter.difficulty:
            query = query.filter(models.Text.difficulty == text_filter.difficulty)

        if text_sort:
            attr = getattr(models.Text, text_sort.field)
            if text_sort.ascending:
                query = query.order_by(attr)
            else:
                query = query.order_by(attr.desc())

        return query

    # Calculate the total number of available texts
    query = filter_query(select(func.count(models.Text.id)))
    total_texts = session.scalar(query)

    # Collect paginated available texts
    query = filter_query(select(models.Text.id))
    query = query.offset((page - 1) * page_size).limit(page_size)
    texts = session.scalars(query).all()

    return schemas.UserAvailableTexts(
        texts=texts,  # type: ignore
        page=page,
        page_size=page_size,
        total_texts=total_texts,
    )

from typing import Annotated, Optional

from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_session
from ..logger import LoggerRoute
from ..services.auth import get_current_user
from ..services.exceptions import HistoryNotFoundException
from ..schemas.user import UserRegistrationResponse, UserRegister, UserResponse
from ..models.user import User


router = APIRouter(prefix="/users", tags=["user"], route_class=LoggerRoute)


@router.get(
    "/current/statistics",
    response_model=schemas.UserStatistics,
)
async def get_user_statistics(
    user: Annotated[models.User, Depends(get_current_user)],
):
    """
    Gets the statistics based on the user's game history.
    """
    pipeline = [
        {
            "$group": {
                "_id": user.id,
                "minWpm": {"$min": "$wpm"},
                "maxWpm": {"$max": "$wpm"},
                "avgWpm": {"$avg": "$wpm"},
                "avgScore": {"$avg": "$score"},
            }
        }
    ]
    data = models.History.objects(user_id=user.id).aggregate(pipeline)
    data = list(data)[0]

    return schemas.UserStatistics(
        user_id=user.id,
        username=user.username,
        email=user.email,
        min_wpm=data["minWpm"],
        max_wpm=data["maxWpm"],
        average_wpm=data["avgWpm"],
        average_score=data["avgScore"],
    )


@router.get(
    "/current/available_texts",
    response_model=schemas.UserAvailableTexts,
)
async def get_user_available_texts(
    *,
    page: Annotated[int, Query()] = 1,
    page_size: Annotated[int, Query()] = 10,
    text_filter: Optional[schemas.TextFilter] = None,
    text_sort: Optional[schemas.TextSort] = None,
    user: Annotated[models.User, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_session)],
):
    """
    Gets the texts not read by the user.
    Returns the texts paginated and sorted/filtered by the given parameters.
    """

    def filter_query(query):
        # Build the base query for texts not read by user
        read_text_ids = models.History.objects(user_id=user.id).distinct("text_id")
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


# TODO: Move the endpoints below to where appropriate.
@router.get(
    "/current/results",
    response_model=list[schemas.History],
)
async def get_histories(
    user: Annotated[models.User, Depends(get_current_user)],
):
    """
    Gets the history of games played by the user.
    """
    histories = models.History.objects(user_id=user.id)
    histories = list(histories)

    return [
        schemas.History(
            text_id=history.text_id,
            game_mode=history.game_mode,
            game_submode=history.game_submode,
            average_wpm=history.average_wpm,
            interval_wpms=history.interval_wpms,
            score=history.score,
            answers=history.answers,
        )
        for history in histories
    ]


@router.get(
    "/current/results/{history_id}",
    response_model=schemas.History,
)
async def get_history(
    history_id: str,
    user: Annotated[models.User, Depends(get_current_user)],
):
    """
    Gets the history of games played by the user.
    """
    history = models.History.objects(user_id=user.id, id=history_id).first()
    if not history:
        raise HistoryNotFoundException(history_id=history_id)

    return schemas.History(
        text_id=history.text_id,
        game_mode=history.game_mode,
        game_submode=history.game_submode,
        average_wpm=history.average_wpm,
        interval_wpms=history.interval_wpms,
        score=history.score,
        answers=history.answers,
    )

@router.post(
    "/register",
    response_model=UserRegistrationResponse,
)
async def register_user(
    username: str,
    email: str,
    password: str,
    session: Annotated[Session, Depends(get_session)],
):
    """
    Registers a new user.
    """
    if session.query(User).filter(User.username == username).first():
        raise HTTPException(status_code=409, detail="Username already exists")
    if session.query(User).filter(User.email == email).first():
        raise HTTPException(status_code=409, detail="Email already exists")
    
    new_user = User(
        username=username,
        email=email,
        password=password,
    )
    session.add(new_user)
    session.commit()

    return UserRegistrationResponse(
        message="User registered successfully",
        data=UserResponse(
            id=new_user.id,
            username=new_user.username,
            email=new_user.email,
            created_at=new_user.created_at,
        ),
    )
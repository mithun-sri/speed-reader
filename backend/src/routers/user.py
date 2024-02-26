from typing import Annotated, Optional

from fastapi import APIRouter, Body, Depends, HTTPException, Query, Response, Security
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_session
from ..logger import LoggerRoute
from ..services.auth import (
    get_current_user,
    set_response_tokens,
    verify_auth,
    verify_guest,
)
from ..services.exceptions import HistoryNotFoundException, InvalidCredentialsException
from ..utils.auth import create_access_token, create_refresh_token
from ..utils.crypt import get_password_hash, verify_password

router = APIRouter(
    prefix="/users",
    tags=["user"],
    route_class=LoggerRoute,
)


@router.get(
    "/current",
    name="get_current_user",  # TODO: Refactor naming
    response_model=schemas.User,
    dependencies=[Security(verify_auth)],  # TODO: Extract to router
)
async def get_current_user_(
    user: Annotated[models.User, Depends(get_current_user)],
):
    """
    Gets the current user's information.
    """
    return user


@router.get(
    "/current/statistics",
    response_model=schemas.UserStatistics,
    dependencies=[Security(verify_auth)],
)
async def get_user_statistics(
    user: Annotated[models.User, Depends(get_current_user)],
):
    """
    Gets the statistics based on the user's game history.
    """
    pipeline = [
        {
            "$match": {"user_id": user.id},
        },
        {
            "$group": {
                "_id": user.id,
                "minWpm": {"$min": "$average_wpm"},
                "maxWpm": {"$max": "$average_wpm"},
                "avgWpm": {"$avg": "$average_wpm"},
                "avgScore": {"$avg": "$score"},
            }
        },
    ]
    item = models.History.objects().aggregate(pipeline)
    item = next(item, {})

    return schemas.UserStatistics(
        user_id=user.id,
        username=user.username,
        email=user.email,
        min_wpm=item.get("minWpm", 0),
        max_wpm=item.get("maxWpm", 0),
        average_wpm=int(item.get("avgWpm", 0)),
        average_score=int(item.get("avgScore", 0)),
    )


@router.get(
    "/current/available_texts",
    response_model=schemas.UserAvailableTexts,
    dependencies=[Security(verify_auth)],
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
    dependencies=[Security(verify_auth)],
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
            summary=history.summary,
            average_wpm=history.average_wpm,
            interval_wpms=history.interval_wpms,
            score=history.score,
            results=[
                schemas.Result(
                    question_id=result.question_id,
                    correct=result.correct,
                    correct_option=result.correct_option,
                    selected_option=result.selected_option,
                )
                for result in history.results
            ],
        )
        for history in histories
    ]


@router.get(
    "/current/results/{history_id}",
    response_model=schemas.History,
    dependencies=[Security(verify_auth)],
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
        summary=history.summary,
        average_wpm=history.average_wpm,
        interval_wpms=history.interval_wpms,
        score=history.score,
        results=[
            schemas.Result(
                question_id=result.question_id,
                correct=result.correct,
                correct_option=result.correct_option,
                selected_option=result.selected_option,
            )
            for result in history.results
        ],
    )


@router.post(
    "/register",
    dependencies=[Security(verify_guest)],
)
async def register_user(
    # TODO:
    # OAuth2 password flow recommends passing credentials
    # as form data rather than request body.
    username: Annotated[str, Body()],
    email: Annotated[str, Body()],
    password: Annotated[str, Body()],
    session: Annotated[Session, Depends(get_session)],
):
    """
    Registers a new user.
    """
    query_check_username = select(models.User).filter(models.User.username == username)
    if session.scalars(query_check_username).one_or_none():
        raise HTTPException(status_code=409, detail="Username already used")
    query_check_email = select(models.User).filter(models.User.email == email)
    if session.scalars(query_check_email).one_or_none():
        raise HTTPException(status_code=409, detail="Email already used")

    user = models.User(
        username=username,
        email=email,
        password=get_password_hash(password),
    )
    session.add(user)
    session.commit()


@router.post(
    "/login",
    dependencies=[Security(verify_guest)],
)
async def login_user(
    # TODO:
    # OAuth2 password flow recommends passing credentials
    # as form data rather than request body.
    username: Annotated[str, Body()],
    password: Annotated[str, Body()],
    response: Response,
    session: Annotated[Session, Depends(get_session)],
):
    """
    Logs in a user. Returns access token and refresh token.
    """
    query = select(models.User).filter(models.User.username == username)
    user = session.scalars(query).one_or_none()
    if not user or not verify_password(password, user.password):
        raise InvalidCredentialsException()

    access_token = create_access_token(data={"sub": user.username})
    refresh_token = create_refresh_token(data={"sub": user.username})
    set_response_tokens(response, access_token, refresh_token)

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
    *,
    game_mode: str,
    user: Annotated[models.User, Depends(get_current_user)],
):
    """
    Gets the statistics based on the user's game history.
    """
    pipeline_stats = [
        {
            "$match": {
                "user_id": user.id,
                "game_mode": game_mode,
            },
        },
        {
            "$group": {
                "_id": None,
                "minWpm": {"$min": "$average_wpm"},
                "maxWpm": {"$max": "$average_wpm"},
                "avgWpm": {"$avg": "$average_wpm"},
                "avgScore": {"$avg": "$score"},
            }
        },
    ]
    pipeline_graph = [
        {
            "$match": {
                "user_id": user.id,
                "game_mode": game_mode,
            }
        },
        {
            "$group": {
                "_id": {"$dateToString": {"format": "%Y-%m-%d", "date": "$timestamp"}},
                "avgWpm": {"$avg": "$average_wpm"},
            }
        },
        {"$sort": {"_id": 1}},
    ]

    item_stats = models.History.objects().aggregate(pipeline_stats)
    item_stats = next(item_stats, {})
    items_graph = models.History.objects().aggregate(pipeline_graph)
    items_graph = list(items_graph)

    return schemas.UserStatistics(
        user_id=user.id,
        username=user.username,
        email=user.email,
        min_wpm=item_stats.get("minWpm", 0),
        max_wpm=item_stats.get("maxWpm", 0),
        average_wpm=int(item_stats.get("avgWpm", 0)),
        average_score=int(item_stats.get("avgScore", 0)),
        average_wpm_per_day=[
            schemas.UserStatisticsAverageWpmPerDay(
                date=item_graph["_id"],
                wpm=int(item_graph["avgWpm"]),
            )
            for item_graph in items_graph
        ],
    )


@router.post(
    "/current/available_texts",
    response_model=schemas.UserAvailableTexts,
    dependencies=[Security(verify_auth)],
)
async def get_user_available_texts(
    *,
    page: Annotated[int, Query()] = 1,
    page_size: Annotated[int, Query()] = 10,
    text_filter: Optional[schemas.TextFilter] = None,
    user: Annotated[models.User, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_session)],
):
    """
    Gets the texts not read by the user.
    Returns the texts paginated and sorted/filtered by the given parameters.
    """

    def filter_query(query):
        if text_filter:
            if text_filter.difficulty and text_filter.difficulty != "any":
                query = query.where(models.Text.difficulty == text_filter.difficulty)
            if (
                text_filter.include_fiction is False
                and text_filter.include_nonfiction is False
            ):
                # Return no texts if both fiction and nonfiction are excluded
                query = query.where(
                    models.Text.fiction == False  # pylint: disable=singleton-comparison
                )
                query = query.where(
                    models.Text.fiction == True  # pylint: disable=singleton-comparison
                )
            elif text_filter.include_fiction is False:
                query = query.where(
                    models.Text.fiction == False  # pylint: disable=singleton-comparison
                )
            elif text_filter.include_nonfiction is False:
                query = query.where(
                    models.Text.fiction == True  # pylint: disable=singleton-comparison
                )
            if text_filter.only_unplayed:
                read_text_ids = models.History.objects(user_id=user.id).distinct(
                    "text_id"
                )
                query = query.where(models.Text.id.not_in(read_text_ids))
            if text_filter.keyword:
                # find texts with the keyword in the title or author
                query = query.where(
                    models.Text.title.ilike(f"%{text_filter.keyword}%")
                    | models.Text.author.ilike(f"%{text_filter.keyword}%")
                )

        return query

    # Calculate the total number of available texts
    query = filter_query(select(func.count(models.Text.id)))
    total_texts = session.scalar(query)

    # Collect paginated available texts
    query = filter_query(select(models.Text))
    query = query.offset((page - 1) * page_size).limit(page_size)
    texts = session.scalars(query).all()
    texts = [schemas.Text(**text.__dict__) for text in texts]  # type: ignore

    return schemas.UserAvailableTexts(
        texts=texts,  # type: ignore
        page=page,
        page_size=page_size,
        total_texts=total_texts,
    )


# TODO: Move the endpoints below to where appropriate.
@router.get(
    "/current/histories",
    response_model=list[schemas.HistoryWithText],
    dependencies=[Security(verify_auth)],
)
async def get_histories(
    user: Annotated[models.User, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_session)],
):
    """
    Gets the history of games played by the user.
    """
    histories = models.History.objects(user_id=user.id)
    histories = list(histories)

    return [
        schemas.HistoryWithText(
            id=history.id,
            text_title=session.scalars(
                select(models.Text).where(models.Text.id == history.text_id).limit(1)
            )
            .one()
            .title,
            text_id=history.text_id,
            game_mode=history.game_mode,
            game_submode=history.game_submode,
            difficulty=history.difficulty,
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
    "/current/histories/{history_id}",
    response_model=schemas.HistoryWithQuestions,
    dependencies=[Security(verify_auth)],
)
async def get_history(
    history_id: str,
    user: Annotated[models.User, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_session)],
):
    """
    Gets the history of games played by the user.
    """
    history = models.History.objects(user_id=user.id, id=history_id).first()
    if not history:
        raise HistoryNotFoundException(history_id=history_id)

    # NOTE:
    # Sort and zip questions and results to avoid N+1 problem
    # when finding question details for each result.
    question_ids = [result.question_id for result in history.results]
    query = select(models.Question).where(models.Question.id.in_(question_ids))
    questions = session.scalars(query).all()
    questions = list(questions)
    questions.sort(key=lambda question: question.id)
    results = history.results
    results.sort(key=lambda result: result.question_id)

    return schemas.HistoryWithQuestions(
        id=history.id,
        text_id=history.text_id,
        game_mode=history.game_mode,
        game_submode=history.game_submode,
        difficulty=history.difficulty,
        summary=history.summary,
        average_wpm=history.average_wpm,
        interval_wpms=history.interval_wpms,
        score=history.score,
        results=[
            schemas.ResultWithQuestion(
                question_id=question.id,
                content=question.content,
                options=question.options,
                correct=result.correct,
                correct_option=result.correct_option,
                selected_option=result.selected_option,
            )
            for question, result in zip(questions, results)
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
    query_check_username = select(models.User).where(models.User.username == username)
    if session.scalars(query_check_username).one_or_none():
        raise HTTPException(status_code=409, detail="Username already used")
    query_check_email = select(models.User).where(models.User.email == email)
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
    query = select(models.User).where(models.User.username == username)
    user = session.scalars(query).one_or_none()
    if not user or not verify_password(password, user.password):
        raise InvalidCredentialsException()

    access_token = create_access_token(data={"sub": user.username})
    refresh_token = create_refresh_token(data={"sub": user.username})
    set_response_tokens(response, access_token, refresh_token)


@router.post(
    "/logout",
    dependencies=[Security(verify_auth)],
)
async def logout_user(
    response: Response,
):
    """
    Logs out a user. Invalidates the refresh token.
    TODO:
    Blacklist the refresh token.
    """
    set_response_tokens(response, "", "")

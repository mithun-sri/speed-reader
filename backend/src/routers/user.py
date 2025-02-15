import base64
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, Response, Security
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


@router.get(
    "/current/available-texts",
    response_model=schemas.UserAvailableTexts,
    dependencies=[Security(verify_auth)],
)
async def get_user_available_texts(
    *,
    page: Annotated[int, Query()] = 1,
    page_size: Annotated[int, Query()] = 10,
    difficulty: str = None,  # type: ignore
    include_fiction: bool = True,  # type: ignore
    include_nonfiction: bool = True,  # type: ignore
    only_unplayed: bool = False,  # type: ignore
    keyword: str = None,  # type: ignore
    user: Annotated[models.User, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_session)],
):
    """
    Gets the texts not read by the user.
    Returns the texts paginated and sorted/filtered by the given parameters.
    """

    def filter_query(query):
        if difficulty and difficulty != "any":
            query = query.where(models.Text.difficulty == difficulty)
        if include_fiction is False and include_nonfiction is False:
            # Return no texts if both fiction and nonfiction are excluded
            query = query.where(models.Text.fiction.is_(False))
            query = query.where(models.Text.fiction.is_(True))
        elif include_fiction is False:
            query = query.where(models.Text.fiction.is_(False))
        elif include_nonfiction is False:
            query = query.where(models.Text.fiction.is_(True))
        if only_unplayed:
            read_text_ids = models.History.objects(user_id=user.id).distinct("text_id")
            query = query.where(models.Text.id.not_in(read_text_ids))
        if keyword:
            # find texts with the keyword in the title or author
            query = query.where(
                models.Text.title.ilike(f"%{keyword}%")
                | models.Text.author.ilike(f"%{keyword}%")
            )

        return query

    # Calculate the total number of available texts
    query = filter_query(select(func.count(models.Text.id)))
    total_texts = session.scalar(query)

    # Collect paginated available texts
    query = filter_query(select(models.Text))
    query = query.offset((page - 1) * page_size).limit(page_size)
    texts = session.scalars(query).all()
    texts = [
        schemas.Text(
            **text.__dict__,
            image_base64=base64.b64encode(text.image_bytes).decode("utf-8"),
        )
        for text in texts
    ]

    return schemas.UserAvailableTexts(
        texts=texts,
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
    histories.sort(key=lambda history: history.timestamp, reverse=True)

    def get_text(text_id):
        query = select(models.Text).where(models.Text.id == text_id).limit(1)
        return session.scalars(query).one()

    return [
        schemas.HistoryWithText(
            id=history.id,
            date=history.timestamp,
            text_id=history.text_id,
            # TODO:
            # We should ideally add `Text` field here instead of `text_title`.
            text_title=get_text(history.text_id).title,
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
        date=history.timestamp,
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
    data: schemas.UserRegister,
    session: Annotated[Session, Depends(get_session)],
):
    """
    Registers a new user.
    """
    query_check_username = select(models.User).where(
        models.User.username == data.username
    )
    if session.scalars(query_check_username).one_or_none():
        raise HTTPException(status_code=409, detail="Username already used")

    user = models.User(
        username=data.username,
        password=get_password_hash(data.password),
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
    data: schemas.UserLogin,
    response: Response,
    session: Annotated[Session, Depends(get_session)],
):
    """
    Logs in a user. Returns access token and refresh token.
    """
    query = select(models.User).where(models.User.username == data.username)
    user = session.scalars(query).one_or_none()
    if not user or not verify_password(data.password, user.password):
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

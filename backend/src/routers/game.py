from typing import Annotated

from fastapi import APIRouter, Body, Depends, Query, Security, HTTPException
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_session
from ..logger import LoggerRoute
from ..services.auth import get_current_user, verify_auth
from ..services.exceptions import (
    DuplicateAnswersException,
    NotEnoughAnswersException,
    NotEnoughQuestionsException,
    NoTextAvailableException,
    QuestionNotBelongToTextException,
    QuestionNotFoundException,
    TextNotFoundException,
)

router = APIRouter(
    prefix="/game",
    tags=["game"],
    route_class=LoggerRoute,
    dependencies=[Security(verify_auth)],
)


@router.get(
    "/texts/next",
    response_model=schemas.Text,
)
async def get_next_text(
    *,
    # NOTE:
    # We cannot set `Optional[str]` as the type for `difficulty`
    # because FastAPI will not be able to generate the OpenAPI schema correctly.
    # It will generate `difficulty` as a compound type of `str` and `None`,
    # rather than `nullable` set to `true`.
    difficulty: Annotated[str, Query()] = None,  # type: ignore
    is_summary: Annotated[bool, Query()],
    user: Annotated[models.User, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_session)],
):
    """
    Gets the next text that the user has not attempted before.
    """
    text_ids = models.History.objects(user_id=user.id).distinct("text_id")

    query_unseen = select(models.Text).where(models.Text.id.notin_(text_ids)).limit(1)
    query_random = select(models.Text).order_by(func.random()).limit(1)
    if difficulty:
        query_unseen = query_unseen.where(models.Text.difficulty == difficulty)
        query_random = query_random.where(models.Text.difficulty == difficulty)

    if is_summary:
        query_unseen = query_unseen.where(models.Text.summary.isnot(None))
        query_random = query_random.where(models.Text.summary.isnot(None))

    # NOTE:
    # We're having to convert `models.Text` to `schemas.Text` temporarily
    # because the `models.Text` object contains `bytes` field which FastAPI fails to serialise.
    if text := session.scalars(query_unseen).one_or_none():
        return schemas.Text(**text.__dict__)
    if text := session.scalars(query_random).one_or_none():
        return schemas.Text(**text.__dict__)

    raise NoTextAvailableException()


# NOTE:
# This endpoint cannot be named as `get_text`
# because of the conflict with the endpoint in the admin router.
# We generate OpenAPI operation ID from the function name so it must be unique.
# A real fix for this would be to handle this in the OpenAPI client generation.
@router.get(
    "/texts/{text_id}",
    response_model=schemas.Text,
)
async def get_text_by_id(
    text_id: str,
    session: Annotated[Session, Depends(get_session)],
):
    """
    Gets the text with the given id.
    """
    text = session.get(models.Text, text_id)
    if not text:
        raise TextNotFoundException(text_id=text_id)

    return schemas.Text(**text.__dict__)


# TODO:
# Move this constant to somewhere else.
NUM_QUESTIONS_PER_GAME = 10


@router.get(
    "/texts/{text_id}/questions/next",
    response_model=list[schemas.QuestionMasked],
)
async def get_next_questions(
    text_id: str,
    user: Annotated[models.User, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_session)],
):
    """
    Gets next 10 questions that the user has not attempted before.
    """
    text = session.get(models.Text, text_id)
    if not text:
        raise TextNotFoundException(text_id=text_id)

    pipeline = [
        {"$match": {"user_id": user.id}},
        {"$unwind": "$question_ids"},
        {"$group": {"_id": None, "question_ids": {"$addToSet": "$question_ids"}}},
    ]
    item = models.History.objects().aggregate(pipeline)
    item = next(item, {})
    question_ids = item.get("question_ids", [])

    query_unseen = (
        select(models.Question)
        .where(models.Question.text_id == text_id)
        .where(models.Question.id.notin_(question_ids))
        .limit(NUM_QUESTIONS_PER_GAME)
    )
    query_random = (
        select(models.Question)
        .where(models.Question.text_id == text_id)
        .order_by(func.random())
        .limit(NUM_QUESTIONS_PER_GAME)
    )

    if questions := session.scalars(query_unseen).all():
        return questions
    if questions := session.scalars(query_random).all():
        return questions

    raise NotEnoughQuestionsException(text_id=text_id)


@router.post(
    "/texts/{text_id}/answers",
    response_model=list[schemas.Result],
)
async def post_answers(
    *,
    text_id: str,
    answers: list[schemas.Answer],
    # TODO:
    # Extract the following payload to a separate schema.
    average_wpm: Annotated[int, Body()],
    interval_wpms: Annotated[list[int], Body()],
    game_mode: Annotated[str, Body()],
    game_submode: Annotated[str, Body()],
    summary: Annotated[bool, Body()],
    user: Annotated[models.User, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_session)],
):
    """
    Accepts the question answers and other statistics.
    Returns the results to the answers.
    """
    text = session.get(models.Text, text_id)
    question_ids = [answer.question_id for answer in answers]

    if not text:
        raise TextNotFoundException(text_id=text_id)
    if len(answers) < NUM_QUESTIONS_PER_GAME:
        raise NotEnoughAnswersException()
    if len(set(question_ids)) != len(question_ids):
        raise DuplicateAnswersException()
    if average_wpm <= 0 or any(wpm < 0 for wpm in interval_wpms):
        raise HTTPException(status_code=400, detail="Invalid WPM data")
    if not all(0 <= answer.selected_option <= 2 for answer in answers):
        raise HTTPException(status_code=400, detail="Invalid selected option.")
    if average_wpm > 3000 or any(wpm > 3000 for wpm in interval_wpms):
        raise HTTPException(status_code=400, detail="Invalid WPM data")
    
    results = []
    for answer in answers:
        question = session.get(models.Question, answer.question_id)
        if not question:
            raise QuestionNotFoundException(question_id=answer.question_id)
        if question.text_id != text_id:
            # TODO: Extracting every exception like this may be overkill.
            # fmt: off
            raise QuestionNotBelongToTextException(question_id=answer.question_id, text_id=text_id)

        results.append(
            models.Result(
                question_id=answer.question_id,
                correct=answer.selected_option == question.correct_option,
                correct_option=question.correct_option,
                selected_option=answer.selected_option,
            )
        )

    # Save the history before returning the results to the question answers.
    # TODO: Refactor
    score = sum(result.correct for result in results) * 100 // max(len(results), 1)
    history = models.History(
        user_id=user.id,
        text_id=text_id,
        question_ids=question_ids,
        game_mode=game_mode,
        game_submode=game_submode,
        difficulty=text.difficulty,
        summary=summary,
        average_wpm=average_wpm,
        interval_wpms=interval_wpms,
        score=score,
        results=results,
    )
    # Set `force_insert` to true to avoid the error caused
    # by MongoEngine trying to update the time series document which is not possible.
    history.save(force_insert=True)

    return results

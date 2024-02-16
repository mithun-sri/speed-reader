from typing import Annotated

from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_session
from ..logger import LoggerRoute
from ..services.exceptions import (
    QuestionNotBelongToTextException,
    QuestionNotFoundException,
    TextNotFoundException,
)

router = APIRouter(prefix="/admin", tags=["admin"], route_class=LoggerRoute)


@router.get(
    "/statistics",
    response_model=schemas.AdminStatistics,
)
async def get_admin_statistics(
    game_mode: Annotated[str, Query()],
):
    """
    Gets the statistics of the admin.
    """
    pipeline = [
        {
            "$group": {
                "_id": game_mode,
                "minWpm": {"$min": "$wpm"},
                "maxWpm": {"$max": "$wpm"},
                "avgWpm": {"$avg": "$wpm"},
                "avgScore": {"$avg": "$score"},
            }
        }
    ]
    data = models.History.objects(game_mode=game_mode).aggregate(pipeline)
    data = list(data)[0]

    return schemas.AdminStatistics(
        min_wpm=data["minWpm"],
        max_wpm=data["maxWpm"],
        average_wpm=data["avgWpm"],
        average_score=data["avgScore"],
    )


@router.get(
    "/texts",
    response_model=list[schemas.Text],
)
async def get_texts(
    *,
    page: Annotated[int, Query()] = 1,
    page_size: Annotated[int, Query()] = 10,
    session: Annotated[Session, Depends(get_session)],
):
    """
    Gets all texts.
    """
    query = select(models.Text).offset((page - 1) * page_size).limit(page_size)
    texts = session.scalars(query).all()
    return texts


@router.get(
    "/texts/{text_id}",
    response_model=schemas.TextWithQuestions,
)
async def get_text(
    text_id: str,
    session: Annotated[Session, Depends(get_session)],
):
    """
    Gets a text by the given id.
    """
    text = session.get(models.Text, text_id)
    if not text:
        raise TextNotFoundException(text_id=text_id)

    return text


@router.get(
    "/texts/{text_id}/questions",
    response_model=list[schemas.QuestionWithCorrectOption],
)
async def get_questions(
    text_id: str,
    session: Annotated[Session, Depends(get_session)],
):
    """
    Gets the questions of a text by the given id.
    """
    query = select(models.Question).filter_by(text_id=text_id)
    questions = session.scalars(query).all()
    return questions


@router.get(
    "/texts/{text_id}/questions/{question_id}",
    response_model=schemas.QuestionWithCorrectOption,
)
async def get_question(
    text_id: str,
    question_id: str,
    session: Annotated[Session, Depends(get_session)],
):
    """
    Gets a question of a text by the given id.
    """
    question = session.get(models.Question, question_id)
    if not question:
        raise QuestionNotFoundException(question_id=question_id)
    if question.text_id != text_id:
        raise QuestionNotBelongToTextException(question_id=question_id, text_id=text_id)

    return question


@router.get(
    "/texts/{text_id}/questions/{question_id}/statistics",
    response_model=schemas.QuestionStatistics,
)
async def get_question_statistics(
    text_id: str,
    question_id: str,
    session: Annotated[Session, Depends(get_session)],
):
    """
    Gets a question statistics of a text by the given id.
    """
    question = session.get(models.Question, question_id)
    if not question:
        raise QuestionNotFoundException(question_id=question_id)
    if question.text_id != text_id:
        raise QuestionNotBelongToTextException(question_id=question_id, text_id=text_id)

    pipeline = [
        {"$group": {"_id": None, "avgScore": {"$avg": "$score"}}},
    ]
    data = models.History.objects().aggregate(pipeline)
    data = list(data)[0]

    result_counts = []
    for option in range(len(question.options)):
        result_count = models.History.objects(
            results__elemMatch={
                "question_id": question_id,
                "selected_option": option,
            }
        ).count()
        result_counts.append(result_count)

    return schemas.QuestionStatistics(
        question_id=question_id,
        average_score=data["avgScore"],
        options=question.options,
        correct_option=question.correct_option,
        selected_options=[
            result_count * 100 // sum(result_counts) for result_count in result_counts
        ],
    )

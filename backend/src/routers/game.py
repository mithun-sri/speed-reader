from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, select
from sqlalchemy.exc import NoResultFound
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_session
from ..logger import LoggerRoute

router = APIRouter(prefix="/game", tags=["game"], route_class=LoggerRoute)


@router.get(
    "/texts/random",
    response_model=schemas.Text,
)
async def get_random_text(
    session: Session = Depends(get_session),
):
    query = select(models.Text).order_by(func.random()).limit(1)
    try:
        text = session.scalars(query).one()
    except NoResultFound:
        raise HTTPException(status_code=404, detail="No text available")

    return text


@router.get(
    "/texts/{text_id}",
    response_model=schemas.Text,
)
async def get_text(
    text_id: str,
    session: Session = Depends(get_session),
):
    text = session.get(models.Text, text_id)
    if text is None:
        raise HTTPException(status_code=404, detail="Text not found")

    return text


# Collects three questions at random from the database
@router.get(
    "/texts/{text_id}/questions",
    response_model=list[schemas.Question],
)
async def get_questions(
    text_id: str,
    session: Session = Depends(get_session),
):
    text = session.get(models.Text, text_id)
    if text is None:
        raise HTTPException(status_code=404, detail="Text not found")

    return text.questions


# Calculates quiz results
@router.post(
    "/texts/{text_id}/answers",
    response_model=list[schemas.QuestionResult],
)
async def submit_answers(
    answers: list[schemas.QuestionAnswer],
    session: Session = Depends(get_session),
):
    results = []
    for answer in answers:
        question = session.get(models.Question, answer.question_id)
        if question is None:
            raise HTTPException(
                status_code=404, detail=f"Question {answer.question_id} not found"
            )

        results.append(
            schemas.QuestionResult(
                question_id=answer.question_id,
                correct=answer.selected_option == question.correct_option,
                selected_option=answer.selected_option,
                correct_option=question.correct_option,
            )
        )

    return results

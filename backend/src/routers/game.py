import random

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_session
from ..logger import LoggerRoute

router = APIRouter(prefix="/game", tags=["game"], route_class=LoggerRoute)


@router.get(
    "/texts/random",
    response_model=list[schemas.Text],
)
async def get_random_text(
    session: Session = Depends(get_session),
):
    query = select(models.Text).order_by(func.random()).limit(1)
    text = session.scalars(query).one()
    if not text:
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


@router.get(
    "/texts/{text_id}/questions/random",
    response_model=list[schemas.Question],
)
async def get_random_questions(
    text_id: str,
    session: Session = Depends(get_session),
):
    """
    Get 3 random questions associated with a text
    """
    text = session.get(models.Text, text_id)
    if text is None:
        raise HTTPException(status_code=404, detail="Text not found")

    num_questions = 3
    if len(text.questions) < num_questions:
        raise HTTPException(
            status_code=404,
            detail="Text does not have enough questions",
        )

    return random.sample(text.questions, num_questions)


@router.post(
    "/texts/{text_id}/answers",
    response_model=list[schemas.QuestionResult],
)
async def submit_answers(
    answers: list[schemas.QuestionAnswer],
    session: Session = Depends(get_session),
):
    """
    Accepts a list of answers and returns the results
    """
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

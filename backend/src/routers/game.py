import random

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_session
from ..logger import LoggerRoute

router = APIRouter(prefix="/game", tags=["game"], route_class=LoggerRoute)


@router.get(
    "/texts/next",
    response_model=list[schemas.Text],
)
async def get_next_text(
    session: Session = Depends(get_session),
):
    """
    Gets the next text that the user has not attempted before.
    TODO: Currently returns a random text regardless of which texts the user has seen.
    """
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
    """
    Gets a text by the given id.
    """
    text = session.get(models.Text, text_id)
    if text is None:
        raise HTTPException(status_code=404, detail="Text not found")

    return text


@router.get(
    "/texts/{text_id}/questions/next",
    response_model=list[schemas.Question],
)
async def get_next_questions(
    text_id: str,
    session: Session = Depends(get_session),
):
    """
    Gets next 3 questions that the user has not attempted before.
    TODO: Currently returns 3 random questions for the given text, regardless of which questions the user has seen.
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
    Accepts question answers and returns the results.
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

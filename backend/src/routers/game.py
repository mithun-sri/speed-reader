from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from .. import models, schema
from ..database import get_session
from ..logger import LoggerRoute

router = APIRouter(prefix="/game", tags=["game"], route_class=LoggerRoute)


@router.get(
    "/texts",
    response_model=list[schema.Text],
)
async def get_texts(
    session: Session = Depends(get_session),
):
    query = select(models.Text).order_by(func.random()).limit(10)
    texts = session.scalars(query).all()
    if len(texts) == 0:
        raise HTTPException(status_code=404, detail="No texts available")

    return texts


@router.get(
    "/texts/{text_id}",
    response_model=schema.Text,
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
    response_model=list[schema.Question],
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
    response_model=list[schema.QuestionResult],
)
async def submit_answers(
    answers: list[schema.QuestionAnswer],
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
            schema.QuestionResult(
                question_id=answer.question_id,
                correct=answer.selected_option == question.correct_option,
                selected_option=answer.selected_option,
                correct_option=question.correct_option,
            )
        )

    return results

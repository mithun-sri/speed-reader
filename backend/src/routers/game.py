import random

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from ..database.database import get_session
from ..database.schema import Question, Text

router = APIRouter(prefix="/game", tags=["game"])


# Collects a random text from the database
@router.get("/texts")
async def get_texts(session: Session = Depends(get_session)):
    result = session.scalar(select(Text).order_by(func.random()).limit(1))

    if result is None:
        raise HTTPException(status_code=404, detail="No texts found")

    return result


# Collects a text from the database by id
@router.get("/texts/{id}")
async def get_text(id: int, session: Session = Depends(get_session)):
    text = session.scalar(select(Text).filter_by(text_id=id))

    if text is None:
        raise HTTPException(status_code=404, detail="Text not found")

    return text


# Collects three questions at random from the database
@router.get("/texts/questions/{id}")
async def get_question(id: int, session: Session = Depends(get_session)):
    num_questions = 3
    all_questions = session.scalars(select(Question).filter_by(text_id=id)).all()

    if all_questions is None:
        raise HTTPException(status_code=404, detail="Text or questions not found")

    # Check if there are enough questions in the database
    if len(all_questions) < num_questions:
        raise HTTPException(
            status_code=400,
            detail=f"Not enough questions available. Found {len(all_questions)}, requested {num_questions}.",
        )

    selected_questions = random.sample(all_questions, num_questions)

    result = []
    for question in selected_questions:
        result.append(
            {
                "question_id": question.question_id,
                "question_text": question.question_text,
                "options": question.options,
                "correct_option": question.correct_option,
            }
        )
    return result

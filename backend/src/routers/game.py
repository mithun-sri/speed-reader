import random

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from ..database.database import get_db
from ..database.schema import Question, Text

router = APIRouter(prefix="/game", tags=["game"])


# Collects a random text from the database
@router.get("/texts")
async def get_texts(db: Session = Depends(get_db)):
    try:
        # result = db.execute(text_table.select().order_by(func.random())).first()
        result = db.scalar(select(Text).order_by(func.random()).limit(1))

        if result is None:
            raise HTTPException(status_code=404, detail="No texts found")

        return result
    except Exception:
        raise HTTPException(status_code=500, detail="Internal Server Error")


# Collects a text from the database by id
@router.get("/texts/{id}")
async def get_text(id: int, db: Session = Depends(get_db)):
    try:
        # text = db.query(text_table).filter_by(text_id=id).first()
        text = db.scalar(select(Text).filter_by(text_id=id))

        if text is None:
            raise HTTPException(status_code=404, detail="Text not found")

        return text
    except Exception:
        raise HTTPException(status_code=500, detail="Internal Server Error")


# Collects three questions at random from the database
@router.get("/texts/questions/{id}")
async def get_question(id: int, db: Session = Depends(get_db)):
    try:
        n = 3
        # all_questions = db.query(question_table).filter_by(text_id=id).all()
        all_questions = db.scalars(select(Question).filter_by(text_id=id)).all()

        if all_questions is None:
            raise HTTPException(status_code=404, detail="Text or questions not found")

        # Check if there are enough questions in the database
        if len(all_questions) < n:
            raise HTTPException(
                status_code=400,
                detail=f"Not enough questions available. Found {len(all_questions)}, requested {n}.",
            )

        selected_questions = random.sample(all_questions, n)

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
    except Exception:
        raise HTTPException(status_code=500, detail="Internal Server Error")

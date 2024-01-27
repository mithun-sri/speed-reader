import random

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session

from ..database.database import get_db, question_table, text_table

router = APIRouter(prefix="/game", tags=["game"])


# Collects a random text from the database
@router.get("/texts")
async def get_texts(db: Session = Depends(get_db)):
    try:
        result = db.execute(text_table.select().order_by(func.random())).first()

        if result is None:
            raise HTTPException(status_code=404, detail="No texts found")

        return {"text": result.content}
    except Exception:
        raise HTTPException(status_code=500, detail="Internal Server Error")


# Collects a text from the database by id
@router.get("/texts/{id}")
async def get_text(id: int, db: Session = Depends(get_db)):
    try:
        text = db.query(text_table).filter_by(text_id=id).first()

        if text is None:
            raise HTTPException(status_code=404, detail="Text not found")

        return {"text": text.content}
    except Exception:
        raise HTTPException(status_code=500, detail="Internal Server Error")


# Collects three questions at random from the database
@router.get("/texts/questions/{id}")
async def get_question(id: int, db: Session = Depends(get_db)):
    try:
        n = 3
        all_questions = db.query(question_table).filter_by(text_id=id).all()

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
                    "option_a": question.option_a,
                    "option_b": question.option_b,
                    "option_c": question.option_c,
                    "correct_option": question.correct_option,
                }
            )
        return {"questions": result}
    except Exception:
        raise HTTPException(status_code=500, detail="Internal Server Error")

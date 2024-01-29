from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
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


class QuizAnswers(BaseModel):
    answers: dict[str, int]


# Calculates quiz results
@router.post("/results")
async def post_results(quiz_answers: QuizAnswers, db: Session = Depends(get_db)):
    try:
        results = {}
        for question_id, choice in quiz_answers.answers.items():
            if not (
                query_result := db.query(question_table)
                .filter_by(question_id=question_id)
                .first()
            ):
                raise HTTPException(
                    status_code=404, detail=f"Question {question_id} not found"
                )

            results[question_id] = {
                "correct": choice == query_result.correct_option,
                "correct_option_text": (
                    query_result.option_a,
                    query_result.option_b,
                    query_result.option_c,
                )[query_result.correct_option],
            }

        return results
    except Exception:
        raise HTTPException(status_code=500, detail="Internal Server Error")

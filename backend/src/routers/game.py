from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session

from ..database.database import get_db, text_table

router = APIRouter(prefix="/game", tags=["game"])


# Collects a random text from the database
@router.get("/texts")
async def get_texts(database: Session = Depends(get_db)):
    try:
        result = database.execute(text_table.select().order_by(func.random())).first()

        if result is None:
            raise HTTPException(status_code=404, detail="No texts found")

        return {"text": result.content}
    except Exception as exception:
        raise HTTPException(
            status_code=500, detail="Internal Server Error"
        ) from exception


# Collects a text from the database by id
@router.get("/texts/{id}")
async def get_text(id: int, database: Session = Depends(get_db)):
    try:
        text = database.query(text_table).filter_by(text_id=id).first()

        if text is None:
            raise HTTPException(status_code=404, detail="Text not found")

        return {"text": text.content}
    except Exception as exception:
        raise HTTPException(
            status_code=500, detail="Internal Server Error"
        ) from exception

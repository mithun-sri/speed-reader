from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session
from ..database.database import text_table, get_db
import logging

router = APIRouter(prefix="/game", tags=["game"])

@router.get("/texts")
async def get_texts(db: Session = Depends(get_db)):
    try:
        result = db.execute(text_table.select().order_by(func.random())).first()

        if result is None:
            raise HTTPException(status_code=404, detail="No texts found")

        return {"text": result.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.get("/texts/{id}")
async def get_text(id: int, db: Session = Depends(get_db)):
    try:
        text = db.query(text_table).filter_by(text_id=id).first()

        if text is None:
            raise HTTPException(status_code=404, detail="Text not found")

        return {"text": text.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal Server Error")
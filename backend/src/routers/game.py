from ..database.database import text_table, get_db
from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session
import logging

logging.basicConfig(level=logging.DEBUG)
router = APIRouter(prefix="/game", tags=["game"])


@router.get("/texts")
async def get_texts(db: Session = Depends(get_db)):
    logging.debug("Getting texts")
    result = db.execute(text_table.select().order_by(func.random())).first()
    logging.debug(result)
    print(result)
    if result is None:
        return {"text": "No texts found"}
    return {"text": result.content}


@router.get("/texts/{id}")
async def get_text(id: int, db: Session = Depends(get_db)):
    logging.debug("Getting text id")
    text = db.query(text_table).filter_by(text_id=id).first()
    logging.debug(text)
    print(text)
    if text is None:
        return {"text": "No texts found"}
    return {"text": text.content}

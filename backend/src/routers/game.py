from ..database.database import text_table, get_db
from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

router = APIRouter(prefix="/game", tags=["game"])


@router.get("/texts")
async def get_texts(db: Session = Depends(get_db)):
    result = db.execute(text_table.select().order_by(func.random())).first()
    return {"text": result.content}


@router.get("/texts/{id}")
async def get_text(id: int, db: Session = Depends(get_db)):
    text = db.query(text_table).filter_by(text_id=id).first()
    return {"text": text.content}

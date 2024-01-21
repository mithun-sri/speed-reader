from fastapi import APIRouter

router = APIRouter(prefix="/game", tags=["game"])


@router.get("/texts")
async def get_texts():
    pass


@router.get("/texts/{id}")
async def get_text(id: int):
    pass

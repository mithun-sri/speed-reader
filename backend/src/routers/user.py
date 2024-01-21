from fastapi import APIRouter

router = APIRouter(prefix="/user", tags=["user"])

user_db: dict[str, str] = {}


@router.get("/summary")
def get_user_summary():
    pass

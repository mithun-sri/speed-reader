from fastapi import APIRouter

router = APIRouter(prefix="/admin", tags=["admin"])


@router.post("/auth/login", tags=["auth"])
async def login():
    pass


@router.post("/quiz")
async def create_quiz():
    pass


@router.get("/dashboard")
async def get_admin_dashboard():
    pass

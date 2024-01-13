from fastapi import APIRouter

router = APIRouter(
    prefix='/user',
    tags=['user']
)

@router.post('/signup')
def user_signup():
    pass

@router.post('/login')
def user_login():
    pass

@router.get('/summary')
def get_user_summary():
    pass
from typing import Annotated, Callable, Union

from fastapi import Depends, FastAPI
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel

app = FastAPI()

oauth2_scheme: Callable = OAuth2PasswordBearer(tokenUrl="token")

fake_users_db = {
    "johndoe": {
        "username": "johndoe",
        "email": "johndoe@example.com",
        "hashed_password": "fakehashedsecret",
    }
}

def fake_hash_password(password: str):
    return "fakehashed" + password

class User(BaseModel):
    username: str
    email: Union[str, None] = None
    
class UserInDB(User):
    hashed_password: str
 
def get_user(db, username: str):
    if username in db:
        user_dict = db[username]
        return UserInDB(**user_dict) 
 
def fake_decode_token(token):
    return User(
        username=token + "fakedecoded", email="john@example.com"
    )
 
async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    user = fake_decode_token(token)
    return user

@app.get("/users/me")
async def read_users_me(current_user: Annotated[User, Depends(get_current_user)]):
    return current_user

@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.post("/login")
def login():
    return {"Hello": "World"}

@app.get("/items/")
async def read_items(token: Annotated[str, Depends(oauth2_scheme)]):
    return {"token": token}
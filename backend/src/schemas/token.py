from pydantic import BaseModel


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "Bearer"
    expires: int

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str | None = None
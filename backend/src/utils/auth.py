# TODO: No need to put this file under `utils/security` directory i.e. move to `utils/`.
from datetime import datetime, timedelta, timezone

from jose import jwt

# TODO:
# Move keys to secrets, currently here just for logic implementation
ACCESS_TOKEN_EXPIRE_MINUTES = 10
ACCESS_TOKEN_SECRET_KEY = (
    "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
)
REFRESH_TOKEN_SECRET_KEY = (
    "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
)
ALGORITHM = "HS256"


def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    to_encode = data.copy()
    issued_at = datetime.now(timezone.utc)
    if expires_delta:
        expire = issued_at + expires_delta
    else:
        expire = issued_at + ACCESS_TOKEN_EXPIRE_MINUTES

    to_encode.update({"sub": to_encode.get("username"), "exp": expire, "iat": issued_at})
    return jwt.encode(to_encode, key=ACCESS_TOKEN_SECRET_KEY, algorithm=ALGORITHM)


# TODO: Set expiry for refresh token.
def create_refresh_token(data: dict) -> str:
    to_encode = data.copy()
    to_encode.update({"sub": to_encode.get("email")})

    return jwt.encode(data, key=REFRESH_TOKEN_SECRET_KEY, algorithm=ALGORITHM)

from datetime import datetime, timedelta, timezone

from jose import jwt

# TODO:
# Move keys to secrets, currently here just for logic implementation

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
    expire = issued_at
    if expires_delta:
        expire += expires_delta

    to_encode.update({"sub": to_encode.get("email"), "exp": expire, "iat": issued_at})

    return jwt.encode(to_encode, key=ACCESS_TOKEN_SECRET_KEY, algorithm=ALGORITHM)


def create_refresh_token(data: dict) -> str:
    to_encode = data.copy()
    to_encode.update({"sub": to_encode.get("email")})

    return jwt.encode(data, key=REFRESH_TOKEN_SECRET_KEY, algorithm=ALGORITHM)

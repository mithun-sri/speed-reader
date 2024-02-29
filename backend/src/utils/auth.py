import os
from datetime import datetime, timedelta, timezone
from typing import Any

from jose import JWTError, jwt

from ..services.exceptions import InvalidTokenException

ACCESS_TOKEN_EXPIRE_MINUTES = 10
ACCESS_TOKEN_SECRET_KEY = os.environ.get("ACCESS_TOKEN_SECRET_KEY", "")
REFRESH_TOKEN_SECRET_KEY = os.environ.get("REFRESH_TOKEN_SECRET_KEY", "")
ALGORITHM = "HS256"

if not ACCESS_TOKEN_SECRET_KEY:
    raise Exception("ACCESS_TOKEN_SECRET_KEY environment variable not set")
if not REFRESH_TOKEN_SECRET_KEY:
    raise Exception("REFRESH_TOKEN_SECRET_KEY environment variable not set")


def get_access_token_payload(access_token: str) -> dict[str, Any]:
    try:
        return jwt.decode(
            access_token,
            ACCESS_TOKEN_SECRET_KEY,
            algorithms=[ALGORITHM],
        )
    except JWTError:
        raise InvalidTokenException()


def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    to_encode = data.copy()
    issued_at = datetime.now(timezone.utc)
    if expires_delta:
        expire = issued_at + expires_delta
    else:
        expire = issued_at + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({"exp": expire, "iat": issued_at})
    return jwt.encode(to_encode, key=ACCESS_TOKEN_SECRET_KEY, algorithm=ALGORITHM)


def create_refresh_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(days=30)
    to_encode.update({"sub": to_encode.get("sub"), "exp": expire})

    return jwt.encode(to_encode, key=REFRESH_TOKEN_SECRET_KEY, algorithm=ALGORITHM)

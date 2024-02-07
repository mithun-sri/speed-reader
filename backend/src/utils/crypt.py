# TODO: No need to put this file under `utils/security` directory i.e. move to `utils/`.
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_password_hash(raw_password: str) -> str:
    return pwd_context.hash(raw_password)


def verify_password(raw_password, hashed_password) -> bool:
    return pwd_context.verify(raw_password, hashed_password)

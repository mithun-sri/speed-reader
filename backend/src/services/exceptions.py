from fastapi import HTTPException, status


class UnauthorisedException(HTTPException):
    def __init__(self, detail: str) -> None:
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=detail,
            headers={"WWW-Authenticate": "Bearer"},
        )


class InvalidCredentialsException(UnauthorisedException):
    def __init__(self) -> None:
        super().__init__(
            detail="Invalid credentials",
        )


class InvalidTokenException(UnauthorisedException):
    def __init__(self) -> None:
        super().__init__(
            detail="Invalid token",
        )


class UserNotFoundException(HTTPException):
    def __init__(self) -> None:
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )


class DuplicateDetailsException(HTTPException):
    def __init__(self, detail: str) -> None:
        super().__init__(
            status_code=status.HTTP_409_CONFLICT,
            detail=detail,
        )


class UserAlreadyExistsException(DuplicateDetailsException):
    def __init__(self) -> None:
        super().__init__(
            detail="User already exists",
        )


class EmailAlreadyUsedException(DuplicateDetailsException):
    def __init__(self) -> None:
        super().__init__(
            detail="Email already registered to another user",
        )

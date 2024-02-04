from fastapi import status


class InvalidCredentialsException(Exception):
    def __init__(self) -> None:
        self.status_code = status.HTTP_401_UNAUTHORIZED
        self.headers = {"WWW-Authenticate": "Bearer"}
        self.detail = "Invalid credentials"


class InvalidTokenException(Exception):
    def __init__(self) -> None:
        self.status_code = status.HTTP_401_UNAUTHORIZED
        self.headers = {"WWW-Authenticate": "Bearer"}
        self.detail = "Invalid token"


class UserNotFoundException(Exception):
    def __init__(self, username) -> None:
        self.status_code = status.HTTP_404_NOT_FOUND
        self.detail = f"User {username} not found"
        self.username = username


class UserAlreadyExistsException(Exception):
    def __init__(self, username) -> None:
        self.status_code = status.HTTP_409_CONFLICT
        self.detail = f"User {username} already exists"
        self.username = username


class EmailAlreadyUsedException(Exception):
    def __init__(self, email) -> None:
        self.status_code = status.HTTP_409_CONFLICT
        self.detail = f"Email {email} already in use"
        self.email = email

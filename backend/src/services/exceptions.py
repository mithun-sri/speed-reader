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
    def __init__(self, user_id) -> None:
        self.status_code = status.HTTP_404_NOT_FOUND
        self.detail = f"User {user_id} not found"
        self.user_id = user_id


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


class TextNotFoundException(Exception):
    def __init__(self, text_id) -> None:
        self.status_code = status.HTTP_404_NOT_FOUND
        self.detail = f"Text {text_id} not found"
        self.text_id = text_id


class QuestionNotFoundException(Exception):
    def __init__(self, question_id) -> None:
        self.status_code = status.HTTP_404_NOT_FOUND
        self.detail = f"Question {question_id} not found"
        self.question_id = question_id


class NotEnoughQuestionsException(Exception):
    def __init__(self, text_id) -> None:
        self.status_code = status.HTTP_404_NOT_FOUND
        self.detail = f"Text {text_id} does not have enough questions"
        self.text_id = text_id


class DuplicateQuestionsException(Exception):
    def __init__(self, question_id) -> None:
        self.status_code = status.HTTP_400_BAD_REQUEST
        self.detail = f"Duplicate question {question_id}"
        self.question_id = question_id


class QuestionNotBelongToTextException(Exception):
    def __init__(self, question_id, text_id) -> None:
        self.status_code = status.HTTP_400_BAD_REQUEST
        self.detail = f"Question {question_id} does not belong to text {text_id}"
        self.question_id = question_id
        self.text_id = text_id


class HistoryNotFoundException(Exception):
    def __init__(self, history_id) -> None:
        self.status_code = status.HTTP_404_NOT_FOUND
        self.history_id = history_id
        self.detail = f"History {history_id} not found"

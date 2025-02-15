from fastapi import status


class InvalidCredentialsException(Exception):
    def __init__(self) -> None:
        self.status_code = status.HTTP_401_UNAUTHORIZED
        self.headers = {"WWW-Authenticate": "Bearer"}
        self.detail = "Invalid credentials"


class TokenNotFoundException(Exception):
    def __init__(self) -> None:
        self.status_code = status.HTTP_404_NOT_FOUND
        self.headers = {"WWW-Authenticate": "Bearer"}
        self.detail = "Token not found"


class InvalidTokenException(Exception):
    def __init__(self) -> None:
        self.status_code = status.HTTP_401_UNAUTHORIZED
        self.headers = {"WWW-Authenticate": "Bearer"}
        self.detail = "Invalid token"


class NotAuthenticatedException(Exception):
    def __init__(self) -> None:
        self.status_code = status.HTTP_401_UNAUTHORIZED
        self.headers = {"WWW-Authenticate": "Bearer"}
        self.detail = "Not authenticated"


class AlreadyAuthenticatedException(Exception):
    def __init__(self) -> None:
        self.status_code = status.HTTP_401_UNAUTHORIZED
        self.headers = {"WWW-Authenticate": "Bearer"}
        self.detail = "Already authenticated"


class InvalidRoleException(Exception):
    def __init__(self, role) -> None:
        self.status_code = status.HTTP_401_UNAUTHORIZED
        self.detail = f"Expected role {role}"


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


class NoTextAvailableException(Exception):
    def __init__(self) -> None:
        self.status_code = status.HTTP_404_NOT_FOUND
        self.detail = "No text available"


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


class QuestionNotBelongToTextException(Exception):
    def __init__(self, question_id, text_id) -> None:
        self.status_code = status.HTTP_400_BAD_REQUEST
        self.detail = f"Question {question_id} does not belong to text {text_id}"
        self.question_id = question_id
        self.text_id = text_id


class NotEnoughAnswersException(Exception):
    def __init__(self) -> None:
        self.status_code = status.HTTP_400_BAD_REQUEST
        self.detail = "Not enough answers"


class DuplicateAnswersException(Exception):
    def __init__(self) -> None:
        self.status_code = status.HTTP_400_BAD_REQUEST
        self.detail = "Duplicate answers"


class HistoryNotFoundException(Exception):
    def __init__(self, history_id) -> None:
        self.status_code = status.HTTP_404_NOT_FOUND
        self.history_id = history_id
        self.detail = f"History {history_id} not found"


class BadResponseFromOpenAI(Exception):
    def __init__(self) -> None:
        self.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        self.detail = "Bad response from OpenAI"


class TextAlreadyExistsException(Exception):
    def __init__(self, text_id) -> None:
        self.status_code = status.HTTP_409_CONFLICT
        self.detail = "Text already exists"
        self.text_id = text_id

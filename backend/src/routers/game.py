import random
from typing import Annotated

from fastapi import APIRouter, Body, Depends
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_session
from ..logger import LoggerRoute
from ..services.auth import get_current_user
from ..services.exceptions import (
    DuplicateAnswersException,
    NotEnoughAnswersException,
    NotEnoughQuestionsException,
    NoTextAvailableException,
    QuestionNotBelongToTextException,
    QuestionNotFoundException,
    TextNotFoundException,
)

router = APIRouter(prefix="/game", tags=["game"], route_class=LoggerRoute)


@router.get(
    "/texts/next",
    response_model=schemas.Text,
)
async def get_next_text(
    session: Annotated[Session, Depends(get_session)],
):
    """
    Gets the next text that the user has not attempted before.
    TODO:
    The current implementation returns a random text,
    regardless of which texts the user has seen.
    """
    query = select(models.Text).order_by(func.random()).limit(1)
    text = session.scalars(query).one_or_none()
    if not text:
        raise NoTextAvailableException()

    return text


# TODO:
# Move this constant to somewhere else.
NUM_QUESTIONS_PER_GAME = 10


@router.get(
    "/texts/{text_id}/questions/next",
    response_model=list[schemas.QuestionMasked],
)
async def get_next_questions(
    text_id: str,
    session: Annotated[Session, Depends(get_session)],
):
    """
    Gets next 10 questions that the user has not attempted before.
    TODO:
    The current implementation returns 10 random questions for the given text,
    regardless of which questions the user has seen.
    """
    text = session.get(models.Text, text_id)
    if not text:
        raise TextNotFoundException(text_id=text_id)

    if len(text.questions) < NUM_QUESTIONS_PER_GAME:
        raise NotEnoughQuestionsException(text_id=text_id)

    return random.sample(text.questions, NUM_QUESTIONS_PER_GAME)


@router.post(
    "/texts/{text_id}/answers",
    response_model=list[schemas.Result],
)
async def post_answers(
    *,
    text_id: str,
    answers: list[schemas.Answer],
    # TODO:
    # Extract the following payload to a separate schema.
    average_wpm: Annotated[int, Body()],
    interval_wpms: Annotated[list[int], Body()],
    game_mode: Annotated[str, Body()],
    game_submode: Annotated[str, Body()],
    summary: Annotated[bool, Body()],
    user: Annotated[models.User, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_session)],
):
    """
    Accepts the question answers and other statistics.
    Returns the results to the answers.
    """
    text = session.get(models.Text, text_id)
    question_ids = [answer.question_id for answer in answers]

    if not text:
        raise TextNotFoundException(text_id=text_id)
    if len(answers) < NUM_QUESTIONS_PER_GAME:
        raise NotEnoughAnswersException()
    if len(set(question_ids)) != len(question_ids):
        raise DuplicateAnswersException()

    results = []
    for answer in answers:
        question = session.get(models.Question, answer.question_id)
        if not question:
            raise QuestionNotFoundException(question_id=answer.question_id)
        if question.text_id != text_id:
            # TODO: Extracting every exception like this may be overkill.
            # fmt: off
            raise QuestionNotBelongToTextException(question_id=answer.question_id, text_id=text_id)

        results.append(
            models.Result(
                question_id=answer.question_id,
                correct=answer.selected_option == question.correct_option,
                correct_option=question.correct_option,
                selected_option=answer.selected_option,
            )
        )

    # Save the history before returning the results to the question answers.
    # TODO: Refactor
    score = sum(result.correct for result in results) * 100 // max(len(results), 1)
    history = models.History(
        user_id=user.id,
        text_id=text_id,
        question_ids=question_ids,
        game_mode=game_mode,
        game_submode=game_submode,
        summary=summary,
        average_wpm=average_wpm,
        interval_wpms=interval_wpms,
        score=score,
        results=results,
    )
    # Set `force_insert` to true to avoid the error caused
    # by MongoEngine trying to update the time series document which is not possible.
    history.save(force_insert=True)

    return results

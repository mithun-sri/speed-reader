import random
from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_session
from ..logger import LoggerRoute
from ..services.auth import get_current_user
from ..services.exceptions import (
    DuplicateQuestionsException,
    NotEnoughQuestionsException,
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
    NOTE:
    The current implementation returns a random text,
    regardless of which texts the user has seen.
    """
    query = select(models.Text).order_by(func.random()).limit(1)
    text = session.scalars(query).one_or_none()

    return text


@router.get(
    "/texts/{text_id}",
    response_model=schemas.Text,
)
async def get_text(
    text_id: str,
    session: Annotated[Session, Depends(get_session)],
):
    """
    Gets a text by the given id.
    """
    text = session.get(models.Text, text_id)
    if not text:
        raise TextNotFoundException(text_id=text_id)

    return text


@router.get(
    "/texts/{text_id}/questions/next",
    response_model=list[schemas.Question],
)
async def get_next_questions(
    text_id: str,
    session: Annotated[Session, Depends(get_session)],
):
    """
    Gets next 10 questions that the user has not attempted before.
    NOTE:
    The current implementation returns 10 random questions for the given text,
    regardless of which questions the user has seen.
    """
    text = session.get(models.Text, text_id)
    if not text:
        raise TextNotFoundException(text_id=text_id)

    num_questions = 10
    if len(text.questions) < num_questions:
        raise NotEnoughQuestionsException(text_id=text_id)

    return random.sample(text.questions, num_questions)


@router.post(
    "/texts/{text_id}/answers",
    response_model=list[schemas.QuestionResult],
)
async def post_game_results(
    text_id: str,
    answers: schemas.QuestionAnswersWithWpm,
    user: Annotated[models.User, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_session)],
):
    """
    Accepts the question answers and other statistics.
    Returns the results to the answers.
    """
    results = []
    question_ids = []
    for answer in answers.answers:
        question = session.get(models.Question, answer.question_id)
        if not question:
            raise QuestionNotFoundException(question_id=answer.question_id)
        if question.text_id != text_id:
            # TODO: Extracting every exception like this may be overkill.
            # fmt: off
            raise QuestionNotBelongToTextException(question_id=answer.question_id, text_id=text_id)
        if answer.question_id in question_ids:
            raise DuplicateQuestionsException(question_id=answer.question_id)

        results.append(
            schemas.QuestionResult(
                question_id=answer.question_id,
                correct=answer.selected_option == question.correct_option,
                selected_option=answer.selected_option,
                correct_option=question.correct_option,
            )
        )
        question_ids.append(answer.question_id)

    # Save the history before returning the results to the question answers.
    text = session.get(models.Text, text_id)
    if not text:
        raise TextNotFoundException(text_id=text_id)

    history = models.History(
        user_id=user.id,
        text_id=text_id,
        question_ids=question_ids,
        game_mode=answers.game_mode,
        game_submode=answers.game_submode,
        average_wpm=answers.average_wpm,
        interval_wpms=answers.interval_wpms,
        score=sum(result.correct for result in results) / len(results) * 100,
        answers=[result.selected_option for result in results],
    )
    history.save()

    return results

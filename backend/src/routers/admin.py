import json
import os
from typing import Annotated

import openai
from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_session
from ..logger import LoggerRoute
from ..services.exceptions import (
    BadResponseFromOpenAI,
    QuestionNotBelongToTextException,
    QuestionNotFoundException,
    TextNotFoundException,
)

router = APIRouter(prefix="/admin", tags=["admin"], route_class=LoggerRoute)


@router.get(
    "/statistics",
    response_model=schemas.AdminStatistics,
)
async def get_admin_statistics(
    game_mode: Annotated[str, Query()],
):
    """
    Gets the statistics of the admin.
    """
    pipeline = [
        {
            "$group": {
                "_id": game_mode,
                "minWpm": {"$min": "$wpm"},
                "maxWpm": {"$max": "$wpm"},
                "avgWpm": {"$avg": "$wpm"},
                "avgScore": {"$avg": "$score"},
            }
        }
    ]
    data = models.History.objects(game_mode=game_mode).aggregate(pipeline)
    data = list(data)[0]

    return schemas.AdminStatistics(
        min_wpm=data["minWpm"],
        max_wpm=data["maxWpm"],
        average_wpm=data["avgWpm"],
        average_score=data["avgScore"],
    )


@router.get(
    "/texts",
    response_model=list[schemas.Text],
)
async def get_texts(
    *,
    page: Annotated[int, Query()] = 1,
    page_size: Annotated[int, Query()] = 10,
    session: Annotated[Session, Depends(get_session)],
):
    """
    Gets all texts.
    """
    query = select(models.Text).offset((page - 1) * page_size).limit(page_size)
    texts = session.scalars(query).all()
    return texts


@router.get(
    "/texts/{text_id}",
    response_model=schemas.TextWithQuestions,
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


@router.delete(
    "/texts/{text_id}",
    response_model=schemas.Text,
)
async def delete_text(
    text_id: str,
    session: Annotated[Session, Depends(get_session)],
):
    """
    Deletes a text by the given id.
    """
    text = session.get(models.Text, text_id)
    if not text:
        raise TextNotFoundException(text_id=text_id)

    session.delete(text)
    session.commit()
    return text


@router.get(
    "/texts/{text_id}/questions",
    response_model=list[schemas.QuestionWithCorrectOption],
)
async def get_questions(
    text_id: str,
    session: Annotated[Session, Depends(get_session)],
):
    """
    Gets the questions of a text by the given id.
    """
    query = select(models.Question).filter_by(text_id=text_id)
    questions = session.scalars(query).all()
    return questions


@router.get(
    "/texts/{text_id}/questions/{question_id}",
    response_model=schemas.QuestionWithCorrectOption,
)
async def get_question(
    text_id: str,
    question_id: str,
    session: Annotated[Session, Depends(get_session)],
):
    """
    Gets a question of a text by the given id.
    """
    question = session.get(models.Question, question_id)
    if not question:
        raise QuestionNotFoundException(question_id=question_id)
    if question.text_id != text_id:
        raise QuestionNotBelongToTextException(question_id=question_id, text_id=text_id)

    return question


@router.delete(
    "/texts/{text_id}/questions/{question_id}",
    response_model=schemas.Question,
)
async def delete_question(
    text_id: str,
    question_id: str,
    session: Annotated[Session, Depends(get_session)],
):
    """
    Deletes a question of a text by the given id.
    """
    question = session.get(models.Question, question_id)
    if not question:
        raise QuestionNotFoundException(question_id=question_id)
    if question.text_id != text_id:
        raise QuestionNotBelongToTextException(question_id=question_id, text_id=text_id)

    session.delete(question)
    session.commit()
    return question


@router.get(
    "/texts/{text_id}/questions/{question_id}/statistics",
    response_model=schemas.QuestionStatistics,
)
async def get_question_statistics(
    text_id: str,
    question_id: str,
    session: Annotated[Session, Depends(get_session)],
):
    """
    Gets a question statistics of a text by the given id.
    """
    question = session.get(models.Question, question_id)
    if not question:
        raise QuestionNotFoundException(question_id=question_id)
    if question.text_id != text_id:
        raise QuestionNotBelongToTextException(question_id=question_id, text_id=text_id)

    pipeline = [
        {"$group": {"_id": None, "avgScore": {"$avg": "$score"}}},
    ]
    data = models.History.objects().aggregate(pipeline)
    data = list(data)[0]

    result_counts = []
    for option in range(len(question.options)):
        result_count = models.History.objects(
            results__elemMatch={
                "question_id": question_id,
                "selected_option": option,
            }
        ).count()
        result_counts.append(result_count)

    return schemas.QuestionStatistics(
        question_id=question_id,
        average_score=data["avgScore"],
        options=question.options,
        correct_option=question.correct_option,
        selected_options=[
            result_count * 100 // sum(result_counts) for result_count in result_counts
        ],
    )


OPENAPI_KEY = os.environ.get("OPENAPI_KEY")

def build_text_generation_prompt(difficulty: str, is_fiction: bool):
    return (
        "I want an extract of a text that belongs to the public domain. "
        f"The text you choose must be {"fiction" if is_fiction else "non-fiction"}. "
        f"The text you choose must have a reading difficulty of {difficulty} (you can judge this). "
        "For this text, return to me in JSON format, the title, an extract from the text larger than 500 words, "
        "author, a link to the Gutenberg project if it exists, "
        "and a list of 10 questions to test how well someone has understood the extract after reading it. "
        "The questions must all be answerable just from reading the extract. "
        "Each question should have four options with one correct option. "
        "I also want a summary of the provided text if it is non-fiction.\n"
        "The JSON must follow the format:\n"
        "{\n"
        '    "title": <string>,\n'
        '    "extract": <string>,\n'
        '    "author": <string>,\n'
        '    "gutenberg_link": <string>,\n'
        '    "questions": [\n'
        '        {'
        '            "question": <string>,\n'
        '            "options": [\n'
        '                <string>,\n'
        '                <string>,\n'
        '                <string>,\n'
        '                <string>\n'
        '            ],\n'
        '            "correct_option": <string>\n'
        '        },\n'
        '        ...\n'
        '    ],\n'
        '    "summarised": <string>\n'
        "}\n"
        "Your response must only contain the JSON answer and nothing else."
    )

@router.post(
    "/generate-text",
    response_model=schemas.TextWithQuestions,
)
async def generate_text(
    difficulty: str,
    is_fiction: bool
):
    if (
        (response := openai.OpenAI(api_key=OPENAPI_KEY).chat.completions.create(
            model="gpt-4", messages=[{"role": "user", "content": build_text_generation_prompt(difficulty, is_fiction)}]
        ).choices[0].message.content) is None
    ):
        raise BadResponseFromOpenAI()
    
    # TODO: Use summarised text, gutenberg link, author
    response_json = json.loads(response)
    return schemas.TextWithQuestions(
        id="",
        title=response_json["title"],
        content=response_json["extract"],
        difficulty=response_json["difficulty"],
        word_count=len(response_json["extract"].split(" ")),
        questions=[
            schemas.QuestionWithCorrectOption(
                id="",
                content=question_json["question"],
                options=question_json["options"],
                correct_option=question_json["options"].index(question_json["correct_option"])
            )
            for question_json in response_json["questions"]
        ]
    )

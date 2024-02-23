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
                "_id": None,
                "minWpm": {"$min": "$average_wpm"},
                "maxWpm": {"$max": "$average_wpm"},
                "avgWpm": {"$avg": "$average_wpm"},
                "avgScore": {"$avg": "$score"},
            }
        }
    ]
    data = models.History.objects(game_mode=game_mode).aggregate(pipeline)
    data = list(data)[0]

    return schemas.AdminStatistics(
        min_wpm=data.get("minWpm", 0),
        max_wpm=data.get("maxWpm", 0),
        average_wpm=int(data.get("avgWpm", 0)),
        average_score=int(data.get("avgScore", 0)),
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
    response_model=list[schemas.Question],
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
    response_model=schemas.Question,
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
        options=question.options,
        correct_option=question.correct_option,
        selected_options=[
            result_count * 100 // max(sum(result_counts), 1)
            for result_count in result_counts
        ],
    )


def build_text_generation_prompt(difficulty: str, fiction: bool):
    return f"""
I want an extract of a text that belongs to the public domain. 
The text you choose must be {'fiction' if fiction else 'non-fiction'}. 
The text you choose must have a reading difficulty of {difficulty} (you can judge this). 
For this text, return to me in JSON format, the title, an extract from the text larger than 500 words, 
author, a link to the Gutenberg project if it exists, 
and a list of 10 questions to test how well someone has understood the extract after reading it. 
The questions must all be answerable just from reading the extract. 
Each question should have four options with one correct option. 
I also want a summary of the provided text if it is non-fiction.
The JSON must follow the format:
{{
    "title": <string>,
    "extract": <string>,
    "author": <string>,
    "gutenberg_link": <string>,
    "questions": [
        {{
            "question": <string>,
            "options": [
                <string>,
                <string>,
                <string>,
                <string>
            ],
            "correct_option": <string>
        }},
        ...
    ],
    "summarised": <string>
}}
Your response must only contain the JSON answer and nothing else.
"""


OPENAPI_KEY = os.environ.get("OPENAPI_KEY")


@router.post(
    "/generate-text",
    response_model=schemas.TextCreateWithQuestions,
)
async def generate_text(difficulty: str, fiction: bool):
    response = (
        openai.OpenAI(api_key=OPENAPI_KEY)
        .chat.completions.create(
            model="gpt-4",
            messages=[
                {
                    "role": "user",
                    "content": build_text_generation_prompt(difficulty, fiction),
                }
            ],
        )
        .choices[0]
        .message.content
    )
    if not response:
        raise BadResponseFromOpenAI()

    text = json.loads(response)
    return schemas.TextCreateWithQuestions(
        title=text["title"],
        content=text["extract"],
        difficulty=difficulty,
        fiction=fiction,
        word_count=len(text["extract"].split(" ")),
        questions=[
            schemas.QuestionCreate(
                content=question["question"],
                options=question["options"],
                correct_option=question["options"].index(question["correct_option"]),
            )
            for question in text["questions"]
        ],
        summary=text["summarised"],
        source=text["gutenberg_link"],
    )


@router.post(
    "/approve-text",
    response_model=schemas.TextWithQuestions,
)
async def approve_text(
    text_data: schemas.TextCreateWithQuestions,
    session: Annotated[Session, Depends(get_session)],
):
    """
    Adds a text to the database.
    """

    text = models.Text(
        title=text_data.title,
        content=text_data.content,
        summary=text_data.summary,
        source=text_data.source,
        fiction=text_data.fiction,
        difficulty=text_data.difficulty,
        word_count=text_data.word_count,
    )
    questions = [
        models.Question(
            text=text,
            content=question.content,
            options=question.options,
            correct_option=question.correct_option,
        )
        for question in text_data.questions
    ]
    session.add(text)
    session.add_all(questions)
    session.commit()

    return text

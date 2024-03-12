import base64
import json
import os
from typing import Annotated

import openai
import requests
from fastapi import APIRouter, Depends, Query, Security
from sqlalchemy import select
from sqlalchemy.orm import Session

from .. import models, schemas
from ..config import config
from ..database import get_session
from ..logger import LoggerRoute
from ..services.auth import verify_admin
from ..services.exceptions import (
    BadResponseFromOpenAI,
    NotEnoughQuestionsException,
    QuestionNotBelongToTextException,
    QuestionNotFoundException,
    TextNotFoundException,
)

router = APIRouter(
    prefix="/admin",
    tags=["admin"],
    route_class=LoggerRoute,
    dependencies=[Security(verify_admin)],
)


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
            "$match": {"game_mode": game_mode},
        },
        {
            "$group": {
                "_id": None,
                "minWpm": {"$min": "$average_wpm"},
                "maxWpm": {"$max": "$average_wpm"},
                "avgWpm": {"$avg": "$average_wpm"},
                "avgScore": {"$avg": "$score"},
            }
        },
    ]
    item = models.History.objects().aggregate(pipeline)
    item = next(item, {})

    return schemas.AdminStatistics(
        min_wpm=item.get("minWpm", 0),
        max_wpm=item.get("maxWpm", 0),
        average_wpm=int(item.get("avgWpm", 0)),
        average_score=int(item.get("avgScore", 0)),
    )


@router.get(
    "/texts",
    response_model=list[schemas.TextWithStatistics],
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

    pipeline = [
        {
            "$match": {
                "text_id": {"$in": [text.id for text in texts]},
            },
        },
        {
            "$group": {
                "_id": "$text_id",
                "minWpm": {"$min": "$average_wpm"},
                "maxWpm": {"$max": "$average_wpm"},
                "avgWpm": {"$avg": "$average_wpm"},
                "avgScore": {"$avg": "$score"},
            }
        },
    ]
    items = models.History.objects().aggregate(pipeline)
    items = {item["_id"]: item for item in items}

    texts_with_stats = []
    for text in texts:
        item = items.get(text.id, {})
        text_with_stats = schemas.TextWithStatistics(
            id=text.id,
            title=text.title,
            content=text.content,
            summary=text.summary,
            source=text.source,
            fiction=text.fiction,
            difficulty=text.difficulty,
            word_count=text.word_count,
            description=text.description,
            author=text.author,
            image_base64=base64.b64encode(text.image_bytes).decode("utf-8"),
            min_wpm=item.get("minWpm", 0),
            max_wpm=item.get("maxWpm", 0),
            average_wpm=int(item.get("avgWpm", 0)),
            average_score=int(item.get("avgScore", 0)),
        )
        texts_with_stats.append(text_with_stats)
    return texts_with_stats


@router.get(
    "/texts/{text_id}",
    response_model=schemas.TextWithQuestionsAndStatistics,
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

    pipeline = [
        {
            "$match": {"text_id": text_id},
        },
        {
            "$group": {
                "_id": "$text_id",
                "minWpm": {"$min": "$average_wpm"},
                "maxWpm": {"$max": "$average_wpm"},
                "avgWpm": {"$avg": "$average_wpm"},
                "avgScore": {"$avg": "$score"},
            }
        },
    ]
    item = models.History.objects().aggregate(pipeline)
    item = next(item, {})

    # TODO: Avoid duplicate code.
    return schemas.TextWithQuestionsAndStatistics(
        id=text.id,
        title=text.title,
        content=text.content,
        summary=text.summary,
        source=text.source,
        fiction=text.fiction,
        difficulty=text.difficulty,
        word_count=text.word_count,
        description=text.description,
        author=text.author,
        image_type=text.image_type,
        image_base64=base64.b64encode(text.image_bytes).decode("utf-8"),
        min_wpm=item.get("minWpm", 0),
        max_wpm=item.get("maxWpm", 0),
        average_wpm=int(item.get("avgWpm", 0)),
        average_score=int(item.get("avgScore", 0)),
        questions=[
            schemas.Question(
                id=question.id,
                content=question.content,
                options=question.options,
                correct_option=question.correct_option,
            )
            for question in text.questions
        ],
    )


@router.delete(
    "/texts/{text_id}",
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


@router.get(
    "/texts/{text_id}/questions",
    response_model=list[schemas.QuestionWithStatistics],
)
async def get_questions(
    text_id: str,
    session: Annotated[Session, Depends(get_session)],
):
    """
    Gets the questions of a text by the given id.
    """
    query = select(models.Question).where(models.Question.text_id == text_id)
    questions = session.scalars(query).all()

    pipeline = [
        {
            "$unwind": "$results",
        },
        {
            "$match": {"text_id": text_id},
        },
        {
            "$group": {
                "_id": "$results.question_id",
                # fmt: off
                "avgOption0": {"$avg": {"$cond": [{"$eq": ["$results.selected_option", 0]}, 1, 0]}},
                "avgOption1": {"$avg": {"$cond": [{"$eq": ["$results.selected_option", 1]}, 1, 0]}},
                "avgOption2": {"$avg": {"$cond": [{"$eq": ["$results.selected_option", 2]}, 1, 0]}},
                "avgAcc": {"$avg": {"$cond": [{"$eq": ["$results.correct", True]}, 1, 0]}},
            }
        },
    ]
    items = models.History.objects().aggregate(pipeline)
    items = {item["_id"]: item for item in items}

    questions_with_stats = []
    for question in questions:
        item = items.get(question.id, {})
        question_with_stats = schemas.QuestionWithStatistics(
            id=question.id,
            content=question.content,
            options=question.options,
            correct_option=question.correct_option,
            percentages=[int(item.get(f"avgOption{i}", 0) * 100) for i in range(3)],
            accuracy=int(item.get("avgAcc", 0) * 100),
        )
        questions_with_stats.append(question_with_stats)

    return questions_with_stats


@router.get(
    "/texts/{text_id}/questions/{question_id}",
    response_model=schemas.QuestionWithStatistics,
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

    pipeline = [
        {
            "$unwind": "$results",
        },
        {
            "$match": {"results.question_id": question_id},
        },
        {
            "$group": {
                "_id": None,
                # TODO: Avoid duplicate code.
                # fmt: off
                "avgOption0": {"$avg": {"$cond": [{"$eq": ["$results.selected_option", 0]}, 1, 0]}},
                "avgOption1": {"$avg": {"$cond": [{"$eq": ["$results.selected_option", 1]}, 1, 0]}},
                "avgOption2": {"$avg": {"$cond": [{"$eq": ["$results.selected_option", 2]}, 1, 0]}},
                "avgAcc": {"$avg": {"$cond": [{"$eq": ["$results.correct", True]}, 1, 0]}},
            }
        },
    ]
    item = models.History.objects().aggregate(pipeline)
    item = next(item, {})

    return schemas.QuestionWithStatistics(
        id=question.id,
        content=question.content,
        options=question.options,
        correct_option=question.correct_option,
        percentages=[int(item.get(f"avgOption{i}", 0) * 100) for i in range(3)],
        accuracy=int(item.get("avgAcc", 0) * 100),
    )


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


def build_text_generation_prompt(difficulty: str, fiction: bool):
    return f"""
I want an extract of a text that belongs to the public domain. 
The text you choose must be {'fiction' if fiction else 'non-fiction'}. 
The text you choose must have a reading difficulty of {difficulty} (you can judge this). 
For this text, return to me in JSON format, the title, an extract from the text larger than 500 words, 
author, a link to the Gutenberg project if it exists, 
and a list of 15 questions to test how well someone has understood the extract after reading it. 
Make sure to generate 15 questions, any number of questions less than 15 is not acceptable.
The questions must all be answerable just from reading the extract. 
Each question should have three options with one correct option. 
I also want a summary of the provided text if it is non-fiction.
I also want a blurb of the provided text returned as description.
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
                <string>
            ],
            "correct_option": <string>
        }},
        ...
    ],
    "summarised": <string>,
    "description": <string>
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
    text["image_url"] = ""
    if text["gutenberg_link"]:
        image_id = text["gutenberg_link"].split("/")[-1]
        image_url = f"https://www.gutenberg.org/cache/epub/{image_id}/pg{image_id}.cover.medium.jpg"
        text["image_url"] = image_url

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
        summary=text.get("summarised", None),
        source=text["gutenberg_link"],
        description=text["description"],
        author=text["author"],
        image_url=text["image_url"],
    )


# TODO:
# Rename this endpoint to `submit_text`.
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

    if len(text_data.questions) < 10:
        # TODO:
        # Make a dedicated exception for this.
        raise NotEnoughQuestionsException(text_id="")

    response = requests.get(
        text_data.image_url,
        stream=True,
        timeout=10,
    )
    if response.ok:
        image_bytes = response.raw.read()
        image_type = response.headers["Content-Type"]
    else:
        with open(f"{config.app_dir}/assets/default.jpg", "rb") as file:
            image_bytes = file.read()
            image_type = "image/jpeg"

    # fmt: off
    summary = text_data.summary if text_data.summary and text_data.summary != "" else None
    text = models.Text(
        title=text_data.title,
        content=text_data.content,
        summary=summary,
        source=text_data.source,
        fiction=text_data.fiction,
        difficulty=text_data.difficulty,
        word_count=text_data.word_count,
        description=text_data.description,
        author=text_data.author,
        image_type=image_type,
        image_bytes=image_bytes,
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

    # TODO: Avoid duplicate code.
    return schemas.TextWithQuestions(
        id=text.id,
        title=text.title,
        content=text.content,
        summary=text.summary,
        source=text.source,
        fiction=text.fiction,
        difficulty=text.difficulty,
        word_count=text.word_count,
        description=text.description,
        author=text.author,
        image_type=text.image_type,
        image_base64=base64.b64encode(text.image_bytes).decode("utf-8"),
        questions=[
            schemas.Question(
                id=question.id,
                content=question.content,
                options=question.options,
                correct_option=question.correct_option,
            )
            for question in text.questions
        ],
    )

@router.get(
    "/text-statistics",
    response_model=schemas.OverallTextStatistics,
)
async def get_summary_statistics(
    text_id: str,
    session: Annotated[Session, Depends(get_session)],
    ):
    group = {
        "$group": {
            "_id": None,
            "minWpm": {"$min": "$average_wpm"},
            "maxWpm": {"$max": "$average_wpm"},
            "avgWpm": {"$avg": "$average_wpm"},
            "avgScore": {"$avg": "$score"},
        }
    }
    # create another group identical to the above but finding the 25th percentile
    group_stage = {
        "$group": {
            "_id": None,
            "minWpm": {"$min": "$average_wpm"},
            "maxWpm": {"$max": "$average_wpm"},
            "avgWpm": {"$avg": "$average_wpm"},
            "avgScore": {"$avg": "$score"},
            "wpmValues": {"$push": "$average_wpm"},
        },
    }

    add_fields_stage = {
        "$addFields": {
            "25thPercentile": {
                "$arrayElemAt": [
                    "$wpmValues",
                    {"$ceil": {"$multiply": [{"$size": "$wpmValues"}, 0.25]}}
                ]
            },
            "50thPercentile": {
                "$arrayElemAt": [
                    "$wpmValues",
                    {"$ceil": {"$multiply": [{"$size": "$wpmValues"}, 0.50]}}
                ]
            },
            "75thPercentile": {
                "$arrayElemAt": [
                    "$wpmValues",
                    {"$ceil": {"$multiply": [{"$size": "$wpmValues"}, 0.75]}}
                ]
            }
        }
    }

    # pipeline = [group_stage, add_fields_stage]
    
    # find results for standard game mode and unsummarised text
    pipeline = [
        {
        "$match": {
            "text_id": text_id,
            "game_mode": "standard",
            "summary": False,
        },
        },
        {
            "$sort": {"average_wpm": 1}
        },
        group_stage,
        add_fields_stage
    ]
    original_standard = models.History.objects().aggregate(pipeline)
    original_standard = next(original_standard, {})
    original_standard = schemas.TextStatistics(
        min_wpm=original_standard.get("minWpm", 0),
        max_wpm=original_standard.get("maxWpm", 0),
        average_wpm=int(original_standard.get("avgWpm", 0)),
        average_score=int(original_standard.get("avgScore", 0)),
        twenty_fifth_percentile=original_standard.get("25thPercentile", 0),
        fiftieth_percentile=original_standard.get("50thPercentile", 0),
        seventy_fifth_percentile=original_standard.get("75thPercentile", 0),
    )

    # find results for adaptive game mode and unsummarised text
    pipeline = [
        {
            "$match": {
                "text_id": text_id,
                "game_mode": "adaptive",
                "summary": False,
            }
        },
        {
            "$sort": {"average_wpm": 1}
        },
        group_stage,
        add_fields_stage
    ]
    original_adaptive = models.History.objects().aggregate(pipeline)
    original_adaptive = next(original_adaptive, {})
    original_adaptive = schemas.TextStatistics(
        min_wpm=original_adaptive.get("minWpm", 0),
        max_wpm=original_adaptive.get("maxWpm", 0),
        average_wpm=int(original_adaptive.get("avgWpm", 0)),
        average_score=int(original_adaptive.get("avgScore", 0)),
        twenty_fifth_percentile=original_adaptive.get("25thPercentile", 0),
        fiftieth_percentile=original_adaptive.get("50thPercentile", 0),
        seventy_fifth_percentile=original_adaptive.get("75thPercentile", 0),
    )

    # find results for standard game mode and summarised text
    pipeline = [
        {
        "$match": {
            "text_id": text_id,
            "game_mode": "standard",
            "summary": True,
        },
        },
        {
            "$sort": {"average_wpm": 1}
        },
        group_stage,
        add_fields_stage
    ]
    summarised_standard = models.History.objects().aggregate(pipeline)
    summarised_standard = next(summarised_standard, {})
    summarised_standard = schemas.TextStatistics(
        min_wpm=summarised_standard.get("minWpm", 0),
        max_wpm=summarised_standard.get("maxWpm", 0),
        average_wpm=int(summarised_standard.get("avgWpm", 0)),
        average_score=int(summarised_standard.get("avgScore", 0)),
        twenty_fifth_percentile=summarised_standard.get("25thPercentile", 0),
        fiftieth_percentile=summarised_standard.get("50thPercentile", 0),
        seventy_fifth_percentile=summarised_standard.get("75thPercentile", 0),
    )

    # find results for adaptive game mode and summarised text
    pipeline = [
        {
        "$match": {
            "text_id": text_id,
            "game_mode": "adaptive",
            "summary": True,
        },
        },
        {
            "$sort": {"average_wpm": 1}
        },
        group_stage,
        add_fields_stage
    ]
    summarised_adaptive = models.History.objects().aggregate(pipeline)
    summarised_adaptive = next(summarised_adaptive, {})
    summarised_adaptive = schemas.TextStatistics(
        min_wpm=summarised_adaptive.get("minWpm", 0),
        max_wpm=summarised_adaptive.get("maxWpm", 0),
        average_wpm=int(summarised_adaptive.get("avgWpm", 0)),
        average_score=int(summarised_adaptive.get("avgScore", 0)),
        twenty_fifth_percentile=summarised_adaptive.get("25thPercentile", 0),
        fiftieth_percentile=summarised_adaptive.get("50thPercentile", 0),
        seventy_fifth_percentile=summarised_adaptive.get("75thPercentile", 0),
    )
    
    # find results for any game mode and summarised text
    pipeline = [
        {
        "$match": {
            "text_id": text_id,
            "summary": True,
        },
        },
        {
            "$sort": {"average_wpm": 1}
        },
        group_stage,
        add_fields_stage
    ]
    summarised = models.History.objects().aggregate(pipeline)
    summarised = next(summarised, {})
    summarised = schemas.TextStatistics(
        min_wpm=summarised.get("minWpm", 0),
        max_wpm=summarised.get("maxWpm", 0),
        average_wpm=int(summarised.get("avgWpm", 0)),
        average_score=int(summarised.get("avgScore", 0)),
        twenty_fifth_percentile=summarised.get("25thPercentile", 0),
        fiftieth_percentile=summarised.get("50thPercentile", 0),
        seventy_fifth_percentile=summarised.get("75thPercentile", 0),
    )

    query = select(models.Text).where(models.Text.id == text_id)
    text = session.scalars(query).first()

    results = schemas.OverallTextStatistics(
        id=text_id,
        title=text.title,
        content=text.content,
        summary=text.summary,
        original_standard=original_standard,
        original_adaptive=original_adaptive,
        summarised_standard=summarised_standard,
        summarised_adaptive=summarised_adaptive,
        summarised_overall=summarised,
    )

    return results


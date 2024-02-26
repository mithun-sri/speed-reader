import logging
from datetime import datetime

import ulid
from bson.codec_options import CodecOptions
from mongoengine import (
    BooleanField,
    DateTimeField,
    DictField,
    Document,
    EmbeddedDocument,
    EmbeddedDocumentField,
    IntField,
    ListField,
    StringField,
    get_db,
)
from pymongo import ASCENDING
from pymongo.errors import CollectionInvalid

# Create a time series collection explicitly using PyMongo
# as MongoEngine does not support creation of time series collections.
# NOTE: Make sure to use MongoDB 5.0+ for time series collections.
try:
    db = get_db()
    collection = db.create_collection(
        "history",
        codec_options=CodecOptions(tz_aware=True),
        timeseries={
            "timeField": "timestamp",
            "metaField": "metadata",
        },
    )
    # Create a compound index on the user_id and text_id fields.
    collection.create_index(
        [
            ("user_id", ASCENDING),
            ("text_id", ASCENDING),
        ],
        unique=False,
    )
except CollectionInvalid:
    logging.info("Collection already exists.")
except Exception as e:
    logging.error("Failed to create history collection: %s", e)


class Result(EmbeddedDocument):
    question_id = StringField(required=True)
    correct = BooleanField(required=True)
    correct_option = IntField(required=True)
    selected_option = IntField(required=True)


class History(Document):
    meta = {"collection": "history"}

    id = StringField(
        primary_key=True,
        db_field="_id",
        default=lambda: str(ulid.new()),
    )
    timestamp = DateTimeField(required=True, default=datetime.utcnow)
    metadata = DictField(required=False)
    user_id = StringField(required=True)
    text_id = StringField(required=True)
    question_ids = ListField(StringField(), required=True)
    game_mode = StringField(required=True)
    game_submode = StringField(required=True)
    # TODO: Rename to `is_summary`
    # Can only be True if text is non-fiction.
    summary = BooleanField(required=True)
    average_wpm = IntField(required=True)
    # TODO: Temporarily set to `required=False` to accept empty list.
    interval_wpms = ListField(IntField(), required=False)
    score = IntField(required=True)
    results = ListField(EmbeddedDocumentField(Result), required=True)

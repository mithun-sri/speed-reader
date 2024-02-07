from datetime import datetime

import ulid
from mongoengine import DateTimeField, Document, IntField, ListField, StringField


class History(Document):
    meta = {"collection": "history"}

    id = StringField(
        primary_key=True,
        db_field="_id",
        default=lambda: str(ulid.new()),
    )
    datetime = DateTimeField(required=True, default=datetime.utcnow)
    user_id = StringField(required=True)
    text_id = StringField(required=True)
    question_ids = ListField(StringField(), required=True)
    game_mode = StringField(required=True)
    game_submode = StringField(required=False)  # Only for standard game mode
    average_wpm = IntField(required=True)
    interval_wpms = ListField(IntField(), required=True)
    score = IntField(required=True)
    answers = ListField(IntField(), required=True)

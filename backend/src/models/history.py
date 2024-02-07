import ulid
from mongoengine import (
    DateTimeField,
    Document,
    IntField,
    ListField,
    ObjectIdField,
    StringField,
)


class History(Document):
    meta = {"collection": "history"}

    id = ObjectIdField(
        primary_key=True,
        db_field="_id",
        default=lambda: str(ulid.new()),
    )
    date = DateTimeField(required=True)
    user_id = StringField(required=True)
    text_id = StringField(required=True)
    question_ids = ListField(StringField(), required=True)
    game_mode = StringField(required=True)
    game_submode = StringField(required=True)
    wpm = IntField(required=True)
    score = IntField(required=True)
    answers = ListField(IntField(), required=True)

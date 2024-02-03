from mongoengine import (
    DateTimeField,
    Document,
    IntField,
    ListField,
    ObjectIdField,
    UUIDField,
)


class History(Document):
    id = ObjectIdField(primary_key=True, db_field="_id")
    user_id = ObjectIdField(required=True)
    text_id = UUIDField(required=True)
    date_played = DateTimeField(required=True)
    score = IntField(required=True)
    game_mode = IntField(required=True)
    question_ids = ListField(UUIDField(), required=True)
    meta = {"collection": "history"}

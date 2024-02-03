from mongoengine import DateTimeField, Document, IntField, ListField, UUIDField


class History(Document):
    id = UUIDField(primary_key=True)
    user_id = UUIDField(required=True)
    text_id = UUIDField(required=True)
    date_played = DateTimeField(required=True)
    score = IntField(required=True)
    game_mode = IntField(required=True)
    question_ids = ListField(UUIDField(), required=True)
    meta = {"collection": "history"}

from mongoengine import DateTimeField, Document, IntField, ListField, ObjectIdField, UUIDField, StringField


class History(Document):
    id = UUIDField(primary_key=True)
    user_id = ObjectIdField(required=True)
    text_id = StringField(required=True)
    date_played = DateTimeField(required=True)
    score = IntField(required=True)
    game_mode = IntField(required=True)
    question_ids = ListField(UUIDField(), required=True)
    meta = {'collection': 'history'}

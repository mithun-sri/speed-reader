from datetime import datetime

from mongoengine import (
    DateTimeField,
    Document,
    IntField,
    StringField
)

class User(Document):
    user_id = IntField(primary_key=True)
    username = StringField(required=True, unique=True)
    email = StringField(required=True, unique=True)
    password = StringField(required=True)
    created_at = DateTimeField(default=datetime.utcnow)
    status = StringField(default="active")
    meta = {"collection": "users"}
from datetime import datetime

from mongoengine import DateTimeField, Document, IntField, StringField, ObjectIdField


class User(Document):
    user_id = ObjectIdField(primary_key=True, db_field="_id")
    username = StringField(required=True, unique=True)
    email = StringField(required=True, unique=True)
    password = StringField(required=True)
    created_at = DateTimeField(default=datetime.utcnow)
    status = StringField(default="active")
    meta = {"collection": "users"}

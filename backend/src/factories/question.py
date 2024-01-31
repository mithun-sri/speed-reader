import factory
from sqlalchemy.orm import Session

from ..database import schema


class QuestionFactory(factory.alchemy.SQLAlchemyModelFactory):
    class Meta:
        model = schema.Question
        sqlalchemy_session = Session()

    content = factory.Faker("sentence")
    options = factory.Faker("sentences", nb=3)
    correct_option = factory.Faker("random_int", min=0, max=2)

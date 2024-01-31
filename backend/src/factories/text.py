import factory
from sqlalchemy.orm import Session

from ..database import schema
from .question import QuestionFactory


class TextFactory(factory.alchemy.SQLAlchemyModelFactory):
    class Meta:
        model = schema.Text
        sqlalchemy_session = Session()

    title = factory.Faker("sentence")
    content = factory.Faker("text")
    difficulty = factory.Faker("random_element", elements=["easy", "medium", "hard"])

    @factory.lazy_attribute
    def word_count(self):
        # pylint: disable=no-member
        return len(self.content.split())

    questions = factory.RelatedFactoryList(
        QuestionFactory,
        factory_related_name="text",
        size=3,
    )

import factory

from ..database import schema


class TextFactory(factory.alchemy.SQLAlchemyModelFactory):
    class Meta:
        model = schema.Text

    title = factory.Faker("sentence")
    content = factory.Faker("text")
    difficulty = factory.Faker("random_element", elements=["easy", "medium", "hard"])

    @factory.lazy_attribute
    def word_count(self):
        # pylint: disable=no-member
        return len(self.content.split())

import factory

from .. import models


class TextFactory(factory.alchemy.SQLAlchemyModelFactory):
    class Meta:
        model = models.Text

    title = factory.Faker("sentence")
    content = factory.Faker("text")
    difficulty = factory.Faker("random_element", elements=["easy", "medium", "hard"])
    game_mode = factory.Faker("random_int", min=1, max=2)
    word_count = factory.LazyAttribute(lambda obj: len(obj.content.split()))

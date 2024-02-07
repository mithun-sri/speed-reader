import factory

from .. import models


class TextFactory(factory.alchemy.SQLAlchemyModelFactory):
    class Meta:
        model = models.Text

    title = factory.Faker("sentence")
    content = factory.Faker("text")
    game_mode = factory.Faker(
        "random_element",
        elements=["standard", "adaptive", "summary"],
    )
    word_count = factory.LazyAttribute(lambda obj: len(obj.content.split()))
    difficulty = factory.Faker(
        "random_element",
        elements=["easy", "medium", "hard"],
    )

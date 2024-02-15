import factory

from .. import models


class TextFactory(factory.alchemy.SQLAlchemyModelFactory):
    class Meta:
        model = models.Text

    title = factory.Faker("sentence")
    content = factory.Faker("text")
    summary = factory.Faker("text")
    source = factory.Faker("url")
    fiction = factory.Faker("boolean")
    word_count = factory.LazyAttribute(lambda obj: len(obj.content.split()))
    difficulty = factory.Faker(
        "random_element",
        elements=["easy", "medium", "hard"],
    )

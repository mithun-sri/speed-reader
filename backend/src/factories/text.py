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
    author = factory.Faker("name")
    image_url = "https://www.gutenberg.org/cache/epub/64317/pg64317.cover.medium.jpg"
    description = factory.Faker("text")

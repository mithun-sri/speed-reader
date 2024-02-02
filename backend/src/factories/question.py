import factory

from .. import models


class QuestionFactory(factory.alchemy.SQLAlchemyModelFactory):
    class Meta:
        model = models.Question

    content = factory.Faker("sentence")
    options = factory.Faker("sentences", nb=3)
    correct_option = factory.Faker("random_int", min=0, max=2)

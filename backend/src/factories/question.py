import factory

from ..models.question import Question


class QuestionFactory(factory.alchemy.SQLAlchemyModelFactory):
    class Meta:
        model = Question

    content = factory.Faker("sentence")
    options = factory.Faker("sentences", nb=3)
    correct_option = factory.Faker("random_int", min=0, max=2)

import random

import factory

from .. import models


class HistoryFactory(factory.mongoengine.MongoEngineFactory):
    class Meta:
        model = models.History

    date = factory.Faker("date_time")
    wpm = factory.Faker("random_int", min=0, max=1000)
    score = factory.Faker("random_int", min=0, max=100)

    @factory.lazy_attribute
    def answers(self):
        # NOTE:
        # The current implementation does not make sure score and answers are consistent.
        return [random.randint(0, 2) for _ in range(10)]

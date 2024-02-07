import random

import factory

from .. import models


class HistoryFactory(factory.mongoengine.MongoEngineFactory):
    class Meta:
        model = models.History

    datetime = factory.Faker("date_time")
    average_wpm = factory.Faker("random_int", min=1, max=1000)
    interval_wpms = factory.List(
        [factory.Faker("random_int", min=1, max=1000) for _ in range(10)]
    )
    score = factory.Faker("random_int", min=0, max=100)
    answers = factory.List(
        [factory.Faker("random_int", min=0, max=2) for _ in range(10)]
    )

    @factory.lazy_attribute
    def game_submode(self):
        if self.game_mode != "standard":
            return None

        return random.choice(["word_by_word", "highlight", "peripheral"])

import random

import factory

from .. import models

GAME_MODES = ["standard", "adaptive"]
GAME_SUBMODES = {
    "standard": ["word_by_word", "highlight", "peripheral"],
    "adaptive": ["highlight"],
}


class HistoryFactory(factory.mongoengine.MongoEngineFactory):
    class Meta:
        model = models.History

    timestamp = factory.Faker("iso8601")
    metadata = factory.LazyAttribute(lambda _obj: {})
    game_mode = factory.Faker("random_element", elements=GAME_MODES)
    game_submode = factory.LazyAttribute(
        lambda obj: random.choice(GAME_SUBMODES[obj.game_mode])
    )
    summary = factory.Faker("boolean")
    average_wpm = factory.Faker("random_int", min=1, max=1000)
    interval_wpms = factory.List(
        [factory.Faker("random_int", min=1, max=1000) for _ in range(10)]
    )
    score = factory.Faker("random_int", min=0, max=100)
    answers = factory.List(
        [factory.Faker("random_int", min=0, max=2) for _ in range(10)]
    )

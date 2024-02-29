import random

import factory

from .. import models

GAME_MODES = ["standard", "adaptive"]
GAME_SUBMODES = {
    "standard": ["word_by_word", "highlight", "peripheral"],
    "adaptive": ["highlight"],
}


class ResultFactory(factory.mongoengine.MongoEngineFactory):
    class Meta:
        model = models.Result

    correct = factory.LazyAttribute(
        lambda obj: obj.correct_option == obj.selected_option
    )
    # TODO: Extract 2 to a constant
    correct_option = factory.Faker("random_int", min=0, max=2)
    selected_option = factory.Faker("random_int", min=0, max=2)


class HistoryFactory(factory.mongoengine.MongoEngineFactory):
    class Meta:
        model = models.History

    timestamp = factory.Faker("iso8601")
    metadata = factory.LazyAttribute(lambda _obj: {})
    game_mode = factory.Faker("random_element", elements=GAME_MODES)
    game_submode = factory.LazyAttribute(
        lambda obj: random.choice(GAME_SUBMODES[obj.game_mode])
    )
    difficulty = factory.Faker("random_element", elements=["easy", "medium", "hard"])
    summary = factory.Faker("boolean")
    average_wpm = factory.Faker("random_int", min=1, max=1000)
    interval_wpms = factory.List(
        [factory.Faker("random_int", min=1, max=1000) for _ in range(10)]
    )
    # fmt: off
    score = factory.LazyAttribute(
        # TODO: Refactor
        lambda obj: sum(result.correct for result in obj.results) * 100 // max(len(obj.results), 1)
    )
    results = factory.List([factory.RelatedFactory(ResultFactory) for _ in range(10)])

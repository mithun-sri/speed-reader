import factory

from .. import models
from ..utils.crypt import get_password_hash


class UserFactory(factory.alchemy.SQLAlchemyModelFactory):
    class Meta:
        model = models.User

    class Params:
        raw_password = factory.Faker("password")

    username = factory.Faker("user_name")
    password = factory.LazyAttribute(lambda obj: get_password_hash(obj.raw_password))
    status = factory.Faker("random_element", elements=["active", "inactive"])

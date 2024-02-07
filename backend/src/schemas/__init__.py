# Re-export the schemas so that they can be distinguished from the models
# which likely to have SQLAlchemy/MongoEngine models with the same name.
# e.g.
# We can `import schemas` and access models by `schemas.User`
# rather than `from .schemas import User`.
from .game import *
from .text import *
from .token import *
from .user import *

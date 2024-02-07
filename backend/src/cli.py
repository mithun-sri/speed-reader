import glob
import random
import re
from typing import Annotated

import typer
from mongoengine import get_db
from rich import print
from rich.progress import track
from sqlalchemy.orm import Session

from .database import engine
from .factories.history import HistoryFactory
from .factories.question import QuestionFactory
from .factories.text import TextFactory
from .factories.user import UserFactory
from .logger import LOGGER_DIR
from .models import Base

app = typer.Typer()

db_app = typer.Typer()
app.add_typer(db_app, name="db")

log_app = typer.Typer()
app.add_typer(log_app, name="log")


@db_app.command("seed")
def seed(
    force: Annotated[bool, typer.Option(False, help="Skips confirmation")] = False,
):
    if not force:
        print("❗ [red]This command should not be run in production.")
        typer.confirm("Are you sure you want to continue?", abort=True)

    with Session(engine) as session:
        print("💣 Clearing PostgreSQL database...")
        for table in Base.metadata.sorted_tables:
            if table.name == "alembic_version":
                continue
            session.execute(table.delete())
            session.commit()

        print("💣 Clearing MongoDB database...")
        mongodb = get_db()
        for collection_name in mongodb.list_collection_names():
            mongodb[collection_name].delete_many({})

        print("🌱 Seeding users...")
        users = []
        for _ in track(range(10)):
            user = UserFactory.build()
            users.append(user)
            session.add(user)

        print("🌱 Seeding texts and questions...")
        texts = []
        for _ in track(range(10)):
            text = TextFactory.build()
            questions = QuestionFactory.build_batch(100, text=text)
            texts.append(text)
            session.add(text)
            session.add_all(questions)

        print("🌱 [green]Seeding histories...")
        for _ in track(range(100)):
            user = random.choice(users)
            text = random.choice(texts)
            questions = random.sample(text.questions, 10)
            history = HistoryFactory.build(
                user_id=user.id,
                text_id=text.id,
                question_ids=[question.id for question in questions],
                game_mode=text.game_mode,
            )
            history.save()

        session.commit()

    print("🌴 [green]Successfully seeded database.")


@log_app.command()
def grep(
    pattern: Annotated[str, typer.Argument(None, help="Pattern to search for")],
):
    for path in glob.glob(f"{LOGGER_DIR}/app*.log"):
        with open(path, encoding="utf8") as file:
            for i, line in enumerate(file):
                if re.search(pattern, line):
                    print(f"👀[blue] Found a match at line #{i + 1}")
                    print(line)

    print("🎉[green] Successfully searched the application logs.")


if __name__ == "__main__":
    app()

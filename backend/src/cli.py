import random
from typing import Annotated

import typer
from rich import print
from rich.progress import track
from sqlalchemy.orm import Session

from .database import engine
from .factories.history import HistoryFactory
from .factories.question import QuestionFactory
from .factories.text import TextFactory
from .factories.user import UserFactory
from .models import Base

app = typer.Typer()

db_app = typer.Typer()
app.add_typer(db_app, name="db")


@db_app.command("seed")
def seed(
    force: Annotated[
        bool,
        typer.Option(False, help="Skips confirmation if set"),
    ] = False,
):
    if not force:
        print("❗ [red]This command should not be run in production.")
        typer.confirm("Are you sure you want to continue?", abort=True)

    with Session(engine) as session:
        print("💣 Clearing database...")
        tables = Base.metadata.sorted_tables
        for table in reversed(tables):
            if table.name == "alembic_version":
                continue
            session.execute(table.delete())
            session.commit()

        print("🌱 Seeding users...")
        users = []
        for _ in track(range(10)):
            user = UserFactory.build()
            users.append(user)
            session.add(user)

        print("🌱 Seeding texts...")
        texts = []
        for _ in track(range(10)):
            text = TextFactory.build()
            texts.append(text)
            session.add(text)

        print("🌱 Seeding questions...")
        for _ in track(range(100)):
            text = random.choice(texts)
            question = QuestionFactory.build(text=text)
            session.add(question)

        session.commit()

    print("🌱 [green]Seeding histories...")
    for _ in track(range(100)):
        user = random.choice(users)
        text = random.choice(texts)
        questions = random.sample(text.questions, 10)
        history = HistoryFactory.build(
            user_id=user.id,
            text_id=text.id,
            question_ids=[question.id for question in questions],
            mode=text.mode,
            submode=random.choice(["word_by_word", "highlight", "peripheral"]),
        )
        history.save()

    print("🌴 [green]Successfully seeded database.")


if __name__ == "__main__":
    app()

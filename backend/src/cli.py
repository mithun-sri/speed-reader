import random
from typing import Annotated

import typer
from rich import print
from rich.progress import track
from sqlalchemy import MetaData
from sqlalchemy.orm import Session

from .database import engine
from .factories.question import QuestionFactory
from .factories.text import TextFactory

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
        meta = MetaData()
        meta.reflect(engine)
        for table in reversed(meta.sorted_tables):
            if table.name == "alembic_version":
                continue
            session.execute(table.delete())
            session.commit()

    with Session(engine) as session:
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

    print("🌴 [green]Successfully seeded database.")


if __name__ == "__main__":
    app()

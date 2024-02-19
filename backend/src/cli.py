import glob
import re
from typing import Annotated

import typer
from rich import print

from .config import config
from .database import reset_database, seed_database

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

    print("💣 Resetting database..")
    reset_database()

    print("🌱 Seeding database...")
    seed_database()

    print("🌴 [green]Successfully seeded database.")


@log_app.command()
def grep(
    pattern: Annotated[str, typer.Argument(None, help="Pattern to search for")],
):
    for path in glob.glob(f"{config.app_dir}/logs/app*.log"):
        with open(path, encoding="utf8") as file:
            for i, line in enumerate(file):
                if re.search(pattern, line):
                    print(f"👀[blue] Found a match at line #{i + 1}")
                    print(line)

    print("🎉[green] Successfully searched the application logs.")


if __name__ == "__main__":
    app()

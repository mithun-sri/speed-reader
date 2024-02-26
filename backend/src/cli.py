import glob
import re
from typing import Annotated

import typer
from rich import print
from sqlalchemy import select
from sqlalchemy.orm import Session

from . import models
from .config import config
from .database import engine, reset_database, seed_database

app = typer.Typer()

db_app = typer.Typer()
app.add_typer(db_app, name="db")

log_app = typer.Typer()
app.add_typer(log_app, name="log")


@db_app.command("seed")
def seed(
    force: Annotated[bool, typer.Option(..., help="Skips confirmation")] = False,
):
    if not force:
        print("❗ [red]This command should not be run in production.")
        typer.confirm("Are you sure you want to continue?", abort=True)

    print("💣 Resetting database..")
    reset_database()

    print("🌱 Seeding database...")
    seed_database()

    print("🌴 [green]Successfully seeded database.")


@db_app.command("get-role")
def get_role(
    username: Annotated[str, typer.Argument(..., help="Username to check")],
):
    print(f"👑 Getting {username}'s role...")

    with Session(engine) as session:
        query = select(models.User).where(models.User.username == username)
        user = session.scalars(query).one_or_none()
        if not user:
            print(f"❌ [red]{username} not found.")
            raise typer.Exit(code=1)

        print(f"🎉 [green]{username} is a/an {user.role}.")


@db_app.command("set-role")
def set_role(
    username: Annotated[str, typer.Argument(..., help="Username to make admin")],
    role: Annotated[str, typer.Argument(..., help="Role to assign")],
):
    print(f"👑 Setting {username} to be a/an {role}...")

    with Session(engine) as session:
        query = select(models.User).where(models.User.username == username)
        user = session.scalars(query).one_or_none()
        if not user:
            print(f"❌ [red]{username} not found.")
            raise typer.Exit(code=1)

        user.role = "admin"
        session.add(user)
        session.commit()

    print(f"🎉 [green]{username} is now a/an {role}.")


@log_app.command("grep")
def grep(
    pattern: Annotated[str, typer.Argument(..., help="Pattern to search for")],
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

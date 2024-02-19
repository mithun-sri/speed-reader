from os.path import abspath, dirname

from pydantic_settings import BaseSettings


class Config(BaseSettings):
    app_dir: str = dirname(dirname(abspath(__file__)))


config = Config()

FROM python:3.12

WORKDIR /app

COPY poetry.lock pyproject.toml ./
RUN pip install poetry==1.6.1 && \
    poetry config virtualenvs.create false && \
    poetry install --no-root --no-dev

COPY --chown=app:app . .
# Install root and dev dependencies to setup CLI.
RUN poetry install

RUN groupadd app && \
    useradd -m -d /app -g app app
RUN chown -R app:app /app && chmod -R 755 /app

USER app
EXPOSE 8000

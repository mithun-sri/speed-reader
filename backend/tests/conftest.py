from os import remove

from tests.test_backend import TEST_DATABASE_FILENAME, engine


def pytest_sessionfinish(session, exitstatus):
    _ = session, exitstatus
    try:
        engine.dispose()
        remove(TEST_DATABASE_FILENAME)
    except Exception:
        pass

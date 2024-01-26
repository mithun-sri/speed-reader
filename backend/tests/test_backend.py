from src import __version__
from fastapi.testclient import TestClient
from src.main import app

test_client = TestClient(app)

def test_version():
    assert __version__ == '0.1.0'

def test_texts():
    response = test_client.get("/texts")
    assert response.status_code == 200
    assert "text" in response.json().keys()
    assert isinstance(response.json()["text"], str)

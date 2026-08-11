import os

os.environ['DATABASE_URL'] = 'sqlite:///./test_skymind.db'

import pytest
from fastapi.testclient import TestClient


@pytest.fixture(scope='session')
def client():
    db_path = 'test_skymind.db'
    if os.path.exists(db_path):
        os.remove(db_path)
    from main import app
    with TestClient(app) as c:
        yield c
    if os.path.exists(db_path):
        os.remove(db_path)


@pytest.fixture
def auth_headers(client):
    email = 'pytest_user@example.com'
    client.post('/api/auth/register', json={'name': 'Pytest User', 'email': email, 'password': 'Passw0rd123'})
    res = client.post('/api/auth/login', data={'username': email, 'password': 'Passw0rd123'})
    token = res.json()['access_token']
    return {'Authorization': f'Bearer {token}'}

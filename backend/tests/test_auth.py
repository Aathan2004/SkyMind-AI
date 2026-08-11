def test_register_and_login(client):
    res = client.post('/api/auth/register', json={
        'name': 'Auth Test', 'email': 'authtest@example.com', 'password': 'Passw0rd123'})
    assert res.status_code == 201

    res = client.post('/api/auth/login', data={'username': 'authtest@example.com', 'password': 'Passw0rd123'})
    assert res.status_code == 200
    body = res.json()
    assert 'access_token' in body and 'refresh_token' in body

def test_login_wrong_password(client):
    client.post('/api/auth/register', json={
        'name': 'Wrong Pass', 'email': 'wrongpass@example.com', 'password': 'Passw0rd123'})
    res = client.post('/api/auth/login', data={'username': 'wrongpass@example.com', 'password': 'nope12345X'})
    assert res.status_code == 401

def test_register_duplicate_email(client):
    payload = {'name': 'Dup', 'email': 'dup@example.com', 'password': 'Passw0rd123'}
    client.post('/api/auth/register', json=payload)
    res = client.post('/api/auth/register', json=payload)
    assert res.status_code == 400

def test_protected_route_without_token(client):
    res = client.get('/api/predictions/meta')
    assert res.status_code == 401

def test_me_requires_valid_token(client, auth_headers):
    res = client.get('/api/auth/me', headers=auth_headers)
    assert res.status_code == 200
    assert res.json()['email'] == 'pytest_user@example.com'

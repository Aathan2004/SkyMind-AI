def test_search_airlines_finds_emirates(client, auth_headers):
    res = client.get('/api/airlines/search?q=Emirates', headers=auth_headers)
    assert res.status_code == 200
    iatas = [a['iata'] for a in res.json()]
    assert 'EK' in iatas

def test_get_airline_detail(client, auth_headers):
    res = client.get('/api/airlines/EK', headers=auth_headers)
    assert res.status_code == 200
    assert res.json()['name'] == 'Emirates'

def test_unknown_airline_404(client, auth_headers):
    res = client.get('/api/airlines/Q1', headers=auth_headers)
    assert res.status_code == 404

def test_airline_fleet_derived_from_routes(client, auth_headers):
    res = client.get('/api/airlines/EK/fleet', headers=auth_headers)
    assert res.status_code == 200
    fleet = res.json()['fleet']
    assert len(fleet) > 0
    assert all('aircraft' in row and 'route_count' in row for row in fleet)

def test_airline_hub(client, auth_headers):
    res = client.get('/api/airlines/EK/hub', headers=auth_headers)
    assert res.status_code == 200
    assert res.json()['hub']['iata'] == 'DXB'

def test_airline_routes(client, auth_headers):
    res = client.get('/api/airlines/EK/routes?limit=5', headers=auth_headers)
    assert res.status_code == 200
    routes = res.json()['routes']
    assert 0 < len(routes) <= 5

def test_airlines_require_auth(client):
    res = client.get('/api/airlines/EK')
    assert res.status_code == 401

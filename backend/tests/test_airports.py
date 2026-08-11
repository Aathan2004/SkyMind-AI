from unittest.mock import patch, MagicMock

def _mock_response(payload):
    mock = MagicMock()
    mock.raise_for_status = MagicMock()
    mock.json.return_value = payload
    return mock

def test_search_airports_finds_dubai(client, auth_headers):
    res = client.get('/api/airports/search?q=Dubai', headers=auth_headers)
    assert res.status_code == 200
    iatas = [a['iata'] for a in res.json()]
    assert 'DXB' in iatas

def test_get_airport_detail(client, auth_headers):
    res = client.get('/api/airports/DXB', headers=auth_headers)
    assert res.status_code == 200
    assert res.json()['name'] == 'Dubai International Airport'

def test_get_unknown_airport_404(client, auth_headers):
    res = client.get('/api/airports/ZZZ', headers=auth_headers)
    assert res.status_code == 404

def test_airports_require_auth(client):
    res = client.get('/api/airports/search?q=Dubai')
    assert res.status_code == 401

def test_airport_weather(client, auth_headers):
    payload = {'current_weather': {
        'temperature': 34.0, 'windspeed': 12.5, 'winddirection': 220,
        'weathercode': 0, 'is_day': 1, 'time': '2026-01-01T12:00',
    }}
    with patch('services.weather_service.requests.get', return_value=_mock_response(payload)):
        res = client.get('/api/airports/DXB/weather', headers=auth_headers)
    assert res.status_code == 200
    body = res.json()
    assert body['temperature_c'] == 34.0
    assert body['condition'] == 'Clear sky'

def test_airport_weather_upstream_failure_returns_502(client, auth_headers):
    import requests
    with patch('services.weather_service.requests.get', side_effect=requests.RequestException('timeout')):
        res = client.get('/api/airports/DXB/weather', headers=auth_headers)
    assert res.status_code == 502

def test_airport_traffic(client, auth_headers):
    states = {'states': [
        ['abc123', 'UAE100  ', 'United Arab Emirates', 0, 0, 55.37, 25.25, 500, False, 80, 90, -3, None, 500, '1000', False, 0, 3],
        ['def456', 'FDB200  ', 'United Arab Emirates', 0, 0, 55.38, 25.26, 0, True, 0, 0, 0, None, 0, '1000', False, 0, 3],
    ]}
    with patch('services.opensky_service.requests.get', return_value=_mock_response(states)):
        res = client.get('/api/airports/DXB/traffic', headers=auth_headers)
    assert res.status_code == 200
    body = res.json()
    assert len(body['arrivals']) == 1 and body['arrivals'][0]['callsign'] == 'UAE100'
    assert len(body['on_ground']) == 1

from unittest.mock import patch, MagicMock

def _mock_response(payload):
    mock = MagicMock()
    mock.raise_for_status = MagicMock()
    mock.json.return_value = payload
    return mock

SAMPLE_STATES = {'states': [
    ['abc123', 'UAE100  ', 'United Arab Emirates', 0, 0, 55.37, 25.25, 500, False, 80, 90, -3, None, 500, '1000', False, 0, 3],
]}

def test_live_flights_success(client, auth_headers):
    with patch('services.opensky_service.requests.get', return_value=_mock_response(SAMPLE_STATES)):
        res = client.get('/api/live/flights', headers=auth_headers)
    assert res.status_code == 200
    body = res.json()
    assert body['count'] == 1
    assert body['flights'][0]['callsign'] == 'UAE100'

def test_live_flights_upstream_error_returns_502(client, auth_headers):
    import requests
    with patch('services.opensky_service.requests.get', side_effect=requests.RequestException('boom')):
        res = client.get('/api/live/flights', headers=auth_headers)
    assert res.status_code == 502

def test_search_live_flights(client, auth_headers):
    with patch('services.opensky_service.requests.get', return_value=_mock_response(SAMPLE_STATES)):
        res = client.get('/api/live/flights/search?q=UAE', headers=auth_headers)
    assert res.status_code == 200
    assert len(res.json()['flights']) == 1

def test_live_flight_detail_not_found(client, auth_headers):
    with patch('services.opensky_service.requests.get', return_value=_mock_response(SAMPLE_STATES)):
        res = client.get('/api/live/flights/doesnotexist', headers=auth_headers)
    assert res.status_code == 404

def test_delay_estimate_uses_real_model(client, auth_headers):
    # opensky_service and weather_service both `import requests`, sharing one module object,
    # so both must be served by a single dispatching mock rather than two separate patches.
    weather_payload = {'current_weather': {
        'temperature': 30.0, 'windspeed': 10.0, 'winddirection': 90,
        'weathercode': 0, 'is_day': 1, 'time': '2026-01-01T12:00',
    }}
    def dispatch(url, *args, **kwargs):
        return _mock_response(weather_payload if 'open-meteo' in url else SAMPLE_STATES)

    with patch('requests.get', side_effect=dispatch):
        res = client.get('/api/live/flights/abc123/delay-estimate', headers=auth_headers)
    assert res.status_code == 200
    body = res.json()
    assert isinstance(body['predicted_delay_minutes'], float)
    assert body['inputs_used']['origin'] == 'DXB'

def test_live_flights_require_auth(client):
    res = client.get('/api/live/flights')
    assert res.status_code == 401

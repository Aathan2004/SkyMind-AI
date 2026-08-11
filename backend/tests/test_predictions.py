def test_predict_delay(client, auth_headers):
    res = client.post('/api/predictions/delay', json={}, headers=auth_headers)
    assert res.status_code == 200
    body = res.json()
    assert isinstance(body['prediction'], float)
    assert body['unit'] == 'minutes'
    assert 'confidence' in body and 'meta' in body

def test_predict_price(client, auth_headers):
    res = client.post('/api/predictions/price', json={}, headers=auth_headers)
    assert res.status_code == 200
    body = res.json()
    assert isinstance(body['prediction'], float)
    assert body['unit'] == 'USD'
    assert 'feature_importance' in body['meta']

def test_predict_satisfaction(client, auth_headers):
    res = client.post('/api/predictions/satisfaction', json={}, headers=auth_headers)
    assert res.status_code == 200
    body = res.json()
    assert 'prediction' in body and 'probabilities' in body

def test_predict_no_show(client, auth_headers):
    res = client.post('/api/predictions/no-show', json={}, headers=auth_headers)
    assert res.status_code == 200
    assert res.json()['prediction'] in ('No-Show', 'Will Board')

def test_predictions_require_auth(client):
    res = client.post('/api/predictions/delay', json={})
    assert res.status_code == 401

def test_prediction_history_recorded(client, auth_headers):
    client.post('/api/predictions/delay', json={}, headers=auth_headers)
    res = client.get('/api/predictions/history?limit=5', headers=auth_headers)
    assert res.status_code == 200
    assert any(row['model'] == 'delay' for row in res.json())

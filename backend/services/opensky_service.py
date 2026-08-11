import math
import requests

BASE = "https://opensky-network.org/api"
TIMEOUT = 8
KM_PER_DEGREE_LAT = 111.0

CATEGORY_LABELS = {
    0: 'Unknown', 1: 'No ADS-B', 2: 'Light', 3: 'Small', 4: 'Large',
    5: 'High Vortex Large', 6: 'Heavy', 7: 'High Performance', 8: 'Rotorcraft',
}

STATE_FIELDS = [
    'icao24', 'callsign', 'origin_country', 'time_position', 'last_contact',
    'longitude', 'latitude', 'baro_altitude', 'on_ground', 'velocity',
    'true_track', 'vertical_rate', 'sensors', 'geo_altitude', 'squawk',
    'spi', 'position_source', 'category',
]

def _state_to_dict(row: list) -> dict:
    d = dict(zip(STATE_FIELDS, row))
    return {
        'icao24': d.get('icao24'),
        'callsign': (d.get('callsign') or '').strip() or None,
        'origin_country': d.get('origin_country'),
        'lat': d.get('latitude'),
        'lon': d.get('longitude'),
        'altitude_m': d.get('baro_altitude'),
        'velocity_ms': d.get('velocity'),
        'heading': d.get('true_track'),
        'vertical_rate_ms': d.get('vertical_rate'),
        'on_ground': d.get('on_ground'),
        'category': CATEGORY_LABELS.get(d.get('category'), 'Unknown'),
    }

def _haversine_km(lat1, lon1, lat2, lon2) -> float:
    r = 6371.0
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dp, dl = math.radians(lat2 - lat1), math.radians(lon2 - lon1)
    a = math.sin(dp / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    return 2 * r * math.asin(math.sqrt(a))

def get_live_states(bbox: dict | None = None) -> dict:
    """Returns {'states': [...], 'error': None} or {'states': [], 'error': '...'} — never raises."""
    params = {}
    if bbox:
        params = {'lamin': bbox['lamin'], 'lomin': bbox['lomin'], 'lamax': bbox['lamax'], 'lomax': bbox['lomax']}
    try:
        res = requests.get(f"{BASE}/states/all", params=params, timeout=TIMEOUT)
        res.raise_for_status()
        rows = res.json().get('states') or []
        states = [_state_to_dict(r) for r in rows if r[5] is not None and r[6] is not None]
        return {'states': states, 'error': None}
    except requests.RequestException as e:
        return {'states': [], 'error': f'OpenSky live data unavailable: {e}'}

def search_by_callsign(query: str, limit: int = 25) -> dict:
    result = get_live_states()
    if result['error']:
        return result
    q = query.strip().upper()
    matched = [s for s in result['states'] if s['callsign'] and q in s['callsign']]
    return {'states': matched[:limit], 'error': None}

def get_by_icao24(icao24: str) -> dict:
    result = get_live_states()
    if result['error']:
        return result
    match = next((s for s in result['states'] if s['icao24'] == icao24.lower()), None)
    return {'state': match, 'error': None}

def get_nearby_traffic(lat: float, lon: float, radius_km: float = 100) -> dict:
    """Real live aircraft near an airport, classified by vertical rate into arriving/departing/on-ground.

    OpenSky's /flights/arrival and /flights/departure history endpoints require an
    authenticated account, so anonymous access is limited to /states/all — this derives
    an arrivals/departures view from real live positions instead of fabricating a schedule.
    """
    deg_lat = radius_km / KM_PER_DEGREE_LAT
    deg_lon = radius_km / (KM_PER_DEGREE_LAT * max(0.1, math.cos(math.radians(lat))))
    bbox = {'lamin': lat - deg_lat, 'lamax': lat + deg_lat, 'lomin': lon - deg_lon, 'lomax': lon + deg_lon}
    result = get_live_states(bbox)
    if result['error']:
        return {'arrivals': [], 'departures': [], 'on_ground': [], 'error': result['error']}

    nearby = []
    for s in result['states']:
        dist = _haversine_km(lat, lon, s['lat'], s['lon'])
        if dist <= radius_km:
            nearby.append({**s, 'distance_km': round(dist, 1)})

    arrivals, departures, on_ground = [], [], []
    for s in nearby:
        if s['on_ground']:
            on_ground.append(s)
        elif (s['vertical_rate_ms'] or 0) < -1:
            arrivals.append(s)
        elif (s['vertical_rate_ms'] or 0) > 1:
            departures.append(s)
    arrivals.sort(key=lambda s: s['distance_km'])
    departures.sort(key=lambda s: s['distance_km'])
    on_ground.sort(key=lambda s: s['distance_km'])
    return {'arrivals': arrivals[:20], 'departures': departures[:20], 'on_ground': on_ground[:20], 'error': None}

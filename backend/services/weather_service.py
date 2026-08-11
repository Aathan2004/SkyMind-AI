import requests

BASE = "https://api.open-meteo.com/v1/forecast"
TIMEOUT = 8

WEATHER_CODES = {
    0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
    45: 'Fog', 48: 'Depositing rime fog',
    51: 'Light drizzle', 53: 'Moderate drizzle', 55: 'Dense drizzle',
    61: 'Slight rain', 63: 'Moderate rain', 65: 'Heavy rain',
    71: 'Slight snow', 73: 'Moderate snow', 75: 'Heavy snow',
    80: 'Slight rain showers', 81: 'Moderate rain showers', 82: 'Violent rain showers',
    95: 'Thunderstorm', 96: 'Thunderstorm with hail', 99: 'Thunderstorm with heavy hail',
}

def get_current_weather(lat: float, lon: float) -> dict:
    """Returns real current weather for a coordinate via Open-Meteo, or an error — never raises."""
    try:
        res = requests.get(BASE, params={
            'latitude': lat, 'longitude': lon, 'current_weather': 'true',
            'windspeed_unit': 'kmh',
        }, timeout=TIMEOUT)
        res.raise_for_status()
        cw = res.json().get('current_weather')
        if not cw:
            return {'weather': None, 'error': 'No weather data returned'}
        return {
            'weather': {
                'temperature_c': cw.get('temperature'),
                'windspeed_kmh': cw.get('windspeed'),
                'wind_direction_deg': cw.get('winddirection'),
                'condition': WEATHER_CODES.get(cw.get('weathercode'), 'Unknown'),
                'is_day': bool(cw.get('is_day')),
                'observed_at': cw.get('time'),
            },
            'error': None,
        }
    except requests.RequestException as e:
        return {'weather': None, 'error': f'Weather data unavailable: {e}'}

from datetime import datetime, timezone
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from auth.dependencies import get_current_user
from database.session import get_db
from models.airport import Airport
from services import opensky_service, weather_service
from routers.predictions import _infer_reg
import math

router = APIRouter(prefix="/api/live", tags=["Live Flights"])

def _nearest_airport(db: Session, lat: float, lon: float) -> Airport | None:
    airports = db.query(Airport).all()
    if not airports:
        return None
    def dist(a: Airport) -> float:
        r = 6371.0
        p1, p2 = math.radians(lat), math.radians(a.lat)
        dp, dl = math.radians(a.lat - lat), math.radians(a.lon - lon)
        h = math.sin(dp / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
        return 2 * r * math.asin(math.sqrt(h))
    return min(airports, key=dist)

@router.get("/flights")
def live_flights(lamin: Optional[float] = None, lomin: Optional[float] = None,
                  lamax: Optional[float] = None, lomax: Optional[float] = None,
                  _=Depends(get_current_user)):
    bbox = None
    if None not in (lamin, lomin, lamax, lomax):
        bbox = {'lamin': lamin, 'lomin': lomin, 'lamax': lamax, 'lomax': lomax}
    result = opensky_service.get_live_states(bbox)
    if result['error']:
        raise HTTPException(status_code=502, detail=result['error'])
    return {'flights': result['states'], 'count': len(result['states'])}

@router.get("/flights/search")
def search_live_flights(q: str, _=Depends(get_current_user)):
    result = opensky_service.search_by_callsign(q)
    if result['error']:
        raise HTTPException(status_code=502, detail=result['error'])
    return {'flights': result['states']}

@router.get("/flights/{icao24}")
def live_flight_detail(icao24: str, _=Depends(get_current_user)):
    result = opensky_service.get_by_icao24(icao24)
    if result['error']:
        raise HTTPException(status_code=502, detail=result['error'])
    if not result['state']:
        raise HTTPException(status_code=404, detail='Aircraft not currently transmitting live position data')
    return result['state']

@router.get("/flights/{icao24}/delay-estimate")
def live_flight_delay_estimate(icao24: str, db: Session = Depends(get_db), _=Depends(get_current_user)):
    state = opensky_service.get_by_icao24(icao24)
    if state['error']:
        raise HTTPException(status_code=502, detail=state['error'])
    if not state['state']:
        raise HTTPException(status_code=404, detail='Aircraft not currently transmitting live position data')

    s = state['state']
    nearest = _nearest_airport(db, s['lat'], s['lon'])
    now = datetime.now(timezone.utc)

    weather_score = 0.3
    weather_note = 'default (no nearby airport found)'
    if nearest:
        weather = weather_service.get_current_weather(nearest.lat, nearest.lon)
        if not weather['error']:
            w = weather['weather']
            weather_score = min(1.0, (w['windspeed_kmh'] or 0) / 80 + (0 if w['condition'] == 'Clear sky' else 0.25))
            weather_note = f"derived from live weather at {nearest.iata}: {w['condition']}, wind {w['windspeed_kmh']} km/h"

    inputs = {
        'departure_hour': now.hour, 'day_of_week': now.isoweekday(), 'month': now.month,
        'origin': nearest.iata if nearest else 'DXB', 'destination': 'LHR',
        'aircraft_type': s['category'], 'airline': s['callsign'] or 'Unknown',
        'weather_score': round(weather_score, 2), 'atc_delay': 5, 'prev_flight_delay': 10, 'distance_km': 5500,
    }
    predicted_minutes = round(float(_infer_reg('delay', inputs)), 1)
    return {
        'icao24': icao24, 'callsign': s['callsign'],
        'predicted_delay_minutes': predicted_minutes,
        'inputs_used': inputs,
        'notes': {
            'weather_score': weather_note,
            'destination': 'unknown from live ADS-B data — default used; only origin, time and weather are live-derived',
        },
    }

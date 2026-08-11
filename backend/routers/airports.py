from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import or_
from sqlalchemy.orm import Session
from auth.dependencies import get_current_user
from database.session import get_db
from models.airport import Airport
from services import opensky_service, weather_service

router = APIRouter(prefix="/api/airports", tags=["Airports"])

def _serialize(a: Airport) -> dict:
    return {
        'iata': a.iata, 'icao': a.icao, 'name': a.name, 'city': a.city,
        'country': a.country, 'lat': a.lat, 'lon': a.lon,
        'elevation_ft': a.elevation_ft, 'type': a.type,
    }

def _get_or_404(iata: str, db: Session) -> Airport:
    airport = db.query(Airport).filter(Airport.iata == iata.upper()).first()
    if not airport:
        raise HTTPException(status_code=404, detail=f'Airport {iata} not found')
    return airport

@router.get("/search")
def search_airports(q: str = "", limit: int = 20, db: Session = Depends(get_db), _=Depends(get_current_user)):
    query = db.query(Airport)
    if q:
        like = f"%{q}%"
        query = query.filter(or_(
            Airport.iata.ilike(like), Airport.icao.ilike(like), Airport.name.ilike(like),
            Airport.city.ilike(like), Airport.country.ilike(like),
        ))
    return [_serialize(a) for a in query.order_by(Airport.name).limit(min(limit, 100)).all()]

@router.get("/{iata}")
def get_airport(iata: str, db: Session = Depends(get_db), _=Depends(get_current_user)):
    return _serialize(_get_or_404(iata, db))

@router.get("/{iata}/weather")
def airport_weather(iata: str, db: Session = Depends(get_db), _=Depends(get_current_user)):
    airport = _get_or_404(iata, db)
    result = weather_service.get_current_weather(airport.lat, airport.lon)
    if result['error']:
        raise HTTPException(status_code=502, detail=result['error'])
    return {'airport': airport.iata, **result['weather']}

@router.get("/{iata}/traffic")
def airport_traffic(iata: str, db: Session = Depends(get_db), _=Depends(get_current_user)):
    airport = _get_or_404(iata, db)
    result = opensky_service.get_nearby_traffic(airport.lat, airport.lon)
    if result['error']:
        raise HTTPException(status_code=502, detail=result['error'])
    return {'airport': airport.iata, 'arrivals': result['arrivals'],
            'departures': result['departures'], 'on_ground': result['on_ground']}

from collections import Counter
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, or_
from sqlalchemy.orm import Session
from auth.dependencies import get_current_user
from database.session import get_db
from models.airline import Airline
from models.airport import Airport
from models.route import Route
from data.loader import aircraft_name

router = APIRouter(prefix="/api/airlines", tags=["Airlines"])

def _serialize(a: Airline) -> dict:
    return {'iata': a.iata, 'icao': a.icao, 'name': a.name, 'country': a.country, 'callsign': a.callsign}

def _get_or_404(iata: str, db: Session) -> Airline:
    airline = db.query(Airline).filter(Airline.iata == iata.upper()).first()
    if not airline:
        raise HTTPException(status_code=404, detail=f'Airline {iata} not found')
    return airline

def _airport_label(db: Session, iata: str) -> str:
    airport = db.query(Airport).filter(Airport.iata == iata).first()
    return f"{airport.name} ({iata})" if airport else iata

@router.get("/search")
def search_airlines(q: str = "", limit: int = 20, db: Session = Depends(get_db), _=Depends(get_current_user)):
    query = db.query(Airline)
    if q:
        like = f"%{q}%"
        query = query.filter(or_(Airline.iata.ilike(like), Airline.icao.ilike(like),
                                  Airline.name.ilike(like), Airline.country.ilike(like)))
    return [_serialize(a) for a in query.order_by(Airline.name).limit(min(limit, 100)).all()]

@router.get("/{iata}")
def get_airline(iata: str, db: Session = Depends(get_db), _=Depends(get_current_user)):
    return _serialize(_get_or_404(iata, db))

@router.get("/{iata}/fleet")
def airline_fleet(iata: str, db: Session = Depends(get_db), _=Depends(get_current_user)):
    airline = _get_or_404(iata, db)
    routes = db.query(Route.equipment).filter(Route.airline == airline.iata).all()
    counter = Counter()
    for (equipment,) in routes:
        for code in (equipment or '').split():
            counter[code] += 1
    fleet = [{'code': code, 'aircraft': aircraft_name(code), 'route_count': count}
              for code, count in counter.most_common(15)]
    return {'airline': airline.iata, 'fleet': fleet}

@router.get("/{iata}/routes")
def airline_routes(iata: str, limit: int = 50, db: Session = Depends(get_db), _=Depends(get_current_user)):
    airline = _get_or_404(iata, db)
    routes = db.query(Route).filter(Route.airline == airline.iata).limit(min(limit, 200)).all()
    return {'airline': airline.iata, 'routes': [{
        'source': r.source, 'source_name': _airport_label(db, r.source),
        'dest': r.dest, 'dest_name': _airport_label(db, r.dest),
        'aircraft': aircraft_name((r.equipment or '').split()[0]) if r.equipment else None,
    } for r in routes]}

@router.get("/{iata}/hub")
def airline_hub(iata: str, db: Session = Depends(get_db), _=Depends(get_current_user)):
    airline = _get_or_404(iata, db)
    top = (db.query(Route.source, func.count(Route.id).label('cnt'))
             .filter(Route.airline == airline.iata)
             .group_by(Route.source).order_by(func.count(Route.id).desc()).first())
    if not top:
        return {'airline': airline.iata, 'hub': None}
    airport = db.query(Airport).filter(Airport.iata == top[0]).first()
    return {'airline': airline.iata, 'hub': {
        'iata': top[0], 'outbound_routes': top[1],
        'name': airport.name if airport else None,
        'city': airport.city if airport else None,
        'country': airport.country if airport else None,
    }}

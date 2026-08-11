from sqlalchemy.orm import Session
from models.flight import Flight
from fastapi import HTTPException

def get_all_flights(db: Session):
    return db.query(Flight).all()

def get_flight_by_id(db: Session, flight_id: int):
    flight = db.query(Flight).filter(Flight.id == flight_id).first()
    if not flight:
        raise HTTPException(status_code=404, detail="Flight not found")
    return flight

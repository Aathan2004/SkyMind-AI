from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database.session import get_db
from services.flight_service import get_all_flights, get_flight_by_id
from auth.dependencies import get_current_user

router = APIRouter(prefix="/api/flights", tags=["Flights"])

@router.get("/")
def list_flights(db: Session = Depends(get_db), _=Depends(get_current_user)):
    return get_all_flights(db)

@router.get("/{flight_id}")
def get_flight(flight_id: int, db: Session = Depends(get_db), _=Depends(get_current_user)):
    return get_flight_by_id(db, flight_id)

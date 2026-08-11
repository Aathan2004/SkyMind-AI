import secrets
from typing import Literal, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from auth.dependencies import get_current_user
from database.session import get_db
from models.flight import Flight
from models.passenger_booking import PassengerBooking
from models.user import User

router = APIRouter(prefix="/api/passenger", tags=["Passenger Experience"])


class FlightSearch(BaseModel):
    origin: Optional[str] = Field(default=None, max_length=3)
    destination: Optional[str] = Field(default=None, max_length=3)
    cabin_class: Optional[str] = None
    max_price: Optional[float] = Field(default=None, gt=0)


class BookingCreate(BaseModel):
    flight_id: int
    passenger_name: str = Field(min_length=2, max_length=100)
    passport_number: Optional[str] = Field(default=None, max_length=30)
    nationality: Optional[str] = Field(default=None, max_length=80)
    date_of_birth: Optional[str] = Field(default=None, max_length=10)
    cabin_class: Literal["Economy", "Premium Economy", "Business", "First"] = "Economy"
    seat_number: Optional[str] = Field(default=None, max_length=5)
    meal_preference: Optional[str] = Field(default=None, max_length=60)
    special_assistance: Optional[str] = Field(default=None, max_length=200)
    extra_baggage_kg: int = Field(default=0, ge=0, le=60)


class PaymentRequest(BaseModel):
    method: Literal["card", "upi", "net_banking", "wallet"]
    succeed: bool = True


def serialize_flight(flight: Flight) -> dict:
    return {
        "id": flight.id, "flight_number": flight.flight_number, "origin": flight.origin,
        "destination": flight.destination, "departure_time": flight.departure_time,
        "arrival_time": flight.arrival_time, "price": flight.price, "status": flight.status,
        "aircraft": "Boeing 787-9", "stops": 0, "available_seats": 18,
        "terminal": "T3", "gate": "B14",
    }


def serialize_booking(booking: PassengerBooking, flight: Flight | None) -> dict:
    return {
        "id": booking.id, "booking_reference": booking.booking_reference,
        "passenger_name": booking.passenger_name, "cabin_class": booking.cabin_class,
        "seat_number": booking.seat_number, "meal_preference": booking.meal_preference,
        "extra_baggage_kg": booking.extra_baggage_kg, "payment_status": booking.payment_status,
        "booking_status": booking.booking_status, "total_amount": booking.total_amount,
        "created_at": booking.created_at, "flight": serialize_flight(flight) if flight else None,
    }


@router.get("/flights")
def search_flights(query: FlightSearch = Depends(), db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    flights = db.query(Flight)
    if query.origin:
        flights = flights.filter(Flight.origin == query.origin.strip().upper())
    if query.destination:
        flights = flights.filter(Flight.destination == query.destination.strip().upper())
    if query.max_price:
        flights = flights.filter(Flight.price <= query.max_price)
    return [serialize_flight(flight) for flight in flights.order_by(Flight.price.asc()).all()]


@router.get("/dashboard")
def passenger_dashboard(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    bookings = db.query(PassengerBooking).filter(PassengerBooking.user_email == user.email).order_by(PassengerBooking.created_at.desc()).limit(6).all()
    flights = {flight.id: flight for flight in db.query(Flight).filter(Flight.id.in_([booking.flight_id for booking in bookings] or [-1])).all()}
    return {
        "bookings": [serialize_booking(booking, flights.get(booking.flight_id)) for booking in bookings],
        "loyalty_points": len(bookings) * 1250,
        "notifications": [
            {"id": "gate", "title": "Gate updates in one place", "message": "Enable notifications to receive real-time boarding changes.", "type": "info"},
            {"id": "weather", "title": "Destination weather", "message": "Weather insights are ready with your itinerary.", "type": "success"},
        ],
    }


@router.get("/bookings")
def list_bookings(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    bookings = db.query(PassengerBooking).filter(PassengerBooking.user_email == user.email).order_by(PassengerBooking.created_at.desc()).all()
    flights = {flight.id: flight for flight in db.query(Flight).filter(Flight.id.in_([booking.flight_id for booking in bookings] or [-1])).all()}
    return [serialize_booking(booking, flights.get(booking.flight_id)) for booking in bookings]


@router.post("/bookings", status_code=status.HTTP_201_CREATED)
def create_booking(payload: BookingCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    flight = db.query(Flight).filter(Flight.id == payload.flight_id).first()
    if not flight:
        raise HTTPException(status_code=404, detail="Flight not found")
    cabin_multiplier = {"Economy": 1, "Premium Economy": 1.35, "Business": 2.2, "First": 3.5}[payload.cabin_class]
    total = round(flight.price * cabin_multiplier + payload.extra_baggage_kg * 12 + flight.price * .08, 2)
    booking = PassengerBooking(
        booking_reference=f"SKY{secrets.token_hex(3).upper()}", user_email=user.email, flight_id=flight.id,
        total_amount=total, **payload.model_dump(exclude={"flight_id"}),
    )
    db.add(booking)
    db.commit()
    db.refresh(booking)
    return serialize_booking(booking, flight)


@router.post("/bookings/{booking_id}/payment")
def pay_for_booking(booking_id: int, payload: PaymentRequest, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    booking = db.query(PassengerBooking).filter(PassengerBooking.id == booking_id, PassengerBooking.user_email == user.email).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    booking.payment_method = payload.method
    booking.payment_status = "paid" if payload.succeed else "failed"
    booking.booking_status = "confirmed" if payload.succeed else "payment_failed"
    db.commit()
    db.refresh(booking)
    flight = db.query(Flight).filter(Flight.id == booking.flight_id).first()
    return serialize_booking(booking, flight)


@router.post("/bookings/{booking_id}/cancel")
def cancel_booking(booking_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    booking = db.query(PassengerBooking).filter(PassengerBooking.id == booking_id, PassengerBooking.user_email == user.email).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    if booking.booking_status == "cancelled":
        raise HTTPException(status_code=409, detail="Booking is already cancelled")
    booking.booking_status = "cancelled"
    db.commit()
    return {"message": "Booking cancelled", "booking_id": booking.id}

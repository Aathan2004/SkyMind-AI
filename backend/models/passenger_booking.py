from datetime import datetime
from sqlalchemy import Column, DateTime, Float, Integer, String, Text
from sqlalchemy.sql import func
from database.base import Base


class PassengerBooking(Base):
    __tablename__ = "passenger_bookings"

    id = Column(Integer, primary_key=True, index=True)
    booking_reference = Column(String(12), unique=True, index=True, nullable=False)
    user_email = Column(String, index=True, nullable=False)
    flight_id = Column(Integer, index=True, nullable=False)
    passenger_name = Column(String, nullable=False)
    passport_number = Column(String, nullable=True)
    nationality = Column(String, nullable=True)
    date_of_birth = Column(String, nullable=True)
    cabin_class = Column(String, nullable=False, default="Economy")
    seat_number = Column(String, nullable=True)
    meal_preference = Column(String, nullable=True)
    special_assistance = Column(String, nullable=True)
    extra_baggage_kg = Column(Integer, nullable=False, default=0)
    payment_method = Column(String, nullable=True)
    payment_status = Column(String, nullable=False, default="pending")
    booking_status = Column(String, nullable=False, default="confirmed")
    total_amount = Column(Float, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

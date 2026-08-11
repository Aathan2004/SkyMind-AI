from sqlalchemy import Column, Integer, String
from database.base import Base

class Airline(Base):
    __tablename__ = "airlines"

    id = Column(Integer, primary_key=True, index=True)
    iata = Column(String(2), unique=True, index=True, nullable=False)
    icao = Column(String(3), nullable=True)
    name = Column(String, nullable=False)
    country = Column(String, nullable=True)
    callsign = Column(String, nullable=True)

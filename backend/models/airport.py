from sqlalchemy import Column, Integer, String, Float
from database.base import Base

class Airport(Base):
    __tablename__ = "airports"

    id = Column(Integer, primary_key=True, index=True)
    iata = Column(String(3), unique=True, index=True, nullable=False)
    icao = Column(String(4), nullable=True)
    name = Column(String, nullable=False)
    city = Column(String, nullable=True)
    country = Column(String, nullable=False, index=True)
    lat = Column(Float, nullable=False)
    lon = Column(Float, nullable=False)
    elevation_ft = Column(Float, nullable=True)
    type = Column(String, nullable=False)

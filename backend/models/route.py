from sqlalchemy import Column, Integer, String
from database.base import Base

class Route(Base):
    __tablename__ = "routes"

    id = Column(Integer, primary_key=True, index=True)
    airline = Column(String(2), index=True, nullable=False)
    source = Column(String(3), index=True, nullable=False)
    dest = Column(String(3), index=True, nullable=False)
    equipment = Column(String, nullable=True)

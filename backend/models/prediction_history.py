from sqlalchemy import Column, Integer, String, Float, DateTime, Text
from sqlalchemy.sql import func
from database.base import Base

class PredictionHistory(Base):
    __tablename__ = "prediction_history"

    id          = Column(Integer, primary_key=True, index=True)
    model_name  = Column(String, nullable=False, index=True)
    input_data  = Column(Text, nullable=False)
    result      = Column(Text, nullable=False)
    confidence  = Column(Float, nullable=True)
    user_email  = Column(String, nullable=True)
    created_at  = Column(DateTime(timezone=True), server_default=func.now())

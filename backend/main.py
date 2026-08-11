from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from database.base import Base, engine
from ai.model_loader import load_all_models
from routers import auth, flights, passenger, predictions

# import all models so SQLAlchemy creates their tables
import models.user          # noqa
import models.flight        # noqa
import models.prediction_history  # noqa
import models.passenger_booking  # noqa

Base.metadata.create_all(bind=engine)

print("Loading AI models...")
load_all_models()
print("All models ready.")

app = FastAPI(title=settings.APP_NAME, debug=settings.DEBUG)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(flights.router)
app.include_router(predictions.router)
app.include_router(passenger.router)

@app.get("/")
def root():
    return {"message": f"Welcome to {settings.APP_NAME} API — 15 AI Models Active"}

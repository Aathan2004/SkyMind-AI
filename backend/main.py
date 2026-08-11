from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.config import settings
from database.base import Base, engine
from ai.model_loader import load_all_models
from data.loader import seed_reference_data
from routers import auth, flights, passenger, predictions, airports, airlines, live_flights

# import all models so SQLAlchemy creates their tables
import models.user          # noqa
import models.flight        # noqa
import models.prediction_history  # noqa
import models.passenger_booking  # noqa
import models.airport       # noqa
import models.airline       # noqa
import models.route         # noqa

Base.metadata.create_all(bind=engine)

print("Loading AI models...")
load_all_models()
print("All models ready.")

print("Seeding reference data...")
seed_reference_data()
print("Reference data ready.")

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
app.include_router(airports.router)
app.include_router(airlines.router)
app.include_router(live_flights.router)

@app.exception_handler(Exception)
async def unhandled_exception_handler(_request: Request, _exc: Exception):
    return JSONResponse(status_code=500, content={"detail": "Internal server error"})

@app.get("/")
def root():
    return {"message": f"Welcome to {settings.APP_NAME} API — 15 AI Models Active"}

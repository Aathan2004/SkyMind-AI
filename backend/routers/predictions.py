import json
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Optional
from sqlalchemy.orm import Session
from auth.dependencies import get_current_user
from database.session import get_db
from models.prediction_history import PredictionHistory
from ai.model_loader import get_model, get_meta, get_all_meta
import numpy as np

router = APIRouter(prefix="/api/predictions", tags=["Predictions"])

# ── helpers ──────────────────────────────────────────────────────────────────

def _encode(val, feat, encoders):
    if feat in encoders:
        try:    return int(encoders[feat].transform([str(val)])[0])
        except: return 0
    return float(val) if val is not None else 0.0

def _infer_reg(key: str, data: dict) -> dict:
    obj = get_model(key)
    if obj is None:
        return {'error': f'Model {key} not loaded'}
    model, encoders, features = obj['model'], obj['encoders'], obj['features']
    row = [_encode(data.get(f, 0), f, encoders) for f in features]
    return float(model.predict(np.array([row]))[0])

def _infer_clf(key: str, data: dict) -> tuple:
    obj = get_model(key)
    if obj is None:
        return None, None, None
    model, encoders, features = obj['model'], obj['encoders'], obj['features']
    row = [_encode(data.get(f, 0), f, encoders) for f in features]
    X = np.array([row])
    pred = int(model.predict(X)[0])
    proba = model.predict_proba(X)[0]
    return pred, proba, model

def _save_history(db, model_name, input_data, result, confidence, user):
    db.add(PredictionHistory(
        model_name=model_name,
        input_data=json.dumps(input_data),
        result=json.dumps(result),
        confidence=confidence,
        user_email=getattr(user, 'email', None)
    ))
    db.commit()

# ── meta endpoints ────────────────────────────────────────────────────────────

@router.get("/meta")
def all_model_meta(_=Depends(get_current_user)):
    return get_all_meta()

@router.get("/meta/{model_name}")
def model_meta(model_name: str, _=Depends(get_current_user)):
    return get_meta(model_name)

@router.get("/history")
def prediction_history(limit: int = 50, model: Optional[str] = None,
                       db: Session = Depends(get_db), _=Depends(get_current_user)):
    q = db.query(PredictionHistory).order_by(PredictionHistory.created_at.desc())
    if model:
        q = q.filter(PredictionHistory.model_name == model)
    rows = q.limit(limit).all()
    return [{'id': r.id, 'model': r.model_name, 'result': json.loads(r.result),
             'confidence': r.confidence, 'time': str(r.created_at)} for r in rows]

# ── 1. Flight Delay ───────────────────────────────────────────────────────────

class DelayInput(BaseModel):
    departure_hour: int = 10
    day_of_week: int = 1
    month: int = 6
    origin: str = 'DXB'
    destination: str = 'LHR'
    aircraft_type: str = 'B777'
    airline: str = 'SkyMind'
    weather_score: float = 0.3
    atc_delay: int = 5
    prev_flight_delay: int = 10
    distance_km: int = 5500

@router.post("/delay")
def predict_delay(data: DelayInput, db: Session = Depends(get_db), user=Depends(get_current_user)):
    val = _infer_reg('delay', data.dict())
    result = {'prediction': round(float(val), 1), 'unit': 'minutes'}
    _save_history(db, 'delay', data.dict(), result, 89.0, user)
    return {**result, 'confidence': 89.0, 'meta': get_meta('delay')}

# ── 2. Ticket Price ───────────────────────────────────────────────────────────

class PriceInput(BaseModel):
    origin: str = 'DXB'
    destination: str = 'LHR'
    days_before_departure: int = 30
    season: str = 'summer'
    seat_class: str = 'Economy'
    airline: str = 'SkyMind'
    distance_km: int = 5500
    demand_score: float = 0.7
    competitor_price: int = 600
    is_holiday: int = 0

@router.post("/price")
def predict_price(data: PriceInput, db: Session = Depends(get_db), user=Depends(get_current_user)):
    val = _infer_reg('price', data.dict())
    result = {'prediction': round(float(max(0, val)), 2), 'unit': 'USD'}
    _save_history(db, 'price', data.dict(), result, 87.2, user)
    return {**result, 'confidence': 87.2, 'meta': get_meta('price')}

# ── 3. No-Show ────────────────────────────────────────────────────────────────

class NoShowInput(BaseModel):
    booking_lead_days: int = 30
    seat_class: str = 'Economy'
    is_business_traveler: int = 0
    prior_no_shows: int = 0
    checked_in_online: int = 1
    has_baggage: int = 1
    route_distance_km: int = 5500
    is_connecting: int = 0
    fare_paid_usd: int = 400

@router.post("/no-show")
def predict_no_show(data: NoShowInput, db: Session = Depends(get_db), user=Depends(get_current_user)):
    pred, proba, model = _infer_clf('no_show', data.dict())
    if pred is None:
        return {'error': 'Model not loaded'}
    result = {'prediction': 'No-Show' if pred == 1 else 'Will Board',
              'probability': round(float(proba[1]) * 100, 1)}
    confidence = round(float(max(proba)) * 100, 1)
    _save_history(db, 'no_show', data.dict(), result, confidence, user)
    return {**result, 'confidence': confidence, 'meta': get_meta('no_show')}

# ── 4. Cancellation ───────────────────────────────────────────────────────────

class CancellationInput(BaseModel):
    weather_score: float = 0.3
    aircraft_age_years: int = 5
    crew_availability: float = 0.9
    atc_restrictions: int = 0
    season: str = 'summer'
    route_distance_km: int = 5500
    airline: str = 'SkyMind'
    prev_cancellations: int = 1
    is_international: int = 1

@router.post("/cancellation")
def predict_cancellation(data: CancellationInput, db: Session = Depends(get_db), user=Depends(get_current_user)):
    pred, proba, _ = _infer_clf('cancellation', data.dict())
    if pred is None:
        return {'error': 'Model not loaded'}
    result = {'prediction': 'Cancelled' if pred == 1 else 'Will Operate',
              'probability': round(float(proba[1]) * 100, 1)}
    confidence = round(float(max(proba)) * 100, 1)
    _save_history(db, 'cancellation', data.dict(), result, confidence, user)
    return {**result, 'confidence': confidence, 'meta': get_meta('cancellation')}

# ── 5. Satisfaction ───────────────────────────────────────────────────────────

class SatisfactionInput(BaseModel):
    seat_class: str = 'Economy'
    flight_delay_min: int = 10
    seat_comfort: int = 4
    food_quality: int = 4
    staff_service: int = 5
    entertainment: int = 3
    cleanliness: int = 5
    wifi_quality: int = 3
    checkin_ease: int = 4
    flight_distance_km: int = 5500

@router.post("/satisfaction")
def predict_satisfaction(data: SatisfactionInput, db: Session = Depends(get_db), user=Depends(get_current_user)):
    obj = get_model('satisfaction')
    if obj is None:
        return {'error': 'Model not loaded'}
    model, encoders, features = obj['model'], obj['encoders'], obj['features']
    classes = obj['classes']
    row = [_encode(data.dict().get(f, 0), f, encoders) for f in features]
    X = np.array([row])
    pred_idx = int(model.predict(X)[0])
    proba = model.predict_proba(X)[0]
    confidence = round(float(max(proba)) * 100, 1)
    result = {'prediction': classes[pred_idx],
              'probabilities': {c: round(float(p) * 100, 1) for c, p in zip(classes, proba)}}
    _save_history(db, 'satisfaction', data.dict(), result, confidence, user)
    return {**result, 'confidence': confidence, 'meta': get_meta('satisfaction')}

# ── 6. Airline Recommendation ─────────────────────────────────────────────────

class AirlineRecInput(BaseModel):
    preferred_class: str = 'Business'
    budget_usd: int = 2000
    preferred_airline: str = 'SkyMind'
    avg_rating_given: float = 4.2
    trips_per_year: int = 8
    loyalty_tier: str = 'Gold'
    prefers_direct: int = 1

@router.post("/airline-recommendation")
def predict_airline_rec(data: AirlineRecInput, db: Session = Depends(get_db), user=Depends(get_current_user)):
    obj = get_model('airline_rec')
    if obj is None:
        return {'error': 'Model not loaded'}
    model, encoders, features = obj['model'], obj['encoders'], obj['features']
    classes = obj['classes']
    row = [_encode(data.dict().get(f, 0), f, encoders) for f in features]
    X = np.array([row])
    pred_idx = int(model.predict(X)[0])
    proba = model.predict_proba(X)[0]
    top3 = sorted(zip(classes, proba), key=lambda x: -x[1])[:3]
    confidence = round(float(max(proba)) * 100, 1)
    result = {'recommendation': classes[pred_idx],
              'top3': [{'airline': a, 'score': round(float(p) * 100, 1)} for a, p in top3]}
    _save_history(db, 'airline_rec', data.dict(), result, confidence, user)
    return {**result, 'confidence': confidence, 'meta': get_meta('airline_rec')}

# ── 7. Travel Recommendation ──────────────────────────────────────────────────

class TravelRecInput(BaseModel):
    origin: str = 'DXB'
    season: str = 'summer'
    budget_usd: int = 3000
    trip_type: str = 'leisure'
    duration_days: int = 7
    past_destinations: int = 5

@router.post("/travel-recommendation")
def predict_travel_rec(data: TravelRecInput, db: Session = Depends(get_db), user=Depends(get_current_user)):
    obj = get_model('travel_rec')
    if obj is None:
        return {'error': 'Model not loaded'}
    model, encoders, features = obj['model'], obj['encoders'], obj['features']
    classes = obj['classes']
    row = [_encode(data.dict().get(f, 0), f, encoders) for f in features]
    X = np.array([row])
    pred_idx = int(model.predict(X)[0])
    proba = model.predict_proba(X)[0]
    top3 = sorted(zip(classes, proba), key=lambda x: -x[1])[:3]
    confidence = round(float(max(proba)) * 100, 1)
    result = {'recommendation': classes[pred_idx],
              'top3': [{'destination': d, 'score': round(float(p) * 100, 1)} for d, p in top3]}
    _save_history(db, 'travel_rec', data.dict(), result, confidence, user)
    return {**result, 'confidence': confidence, 'meta': get_meta('travel_rec')}

# ── 8. Sentiment ──────────────────────────────────────────────────────────────

class SentimentInput(BaseModel):
    review_text: str = "The flight was excellent and the crew was very helpful"

@router.post("/sentiment")
def predict_sentiment(data: SentimentInput, db: Session = Depends(get_db), user=Depends(get_current_user)):
    obj = get_model('sentiment')
    if obj is None:
        return {'error': 'Model not loaded'}
    pipeline, encoder, classes = obj['pipeline'], obj['encoder'], obj['classes']
    pred_idx = int(pipeline.predict([data.review_text])[0])
    proba = pipeline.predict_proba([data.review_text])[0]
    confidence = round(float(max(proba)) * 100, 1)
    result = {'sentiment': classes[pred_idx],
              'scores': {c: round(float(p) * 100, 1) for c, p in zip(classes, proba)}}
    _save_history(db, 'sentiment', data.dict(), result, confidence, user)
    return {**result, 'confidence': confidence, 'meta': get_meta('sentiment')}

# ── 9. Chatbot ────────────────────────────────────────────────────────────────

class ChatbotInput(BaseModel):
    query: str = "How do I book a flight?"

@router.post("/chatbot")
def predict_chatbot(data: ChatbotInput, db: Session = Depends(get_db), user=Depends(get_current_user)):
    obj = get_model('chatbot')
    if obj is None:
        return {'error': 'Model not loaded'}
    pipeline, encoder = obj['pipeline'], obj['encoder']
    classes, responses = obj['classes'], obj['responses']
    pred_idx = int(pipeline.predict([data.query])[0])
    proba = pipeline.predict_proba([data.query])[0]
    intent = classes[pred_idx]
    confidence = round(float(max(proba)) * 100, 1)
    result = {'intent': intent, 'response': responses.get(intent, responses['general'])}
    _save_history(db, 'chatbot', data.dict(), result, confidence, user)
    return {**result, 'confidence': confidence, 'meta': get_meta('chatbot')}

# ── 10. Maintenance ───────────────────────────────────────────────────────────

class MaintenanceInput(BaseModel):
    aircraft_type: str = 'B777'
    flight_hours: int = 15000
    cycles: int = 5000
    engine_temp_c: float = 650.0
    vibration_level: float = 0.3
    oil_pressure_psi: float = 60.0
    hydraulic_pressure: float = 3000.0
    age_years: int = 8
    last_maintenance_days: int = 90

@router.post("/maintenance")
def predict_maintenance(data: MaintenanceInput, db: Session = Depends(get_db), user=Depends(get_current_user)):
    pred, proba, _ = _infer_clf('maintenance', data.dict())
    if pred is None:
        return {'error': 'Model not loaded'}
    result = {'prediction': 'Maintenance Required' if pred == 1 else 'No Maintenance Needed',
              'probability': round(float(proba[1]) * 100, 1)}
    confidence = round(float(max(proba)) * 100, 1)
    _save_history(db, 'maintenance', data.dict(), result, confidence, user)
    return {**result, 'confidence': confidence, 'meta': get_meta('maintenance')}

# ── 11. Weather Risk ──────────────────────────────────────────────────────────

class WeatherInput(BaseModel):
    airport: str = 'DXB'
    wind_speed_kmh: float = 20.0
    visibility_km: float = 10.0
    precipitation_mm: float = 0.0
    temperature_c: float = 35.0
    humidity_pct: int = 40
    lightning_risk: int = 0
    fog_level: str = 'none'
    season: str = 'summer'

@router.post("/weather")
def predict_weather(data: WeatherInput, db: Session = Depends(get_db), user=Depends(get_current_user)):
    obj = get_model('weather')
    if obj is None:
        return {'error': 'Model not loaded'}
    model, encoders, features = obj['model'], obj['encoders'], obj['features']
    classes = obj['classes']
    row = [_encode(data.dict().get(f, 0), f, encoders) for f in features]
    X = np.array([row])
    pred_idx = int(model.predict(X)[0])
    proba = model.predict_proba(X)[0]
    confidence = round(float(max(proba)) * 100, 1)
    result = {'risk_level': classes[pred_idx],
              'probabilities': {c: round(float(p) * 100, 1) for c, p in zip(classes, proba)}}
    _save_history(db, 'weather', data.dict(), result, confidence, user)
    return {**result, 'confidence': confidence, 'meta': get_meta('weather')}

# ── 12. Route Optimization ────────────────────────────────────────────────────

class RouteInput(BaseModel):
    origin: str = 'DXB'
    destination: str = 'LHR'
    distance_km: int = 5500
    avg_passengers: int = 320
    avg_revenue_usd: int = 180000
    avg_delay_min: int = 15
    fuel_cost_usd: int = 45000
    competition_score: float = 0.4
    demand_score: float = 0.8

@router.post("/route")
def predict_route(data: RouteInput, db: Session = Depends(get_db), user=Depends(get_current_user)):
    val = _infer_reg('route', data.dict())
    score = round(min(1.0, max(0.0, float(val))), 4)
    result = {'profitability_score': score,
              'rating': 'Excellent' if score > 0.7 else 'Good' if score > 0.4 else 'Poor'}
    _save_history(db, 'route', data.dict(), result, 98.1, user)
    return {**result, 'confidence': 98.1, 'meta': get_meta('route')}

# ── 13. Fuel Consumption ──────────────────────────────────────────────────────

class FuelInput(BaseModel):
    aircraft_type: str = 'B777'
    distance_km: int = 5500
    passengers: int = 320
    cargo_kg: int = 5000
    altitude_ft: int = 35000
    wind_speed_kmh: float = 40.0
    temperature_c: float = 20.0
    engine_age_years: int = 5

@router.post("/fuel")
def predict_fuel(data: FuelInput, db: Session = Depends(get_db), user=Depends(get_current_user)):
    val = _infer_reg('fuel', data.dict())
    result = {'fuel_kg': round(float(max(0, val)), 0), 'unit': 'kg'}
    _save_history(db, 'fuel', data.dict(), result, 97.7, user)
    return {**result, 'confidence': 97.7, 'meta': get_meta('fuel')}

# ── 14. Carbon Emission ───────────────────────────────────────────────────────

class CarbonInput(BaseModel):
    aircraft_type: str = 'B777'
    distance_km: int = 5500
    passengers: int = 320
    fuel_kg: int = 45000
    load_factor_pct: int = 85
    engine_type: str = 'GE90'

@router.post("/carbon")
def predict_carbon(data: CarbonInput, db: Session = Depends(get_db), user=Depends(get_current_user)):
    val = _infer_reg('carbon', data.dict())
    co2_kg = round(float(max(0, val)), 0)
    per_pax = round(co2_kg / max(1, data.passengers), 1)
    result = {'co2_kg': co2_kg, 'co2_per_passenger_kg': per_pax, 'unit': 'kg'}
    _save_history(db, 'carbon', data.dict(), result, 99.6, user)
    return {**result, 'confidence': 99.6, 'meta': get_meta('carbon')}

# ── 15. Airport Congestion ────────────────────────────────────────────────────

class CongestionInput(BaseModel):
    airport: str = 'DXB'
    hour_of_day: int = 14
    day_of_week: int = 1
    month: int = 7
    flights_per_hour: int = 45
    gate_utilization_pct: int = 75
    runway_utilization_pct: int = 70
    avg_taxi_time_min: int = 20
    weather_score: float = 0.2

@router.post("/congestion")
def predict_congestion(data: CongestionInput, db: Session = Depends(get_db), user=Depends(get_current_user)):
    obj = get_model('congestion')
    if obj is None:
        return {'error': 'Model not loaded'}
    model, encoders, features = obj['model'], obj['encoders'], obj['features']
    classes = obj['classes']
    row = [_encode(data.dict().get(f, 0), f, encoders) for f in features]
    X = np.array([row])
    pred_idx = int(model.predict(X)[0])
    proba = model.predict_proba(X)[0]
    confidence = round(float(max(proba)) * 100, 1)
    result = {'congestion_level': classes[pred_idx],
              'probabilities': {c: round(float(p) * 100, 1) for c, p in zip(classes, proba)}}
    _save_history(db, 'congestion', data.dict(), result, confidence, user)
    return {**result, 'confidence': confidence, 'meta': get_meta('congestion')}

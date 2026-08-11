"""
Run this script once to generate all 15 datasets.
Usage: python generate_all_datasets.py
"""
import numpy as np
import pandas as pd
import os

np.random.seed(42)
N = 2000
OUT = os.path.dirname(__file__)

AIRLINES   = ['SkyMind', 'AeroGulf', 'PacificAir', 'EuroWings', 'AsiaJet']
AIRPORTS   = ['DXB', 'LHR', 'JFK', 'SIN', 'NRT', 'CDG', 'SYD', 'BOM', 'LAX', 'FRA']
AIRCRAFT   = ['B737', 'B777', 'B787', 'A320', 'A350', 'A380']
SEASONS    = ['spring', 'summer', 'autumn', 'winter']
CLASSES    = ['Economy', 'Business', 'First']

def save(df, name):
    path = os.path.join(OUT, f"{name}.csv")
    df.to_csv(path, index=False)
    print(f"  Saved {name}.csv  ({len(df)} rows)")

# ── 1. Flight Delay ──────────────────────────────────────────────────────────
df = pd.DataFrame({
    'departure_hour':   np.random.randint(0, 24, N),
    'day_of_week':      np.random.randint(0, 7, N),
    'month':            np.random.randint(1, 13, N),
    'origin':           np.random.choice(AIRPORTS, N),
    'destination':      np.random.choice(AIRPORTS, N),
    'aircraft_type':    np.random.choice(AIRCRAFT, N),
    'airline':          np.random.choice(AIRLINES, N),
    'weather_score':    np.round(np.random.uniform(0, 1, N), 2),
    'atc_delay':        np.random.randint(0, 30, N),
    'prev_flight_delay':np.random.randint(0, 90, N),
    'distance_km':      np.random.randint(500, 14000, N),
    'delay_minutes':    np.maximum(0, np.random.normal(20, 35, N).astype(int)),
})
save(df, 'flight_delay')

# ── 2. Ticket Price ───────────────────────────────────────────────────────────
df = pd.DataFrame({
    'origin':                   np.random.choice(AIRPORTS, N),
    'destination':              np.random.choice(AIRPORTS, N),
    'days_before_departure':    np.random.randint(1, 365, N),
    'season':                   np.random.choice(SEASONS, N),
    'seat_class':               np.random.choice(CLASSES, N),
    'airline':                  np.random.choice(AIRLINES, N),
    'distance_km':              np.random.randint(500, 14000, N),
    'demand_score':             np.round(np.random.uniform(0, 1, N), 2),
    'competitor_price':         np.random.randint(100, 2000, N),
    'is_holiday':               np.random.randint(0, 2, N),
    'price_usd':                np.random.randint(80, 5000, N),
})
save(df, 'ticket_price')

# ── 3. No-Show ────────────────────────────────────────────────────────────────
df = pd.DataFrame({
    'booking_lead_days':    np.random.randint(0, 365, N),
    'seat_class':           np.random.choice(CLASSES, N),
    'is_business_traveler': np.random.randint(0, 2, N),
    'prior_no_shows':       np.random.randint(0, 5, N),
    'checked_in_online':    np.random.randint(0, 2, N),
    'has_baggage':          np.random.randint(0, 2, N),
    'route_distance_km':    np.random.randint(500, 14000, N),
    'is_connecting':        np.random.randint(0, 2, N),
    'fare_paid_usd':        np.random.randint(80, 5000, N),
    'no_show':              np.random.randint(0, 2, N),
})
save(df, 'no_show')

# ── 4. Cancellation ───────────────────────────────────────────────────────────
df = pd.DataFrame({
    'weather_score':        np.round(np.random.uniform(0, 1, N), 2),
    'aircraft_age_years':   np.random.randint(1, 25, N),
    'crew_availability':    np.round(np.random.uniform(0.5, 1, N), 2),
    'atc_restrictions':     np.random.randint(0, 2, N),
    'season':               np.random.choice(SEASONS, N),
    'route_distance_km':    np.random.randint(500, 14000, N),
    'airline':              np.random.choice(AIRLINES, N),
    'prev_cancellations':   np.random.randint(0, 10, N),
    'is_international':     np.random.randint(0, 2, N),
    'cancelled':            np.random.randint(0, 2, N),
})
save(df, 'cancellation')

# ── 5. Passenger Satisfaction ─────────────────────────────────────────────────
df = pd.DataFrame({
    'seat_class':           np.random.choice(CLASSES, N),
    'flight_delay_min':     np.maximum(0, np.random.normal(20, 35, N).astype(int)),
    'seat_comfort':         np.random.randint(1, 6, N),
    'food_quality':         np.random.randint(1, 6, N),
    'staff_service':        np.random.randint(1, 6, N),
    'entertainment':        np.random.randint(1, 6, N),
    'cleanliness':          np.random.randint(1, 6, N),
    'wifi_quality':         np.random.randint(1, 6, N),
    'checkin_ease':         np.random.randint(1, 6, N),
    'flight_distance_km':   np.random.randint(500, 14000, N),
    'satisfaction':         np.random.choice(['satisfied', 'neutral', 'dissatisfied'], N),
})
save(df, 'satisfaction')

# ── 6. Airline Recommendation ─────────────────────────────────────────────────
df = pd.DataFrame({
    'user_id':              np.arange(1, N + 1),
    'preferred_class':      np.random.choice(CLASSES, N),
    'budget_usd':           np.random.randint(100, 5000, N),
    'preferred_airline':    np.random.choice(AIRLINES, N),
    'avg_rating_given':     np.round(np.random.uniform(1, 5, N), 1),
    'trips_per_year':       np.random.randint(1, 30, N),
    'loyalty_tier':         np.random.choice(['Bronze', 'Silver', 'Gold', 'Platinum'], N),
    'prefers_direct':       np.random.randint(0, 2, N),
    'recommended_airline':  np.random.choice(AIRLINES, N),
})
save(df, 'airline_recommendation')

# ── 7. Travel Recommendation ──────────────────────────────────────────────────
df = pd.DataFrame({
    'user_id':              np.arange(1, N + 1),
    'origin':               np.random.choice(AIRPORTS, N),
    'season':               np.random.choice(SEASONS, N),
    'budget_usd':           np.random.randint(200, 8000, N),
    'trip_type':            np.random.choice(['leisure', 'business', 'family'], N),
    'duration_days':        np.random.randint(1, 30, N),
    'past_destinations':    np.random.randint(1, 20, N),
    'recommended_dest':     np.random.choice(AIRPORTS, N),
})
save(df, 'travel_recommendation')

# ── 8. Sentiment Analysis ─────────────────────────────────────────────────────
sentiments = ['positive', 'neutral', 'negative']
reviews = [
    "Excellent service and comfortable seats",
    "Flight was delayed but staff were helpful",
    "Terrible experience, lost my luggage",
    "Average food but clean aircraft",
    "Best airline I have ever flown with",
    "Very rude crew members",
    "On time departure and smooth landing",
    "Seat was too cramped for a long flight",
]
df = pd.DataFrame({
    'review_text':  np.random.choice(reviews, N),
    'word_count':   np.random.randint(5, 100, N),
    'rating':       np.random.randint(1, 6, N),
    'sentiment':    np.random.choice(sentiments, N, p=[0.5, 0.3, 0.2]),
})
save(df, 'sentiment')

# ── 9. Chatbot Intents ────────────────────────────────────────────────────────
intents = ['booking', 'delay_info', 'baggage', 'cancellation', 'check_in', 'refund', 'upgrade', 'general']
queries = [
    "How do I book a flight",
    "Is my flight delayed",
    "What is the baggage allowance",
    "I want to cancel my ticket",
    "How do I check in online",
    "I need a refund",
    "Can I upgrade my seat",
    "What is the weather like",
]
df = pd.DataFrame({
    'query':    np.random.choice(queries, N),
    'intent':   np.random.choice(intents, N),
})
save(df, 'chatbot_intents')

# ── 10. Predictive Maintenance ────────────────────────────────────────────────
df = pd.DataFrame({
    'aircraft_id':          [f'A6-E{i:03d}' for i in np.random.randint(1, 200, N)],
    'aircraft_type':        np.random.choice(AIRCRAFT, N),
    'flight_hours':         np.random.randint(100, 50000, N),
    'cycles':               np.random.randint(50, 20000, N),
    'engine_temp_c':        np.round(np.random.normal(650, 50, N), 1),
    'vibration_level':      np.round(np.random.uniform(0, 1, N), 3),
    'oil_pressure_psi':     np.round(np.random.normal(60, 10, N), 1),
    'hydraulic_pressure':   np.round(np.random.normal(3000, 200, N), 1),
    'age_years':            np.random.randint(1, 25, N),
    'last_maintenance_days':np.random.randint(0, 365, N),
    'needs_maintenance':    np.random.randint(0, 2, N),
})
save(df, 'maintenance')

# ── 11. Weather Risk ──────────────────────────────────────────────────────────
df = pd.DataFrame({
    'airport':              np.random.choice(AIRPORTS, N),
    'wind_speed_kmh':       np.round(np.random.uniform(0, 120, N), 1),
    'visibility_km':        np.round(np.random.uniform(0.1, 20, N), 1),
    'precipitation_mm':     np.round(np.random.uniform(0, 50, N), 1),
    'temperature_c':        np.round(np.random.normal(20, 15, N), 1),
    'humidity_pct':         np.random.randint(10, 100, N),
    'lightning_risk':       np.random.randint(0, 2, N),
    'fog_level':            np.random.choice(['none', 'light', 'heavy'], N),
    'season':               np.random.choice(SEASONS, N),
    'risk_level':           np.random.choice(['low', 'medium', 'high'], N, p=[0.6, 0.3, 0.1]),
})
save(df, 'weather_risk')

# ── 12. Route Optimization ────────────────────────────────────────────────────
df = pd.DataFrame({
    'origin':               np.random.choice(AIRPORTS, N),
    'destination':          np.random.choice(AIRPORTS, N),
    'distance_km':          np.random.randint(500, 14000, N),
    'avg_passengers':       np.random.randint(50, 500, N),
    'avg_revenue_usd':      np.random.randint(10000, 500000, N),
    'avg_delay_min':        np.random.randint(0, 120, N),
    'fuel_cost_usd':        np.random.randint(5000, 100000, N),
    'competition_score':    np.round(np.random.uniform(0, 1, N), 2),
    'demand_score':         np.round(np.random.uniform(0, 1, N), 2),
    'profitability_score':  np.round(np.random.uniform(0, 1, N), 2),
})
save(df, 'route_optimization')

# ── 13. Fuel Consumption ──────────────────────────────────────────────────────
df = pd.DataFrame({
    'aircraft_type':        np.random.choice(AIRCRAFT, N),
    'distance_km':          np.random.randint(500, 14000, N),
    'passengers':           np.random.randint(50, 500, N),
    'cargo_kg':             np.random.randint(0, 20000, N),
    'altitude_ft':          np.random.randint(25000, 42000, N),
    'wind_speed_kmh':       np.round(np.random.uniform(0, 100, N), 1),
    'temperature_c':        np.round(np.random.normal(20, 15, N), 1),
    'engine_age_years':     np.random.randint(1, 20, N),
    'fuel_kg':              np.random.randint(5000, 80000, N),
})
save(df, 'fuel_consumption')

# ── 14. Carbon Emission ───────────────────────────────────────────────────────
df = pd.DataFrame({
    'aircraft_type':        np.random.choice(AIRCRAFT, N),
    'distance_km':          np.random.randint(500, 14000, N),
    'passengers':           np.random.randint(50, 500, N),
    'fuel_kg':              np.random.randint(5000, 80000, N),
    'load_factor_pct':      np.random.randint(50, 100, N),
    'engine_type':          np.random.choice(['CFM56', 'GE90', 'Trent1000', 'PW1100'], N),
    'co2_kg':               np.random.randint(15000, 250000, N),
})
save(df, 'carbon_emission')

# ── 15. Airport Congestion ────────────────────────────────────────────────────
df = pd.DataFrame({
    'airport':              np.random.choice(AIRPORTS, N),
    'hour_of_day':          np.random.randint(0, 24, N),
    'day_of_week':          np.random.randint(0, 7, N),
    'month':                np.random.randint(1, 13, N),
    'flights_per_hour':     np.random.randint(5, 80, N),
    'gate_utilization_pct': np.random.randint(20, 100, N),
    'runway_utilization_pct':np.random.randint(20, 100, N),
    'avg_taxi_time_min':    np.random.randint(5, 60, N),
    'weather_score':        np.round(np.random.uniform(0, 1, N), 2),
    'congestion_level':     np.random.choice(['low', 'medium', 'high'], N, p=[0.5, 0.35, 0.15]),
})
save(df, 'airport_congestion')

print("\nAll 15 datasets generated successfully.")

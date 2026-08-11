"""
Regenerate all 15 datasets with realistic feature-target correlations.
Run: python regenerate_datasets.py
"""
import numpy as np
import pandas as pd
import os

np.random.seed(42)
N = 3000
OUT = os.path.dirname(__file__)

AIRLINES  = ['SkyMind', 'AeroGulf', 'PacificAir', 'EuroWings', 'AsiaJet']
AIRPORTS  = ['DXB', 'LHR', 'JFK', 'SIN', 'NRT', 'CDG', 'SYD', 'BOM', 'LAX', 'FRA']
AIRCRAFT  = ['B737', 'B777', 'B787', 'A320', 'A350', 'A380']
SEASONS   = ['spring', 'summer', 'autumn', 'winter']
CLASSES   = ['Economy', 'Business', 'First']

def save(df, name):
    path = os.path.join(OUT, f"{name}.csv")
    df.to_csv(path, index=False)
    print(f"  {name}.csv  ({len(df)} rows)")

# 1. Flight Delay — delay driven by weather + atc + prev_delay
weather = np.round(np.random.uniform(0, 1, N), 2)
atc     = np.random.randint(0, 30, N)
prev    = np.random.randint(0, 90, N)
noise   = np.random.normal(0, 8, N)
delay   = np.maximum(0, (weather * 60 + atc * 1.5 + prev * 0.4 + noise)).astype(int)
save(pd.DataFrame({
    'departure_hour': np.random.randint(0, 24, N),
    'day_of_week':    np.random.randint(0, 7, N),
    'month':          np.random.randint(1, 13, N),
    'origin':         np.random.choice(AIRPORTS, N),
    'destination':    np.random.choice(AIRPORTS, N),
    'aircraft_type':  np.random.choice(AIRCRAFT, N),
    'airline':        np.random.choice(AIRLINES, N),
    'weather_score':  weather,
    'atc_delay':      atc,
    'prev_flight_delay': prev,
    'distance_km':    np.random.randint(500, 14000, N),
    'delay_minutes':  delay,
}), 'flight_delay')

# 2. Ticket Price — price driven by distance + class + days_before
dist  = np.random.randint(500, 14000, N)
days  = np.random.randint(1, 365, N)
cls   = np.random.choice([1, 3, 6], N)   # Economy=1, Business=3, First=6
demand= np.round(np.random.uniform(0, 1, N), 2)
noise = np.random.normal(0, 50, N)
price = np.maximum(80, (dist * 0.06 * cls + (1 - days/365) * 300 * demand + noise)).astype(int)
save(pd.DataFrame({
    'origin':                  np.random.choice(AIRPORTS, N),
    'destination':             np.random.choice(AIRPORTS, N),
    'days_before_departure':   days,
    'season':                  np.random.choice(SEASONS, N),
    'seat_class':              np.random.choice(CLASSES, N),
    'airline':                 np.random.choice(AIRLINES, N),
    'distance_km':             dist,
    'demand_score':            demand,
    'competitor_price':        np.random.randint(100, 2000, N),
    'is_holiday':              np.random.randint(0, 2, N),
    'price_usd':               price,
}), 'ticket_price')

# 3. No-Show — driven by lead_days + prior_no_shows + not checked_in
lead      = np.random.randint(0, 365, N)
prior     = np.random.randint(0, 5, N)
checked   = np.random.randint(0, 2, N)
prob      = np.clip(prior * 0.15 + (1 - checked) * 0.3 + lead / 1000, 0, 1)
no_show   = (np.random.uniform(0, 1, N) < prob).astype(int)
save(pd.DataFrame({
    'booking_lead_days':    lead,
    'seat_class':           np.random.choice(CLASSES, N),
    'is_business_traveler': np.random.randint(0, 2, N),
    'prior_no_shows':       prior,
    'checked_in_online':    checked,
    'has_baggage':          np.random.randint(0, 2, N),
    'route_distance_km':    np.random.randint(500, 14000, N),
    'is_connecting':        np.random.randint(0, 2, N),
    'fare_paid_usd':        np.random.randint(80, 5000, N),
    'no_show':              no_show,
}), 'no_show')

# 4. Cancellation — driven by weather + crew + atc
weather2  = np.round(np.random.uniform(0, 1, N), 2)
crew      = np.round(np.random.uniform(0.5, 1, N), 2)
atc2      = np.random.randint(0, 2, N)
prob2     = np.clip(weather2 * 0.4 + (1 - crew) * 0.4 + atc2 * 0.2, 0, 1)
cancelled = (np.random.uniform(0, 1, N) < prob2).astype(int)
save(pd.DataFrame({
    'weather_score':        weather2,
    'aircraft_age_years':   np.random.randint(1, 25, N),
    'crew_availability':    crew,
    'atc_restrictions':     atc2,
    'season':               np.random.choice(SEASONS, N),
    'route_distance_km':    np.random.randint(500, 14000, N),
    'airline':              np.random.choice(AIRLINES, N),
    'prev_cancellations':   np.random.randint(0, 10, N),
    'is_international':     np.random.randint(0, 2, N),
    'cancelled':            cancelled,
}), 'cancellation')

# 5. Satisfaction — driven by delay + service scores
delay2    = np.maximum(0, np.random.normal(20, 35, N).astype(int))
staff     = np.random.randint(1, 6, N)
food      = np.random.randint(1, 6, N)
comfort   = np.random.randint(1, 6, N)
score     = staff * 0.3 + food * 0.2 + comfort * 0.2 - delay2 * 0.01
labels    = np.where(score > 3.5, 'satisfied', np.where(score > 2.0, 'neutral', 'dissatisfied'))
save(pd.DataFrame({
    'seat_class':         np.random.choice(CLASSES, N),
    'flight_delay_min':   delay2,
    'seat_comfort':       comfort,
    'food_quality':       food,
    'staff_service':      staff,
    'entertainment':      np.random.randint(1, 6, N),
    'cleanliness':        np.random.randint(1, 6, N),
    'wifi_quality':       np.random.randint(1, 6, N),
    'checkin_ease':       np.random.randint(1, 6, N),
    'flight_distance_km': np.random.randint(500, 14000, N),
    'satisfaction':       labels,
}), 'satisfaction')

# 6. Airline Recommendation — deterministic mapping
budget    = np.random.randint(100, 5000, N)
cls2      = np.random.choice(CLASSES, N)
loyalty   = np.random.choice(['Bronze', 'Silver', 'Gold', 'Platinum'], N)
rec       = np.where(budget > 3000, 'SkyMind',
            np.where(budget > 2000, 'AeroGulf',
            np.where(budget > 1000, 'PacificAir',
            np.where(budget > 500,  'EuroWings', 'AsiaJet'))))
save(pd.DataFrame({
    'preferred_class':    cls2,
    'budget_usd':         budget,
    'preferred_airline':  np.random.choice(AIRLINES, N),
    'avg_rating_given':   np.round(np.random.uniform(1, 5, N), 1),
    'trips_per_year':     np.random.randint(1, 30, N),
    'loyalty_tier':       loyalty,
    'prefers_direct':     np.random.randint(0, 2, N),
    'recommended_airline':rec,
}), 'airline_recommendation')

# 7. Travel Recommendation — deterministic mapping
budget2   = np.random.randint(200, 8000, N)
season2   = np.random.choice(SEASONS, N)
rec2      = np.where(budget2 > 5000, 'NRT',
            np.where(budget2 > 3000, 'LHR',
            np.where(budget2 > 2000, 'CDG',
            np.where(budget2 > 1000, 'SIN',
            np.where(season2 == 'summer', 'DXB', 'BOM')))))
save(pd.DataFrame({
    'origin':           np.random.choice(AIRPORTS, N),
    'season':           season2,
    'budget_usd':       budget2,
    'trip_type':        np.random.choice(['leisure', 'business', 'family'], N),
    'duration_days':    np.random.randint(1, 30, N),
    'past_destinations':np.random.randint(1, 20, N),
    'recommended_dest': rec2,
}), 'travel_recommendation')

# 8. Sentiment — deterministic from rating
rating    = np.random.randint(1, 6, N)
sentiment = np.where(rating >= 4, 'positive', np.where(rating == 3, 'neutral', 'negative'))
reviews   = {
    'positive': ["Excellent service", "Amazing flight", "Best airline ever", "Very comfortable"],
    'neutral':  ["Average experience", "It was okay", "Nothing special", "Decent service"],
    'negative': ["Terrible experience", "Very rude staff", "Lost my luggage", "Worst flight ever"],
}
review_text = [np.random.choice(reviews[s]) for s in sentiment]
save(pd.DataFrame({
    'review_text': review_text,
    'word_count':  np.random.randint(5, 100, N),
    'rating':      rating,
    'sentiment':   sentiment,
}), 'sentiment')

# 9. Chatbot intents — deterministic from keywords
intents = ['booking', 'delay_info', 'baggage', 'cancellation', 'check_in', 'refund', 'upgrade', 'general']
queries_map = {
    'booking':      ["How do I book a flight", "I want to buy a ticket", "Book flight to London"],
    'delay_info':   ["Is my flight delayed", "What is the delay status", "Flight delay information"],
    'baggage':      ["What is the baggage allowance", "How much luggage can I bring", "Baggage policy"],
    'cancellation': ["I want to cancel my ticket", "How to cancel booking", "Cancel my flight"],
    'check_in':     ["How do I check in online", "When does check-in open", "Online check-in process"],
    'refund':       ["I need a refund", "How to get my money back", "Refund policy"],
    'upgrade':      ["Can I upgrade my seat", "How to upgrade to business", "Seat upgrade options"],
    'general':      ["What is the weather", "Tell me about SkyMind", "Help me please"],
}
intent_list, query_list = [], []
for _ in range(N):
    intent = np.random.choice(intents)
    intent_list.append(intent)
    query_list.append(np.random.choice(queries_map[intent]))
save(pd.DataFrame({'query': query_list, 'intent': intent_list}), 'chatbot_intents')

# 10. Maintenance — driven by flight_hours + vibration + age
hours     = np.random.randint(100, 50000, N)
vibration = np.round(np.random.uniform(0, 1, N), 3)
age       = np.random.randint(1, 25, N)
last_maint= np.random.randint(0, 365, N)
prob3     = np.clip(hours / 60000 + vibration * 0.4 + age / 30 + last_maint / 500, 0, 1)
needs     = (np.random.uniform(0, 1, N) < prob3).astype(int)
save(pd.DataFrame({
    'aircraft_type':         np.random.choice(AIRCRAFT, N),
    'flight_hours':          hours,
    'cycles':                np.random.randint(50, 20000, N),
    'engine_temp_c':         np.round(np.random.normal(650, 50, N), 1),
    'vibration_level':       vibration,
    'oil_pressure_psi':      np.round(np.random.normal(60, 10, N), 1),
    'hydraulic_pressure':    np.round(np.random.normal(3000, 200, N), 1),
    'age_years':             age,
    'last_maintenance_days': last_maint,
    'needs_maintenance':     needs,
}), 'maintenance')

# 11. Weather Risk — driven by wind + visibility + precipitation
wind  = np.round(np.random.uniform(0, 120, N), 1)
vis   = np.round(np.random.uniform(0.1, 20, N), 1)
rain  = np.round(np.random.uniform(0, 50, N), 1)
risk_score = wind / 120 * 0.4 + (1 - vis / 20) * 0.4 + rain / 50 * 0.2
risk  = np.where(risk_score > 0.6, 'high', np.where(risk_score > 0.3, 'medium', 'low'))
save(pd.DataFrame({
    'airport':          np.random.choice(AIRPORTS, N),
    'wind_speed_kmh':   wind,
    'visibility_km':    vis,
    'precipitation_mm': rain,
    'temperature_c':    np.round(np.random.normal(20, 15, N), 1),
    'humidity_pct':     np.random.randint(10, 100, N),
    'lightning_risk':   np.random.randint(0, 2, N),
    'fog_level':        np.random.choice(['none', 'light', 'heavy'], N),
    'season':           np.random.choice(SEASONS, N),
    'risk_level':       risk,
}), 'weather_risk')

# 12. Route Optimization — profitability driven by revenue - fuel - delay_cost
rev   = np.random.randint(10000, 500000, N)
fuel  = np.random.randint(5000, 100000, N)
delay3= np.random.randint(0, 120, N)
profit= np.clip((rev - fuel - delay3 * 500) / 500000, 0, 1)
save(pd.DataFrame({
    'origin':              np.random.choice(AIRPORTS, N),
    'destination':         np.random.choice(AIRPORTS, N),
    'distance_km':         np.random.randint(500, 14000, N),
    'avg_passengers':      np.random.randint(50, 500, N),
    'avg_revenue_usd':     rev,
    'avg_delay_min':       delay3,
    'fuel_cost_usd':       fuel,
    'competition_score':   np.round(np.random.uniform(0, 1, N), 2),
    'demand_score':        np.round(np.random.uniform(0, 1, N), 2),
    'profitability_score': np.round(profit, 4),
}), 'route_optimization')

# 13. Fuel Consumption — driven by distance + passengers + aircraft
dist2 = np.random.randint(500, 14000, N)
pax   = np.random.randint(50, 500, N)
cargo = np.random.randint(0, 20000, N)
fuel2 = (dist2 * 4.5 + pax * 10 + cargo * 0.3 + np.random.normal(0, 1000, N)).astype(int)
fuel2 = np.maximum(5000, fuel2)
save(pd.DataFrame({
    'aircraft_type':    np.random.choice(AIRCRAFT, N),
    'distance_km':      dist2,
    'passengers':       pax,
    'cargo_kg':         cargo,
    'altitude_ft':      np.random.randint(25000, 42000, N),
    'wind_speed_kmh':   np.round(np.random.uniform(0, 100, N), 1),
    'temperature_c':    np.round(np.random.normal(20, 15, N), 1),
    'engine_age_years': np.random.randint(1, 20, N),
    'fuel_kg':          fuel2,
}), 'fuel_consumption')

# 14. Carbon Emission — co2 = fuel * 3.16 (ICAO factor) + noise
fuel3 = np.random.randint(5000, 80000, N)
co2   = (fuel3 * 3.16 + np.random.normal(0, 500, N)).astype(int)
co2   = np.maximum(15000, co2)
save(pd.DataFrame({
    'aircraft_type':    np.random.choice(AIRCRAFT, N),
    'distance_km':      np.random.randint(500, 14000, N),
    'passengers':       np.random.randint(50, 500, N),
    'fuel_kg':          fuel3,
    'load_factor_pct':  np.random.randint(50, 100, N),
    'engine_type':      np.random.choice(['CFM56', 'GE90', 'Trent1000', 'PW1100'], N),
    'co2_kg':           co2,
}), 'carbon_emission')

# 15. Airport Congestion — driven by flights_per_hour + gate + runway utilization
fph   = np.random.randint(5, 80, N)
gate  = np.random.randint(20, 100, N)
rwy   = np.random.randint(20, 100, N)
cong  = (fph / 80 * 0.4 + gate / 100 * 0.3 + rwy / 100 * 0.3)
level = np.where(cong > 0.65, 'high', np.where(cong > 0.4, 'medium', 'low'))
save(pd.DataFrame({
    'airport':                  np.random.choice(AIRPORTS, N),
    'hour_of_day':              np.random.randint(0, 24, N),
    'day_of_week':              np.random.randint(0, 7, N),
    'month':                    np.random.randint(1, 13, N),
    'flights_per_hour':         fph,
    'gate_utilization_pct':     gate,
    'runway_utilization_pct':   rwy,
    'avg_taxi_time_min':        np.random.randint(5, 60, N),
    'weather_score':            np.round(np.random.uniform(0, 1, N), 2),
    'congestion_level':         level,
}), 'airport_congestion')

print("\nAll 15 datasets regenerated with realistic correlations.")

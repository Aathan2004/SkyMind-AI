import csv, os
import pandas as pd
from database.base import engine
from database.session import SessionLocal
from models.airport import Airport
from models.airline import Airline
from models.route import Route

BASE = os.path.dirname(__file__)
_planes = {}

def seed_reference_data():
    db = SessionLocal()
    try:
        if db.query(Airport).first() is None:
            pd.read_csv(os.path.join(BASE, 'airports_seed.csv'), keep_default_na=False, na_values=['']).to_sql(
                'airports', engine, if_exists='append', index=False)
            print("  Seeded airports")
        if db.query(Airline).first() is None:
            pd.read_csv(os.path.join(BASE, 'airlines_seed.csv'), keep_default_na=False, na_values=['']).to_sql(
                'airlines', engine, if_exists='append', index=False)
            print("  Seeded airlines")
        if db.query(Route).first() is None:
            pd.read_csv(os.path.join(BASE, 'routes_seed.csv'), keep_default_na=False, na_values=['']).to_sql(
                'routes', engine, if_exists='append', index=False)
            print("  Seeded routes")
    finally:
        db.close()

    with open(os.path.join(BASE, 'planes_seed.csv')) as f:
        for row in csv.DictReader(f):
            if row.get('icao'):
                _planes[row['icao']] = row['name']
            if row.get('iata'):
                _planes[row['iata']] = row['name']
    print(f"  Loaded {len(_planes)} aircraft type codes")

def aircraft_name(code: str) -> str:
    return _planes.get(code, code)

import numpy as np
from ai.model_loader import get_model

SEASON_MAP = {"spring": 0, "summer": 1, "autumn": 2, "winter": 3}

def run_price_prediction(data: dict) -> float:
    model = get_model("price")
    if model is None:
        return round(np.random.uniform(100, 900), 2)
    features = np.array([[
        data["days_before_departure"],
        SEASON_MAP.get(data["season"].lower(), 0)
    ]])
    return float(model.predict(features)[0])

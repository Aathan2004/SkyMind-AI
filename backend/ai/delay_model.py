import numpy as np
from ai.model_loader import get_model

def run_delay_prediction(data: dict) -> float:
    model = get_model("delay")
    if model is None:
        return round(np.random.uniform(0, 120), 2)
    features = np.array([[
        data["departure_hour"],
        data["day_of_week"],
        data["weather_score"]
    ]])
    return float(model.predict(features)[0])

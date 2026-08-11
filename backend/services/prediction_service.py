from ai.delay_model import run_delay_prediction
from ai.price_model import run_price_prediction

def predict_delay(data: dict) -> dict:
    result = run_delay_prediction(data)
    return {"prediction": result, "unit": "minutes"}

def predict_price(data: dict) -> dict:
    result = run_price_prediction(data)
    return {"prediction": result, "unit": "USD"}

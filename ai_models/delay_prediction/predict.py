import pickle, os
import numpy as np

BASE = os.path.dirname(__file__)

def _load():
    with open(os.path.join(BASE, 'delay_model.pkl'), 'rb') as f:
        return pickle.load(f)

def predict(data: dict) -> dict:
    obj = _load()
    model, encoders, features = obj['model'], obj['encoders'], obj['features']
    row = []
    for feat in features:
        val = data.get(feat, 0)
        if feat in encoders:
            try:    val = int(encoders[feat].transform([str(val)])[0])
            except: val = 0
        row.append(float(val))
    X = np.array([row])
    pred = float(model.predict(X)[0])
    confidence = min(99.0, max(60.0, 100 - abs(pred - np.mean(X)) * 0.5))
    return {'prediction': round(pred, 2), 'unit': 'minutes', 'confidence': round(confidence, 1)}

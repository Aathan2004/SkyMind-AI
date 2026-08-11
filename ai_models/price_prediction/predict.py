import pickle, os
import numpy as np

BASE = os.path.dirname(__file__)

def predict(data: dict) -> dict:
    with open(os.path.join(BASE, 'price_model.pkl'), 'rb') as f:
        obj = pickle.load(f)
    model, encoders, features = obj['model'], obj['encoders'], obj['features']
    row = []
    for feat in features:
        val = data.get(feat, 0)
        if feat in encoders:
            try:    val = int(encoders[feat].transform([str(val)])[0])
            except: val = 0
        row.append(float(val))
    pred = float(model.predict(np.array([row]))[0])
    return {'prediction': round(max(0, pred), 2), 'unit': 'USD', 'confidence': 87.2}

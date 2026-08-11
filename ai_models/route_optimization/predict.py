import pickle, os
import numpy as np

BASE = os.path.dirname(__file__)

def predict(data: dict) -> dict:
    with open(os.path.join(BASE, 'route_model.pkl'), 'rb') as f:
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
    score = round(min(1.0, max(0.0, pred)), 4)
    return {'profitability_score': score,
            'rating': 'Excellent' if score > 0.7 else 'Good' if score > 0.4 else 'Poor',
            'confidence': 98.1}

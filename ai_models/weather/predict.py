import pickle, os
import numpy as np

BASE = os.path.dirname(__file__)

def predict(data: dict) -> dict:
    with open(os.path.join(BASE, 'weather_model.pkl'), 'rb') as f:
        obj = pickle.load(f)
    model, encoders, features = obj['model'], obj['encoders'], obj['features']
    classes = obj['classes']
    row = []
    for feat in features:
        val = data.get(feat, 0)
        if feat in encoders:
            try:    val = int(encoders[feat].transform([str(val)])[0])
            except: val = 0
        row.append(float(val))
    X = np.array([row])
    pred_idx = int(model.predict(X)[0])
    proba = model.predict_proba(X)[0]
    return {'risk_level': classes[pred_idx],
            'confidence': round(float(max(proba)) * 100, 1),
            'probabilities': {c: round(float(p) * 100, 1) for c, p in zip(classes, proba)}}

import pickle, os
import numpy as np

BASE = os.path.dirname(__file__)

def predict(data: dict) -> dict:
    with open(os.path.join(BASE, 'travel_rec_model.pkl'), 'rb') as f:
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
    top3 = sorted(zip(classes, proba), key=lambda x: -x[1])[:3]
    return {'recommendation': classes[pred_idx],
            'confidence': round(float(max(proba)) * 100, 1),
            'top3': [{'destination': d, 'score': round(float(p) * 100, 1)} for d, p in top3]}

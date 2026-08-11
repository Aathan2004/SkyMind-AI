import pickle, os
import numpy as np

BASE = os.path.dirname(__file__)

def predict(data: dict) -> dict:
    with open(os.path.join(BASE, 'sentiment_model.pkl'), 'rb') as f:
        obj = pickle.load(f)
    pipeline, encoder, classes = obj['pipeline'], obj['encoder'], obj['classes']
    text = data.get('review_text', '')
    pred_idx = int(pipeline.predict([text])[0])
    proba = pipeline.predict_proba([text])[0]
    return {'sentiment': classes[pred_idx],
            'confidence': round(float(max(proba)) * 100, 1),
            'scores': {c: round(float(p) * 100, 1) for c, p in zip(classes, proba)}}

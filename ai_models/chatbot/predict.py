import pickle, os
import numpy as np

BASE = os.path.dirname(__file__)

def predict(data: dict) -> dict:
    with open(os.path.join(BASE, 'chatbot_model.pkl'), 'rb') as f:
        obj = pickle.load(f)
    pipeline, encoder = obj['pipeline'], obj['encoder']
    classes, responses = obj['classes'], obj['responses']
    query = data.get('query', '')
    pred_idx = int(pipeline.predict([query])[0])
    proba = pipeline.predict_proba([query])[0]
    intent = classes[pred_idx]
    return {'intent': intent,
            'response': responses.get(intent, responses['general']),
            'confidence': round(float(max(proba)) * 100, 1)}

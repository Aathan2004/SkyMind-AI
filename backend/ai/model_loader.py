import pickle, json, os

_models = {}
_meta   = {}

BASE = os.path.join(os.path.dirname(__file__), '../../ai_models')

MODEL_REGISTRY = {
    'delay':        ('delay_prediction',       'delay_model.pkl'),
    'price':        ('price_prediction',       'price_model.pkl'),
    'no_show':      ('no_show',                'no_show_model.pkl'),
    'cancellation': ('cancellation',           'cancellation_model.pkl'),
    'satisfaction': ('satisfaction',           'satisfaction_model.pkl'),
    'airline_rec':  ('airline_recommendation', 'airline_rec_model.pkl'),
    'travel_rec':   ('travel_recommendation',  'travel_rec_model.pkl'),
    'sentiment':    ('sentiment',              'sentiment_model.pkl'),
    'chatbot':      ('chatbot',                'chatbot_model.pkl'),
    'maintenance':  ('maintenance',            'maintenance_model.pkl'),
    'weather':      ('weather',                'weather_model.pkl'),
    'route':        ('route_optimization',     'route_model.pkl'),
    'fuel':         ('fuel_consumption',       'fuel_model.pkl'),
    'carbon':       ('carbon_emission',        'carbon_model.pkl'),
    'congestion':   ('airport_congestion',     'congestion_model.pkl'),
}

def load_all_models():
    for key, (folder, pkl) in MODEL_REGISTRY.items():
        pkl_path  = os.path.join(BASE, folder, pkl)
        meta_path = os.path.join(BASE, folder, 'model_meta.json')
        if os.path.exists(pkl_path):
            with open(pkl_path, 'rb') as f:
                _models[key] = pickle.load(f)
            print(f"  Loaded model: {key}")
        if os.path.exists(meta_path):
            with open(meta_path) as f:
                _meta[key] = json.load(f)

def get_model(name: str):
    return _models.get(name)

def get_meta(name: str) -> dict:
    return _meta.get(name, {})

def get_all_meta() -> dict:
    return {k: _meta.get(k, {}) for k in MODEL_REGISTRY}

import numpy as np
import pickle

def predict(user_features: list, n_recommendations: int = 5) -> list:
    with open("recommendation_model.pkl", "rb") as f:
        model = pickle.load(f)
    distances, indices = model.kneighbors(np.array([user_features]))
    return indices[0].tolist()

import numpy as np
import pickle
from sklearn.neighbors import NearestNeighbors

np.random.seed(7)
n = 500
X = np.random.rand(n, 8)

model = NearestNeighbors(n_neighbors=5)
model.fit(X)

with open("recommendation_model.pkl", "wb") as f:
    pickle.dump(model, f)

print("recommendation_model.pkl saved")

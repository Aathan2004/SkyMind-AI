"""
Model 7: Travel Recommendation Engine
Algorithm: Random Forest Classifier
"""
import pandas as pd, pickle, json, os
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score

BASE = os.path.dirname(__file__)
DATA = os.path.join(BASE, '../datasets/travel_recommendation.csv')
df = pd.read_csv(DATA)

cat_cols = ['origin','season','trip_type','recommended_dest']
encoders = {}
for col in cat_cols:
    le = LabelEncoder()
    df[col] = le.fit_transform(df[col])
    encoders[col] = le

FEATURES = ['origin','season','budget_usd','trip_type','duration_days','past_destinations']
TARGET = 'recommended_dest'

X, y = df[FEATURES], df[TARGET]
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = RandomForestClassifier(n_estimators=200, max_depth=8, random_state=42)
model.fit(X_train, y_train)

acc = round(accuracy_score(y_test, model.predict(X_test)) * 100, 2)
importance = {k: round(float(v), 4) for k, v in zip(FEATURES, model.feature_importances_)}
dest_classes = encoders['recommended_dest'].classes_.tolist()

with open(os.path.join(BASE, 'travel_rec_model.pkl'), 'wb') as f:
    pickle.dump({'model': model, 'encoders': encoders, 'features': FEATURES,
                 'classes': dest_classes}, f)

json.dump({'accuracy': acc, 'feature_importance': importance,
           'algorithm': 'RandomForestClassifier', 'target': TARGET,
           'classes': dest_classes, 'n_features': len(FEATURES)},
          open(os.path.join(BASE, 'model_meta.json'), 'w'), indent=2)

print(f"[7] Travel Recommendation  | Accuracy: {acc}%")

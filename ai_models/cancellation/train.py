"""
Model 4: Flight Cancellation Prediction
Algorithm: XGBoost Classifier
"""
import pandas as pd, pickle, json, os
from xgboost import XGBClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score

BASE = os.path.dirname(__file__)
DATA = os.path.join(BASE, '../datasets/cancellation.csv')
df = pd.read_csv(DATA)

cat_cols = ['season','airline']
encoders = {}
for col in cat_cols:
    le = LabelEncoder()
    df[col] = le.fit_transform(df[col])
    encoders[col] = le

FEATURES = ['weather_score','aircraft_age_years','crew_availability','atc_restrictions',
            'season','route_distance_km','airline','prev_cancellations','is_international']
TARGET = 'cancelled'

X, y = df[FEATURES], df[TARGET]
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = XGBClassifier(n_estimators=200, max_depth=5, learning_rate=0.1,
                      eval_metric='logloss', random_state=42)
model.fit(X_train, y_train, eval_set=[(X_test, y_test)], verbose=False)

acc = round(accuracy_score(y_test, model.predict(X_test)) * 100, 2)
importance = {k: round(float(v), 4) for k, v in zip(FEATURES, model.feature_importances_)}

with open(os.path.join(BASE, 'cancellation_model.pkl'), 'wb') as f:
    pickle.dump({'model': model, 'encoders': encoders, 'features': FEATURES}, f)

json.dump({'accuracy': acc, 'feature_importance': importance,
           'algorithm': 'XGBClassifier', 'target': TARGET, 'n_features': len(FEATURES)},
          open(os.path.join(BASE, 'model_meta.json'), 'w'), indent=2)

print(f"[4] Cancellation Prediction  | Accuracy: {acc}%")

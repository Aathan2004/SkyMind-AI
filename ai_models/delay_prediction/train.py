"""
Model 1: Flight Delay Prediction
Algorithm: XGBoost Regressor
"""
import pandas as pd, numpy as np, pickle, json, os
from xgboost import XGBRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import mean_absolute_error, r2_score

BASE = os.path.dirname(__file__)
DATA = os.path.join(BASE, '../datasets/flight_delay.csv')
df = pd.read_csv(DATA)

cat_cols = ['origin', 'destination', 'aircraft_type', 'airline']
encoders = {}
for col in cat_cols:
    le = LabelEncoder()
    df[col] = le.fit_transform(df[col])
    encoders[col] = le

FEATURES = ['departure_hour','day_of_week','month','origin','destination',
            'aircraft_type','airline','weather_score','atc_delay',
            'prev_flight_delay','distance_km']
TARGET = 'delay_minutes'

X, y = df[FEATURES], df[TARGET]
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = XGBRegressor(n_estimators=200, max_depth=6, learning_rate=0.1,
                     subsample=0.8, colsample_bytree=0.8, random_state=42)
model.fit(X_train, y_train, eval_set=[(X_test, y_test)], verbose=False)

y_pred = model.predict(X_test)
mae = mean_absolute_error(y_test, y_pred)
r2  = r2_score(y_test, y_pred)
accuracy = round(max(0, 1 - mae / (y_test.mean() + 1e-9)) * 100, 2)
importance = {k: round(float(v), 4) for k, v in zip(FEATURES, model.feature_importances_)}

with open(os.path.join(BASE, 'delay_model.pkl'), 'wb') as f:
    pickle.dump({'model': model, 'encoders': encoders, 'features': FEATURES}, f)

json.dump({'accuracy': accuracy, 'mae': round(mae, 2), 'r2': round(r2, 3),
           'feature_importance': importance, 'algorithm': 'XGBRegressor',
           'target': TARGET, 'n_features': len(FEATURES)},
          open(os.path.join(BASE, 'model_meta.json'), 'w'), indent=2)

print(f"[1] Delay Prediction  | Accuracy: {accuracy}%  MAE: {mae:.1f} min  R2: {r2:.3f}")

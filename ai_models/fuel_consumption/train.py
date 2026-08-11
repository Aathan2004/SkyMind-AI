"""
Model 13: Fuel Consumption Prediction
Algorithm: XGBoost Regressor
"""
import pandas as pd, pickle, json, os
from xgboost import XGBRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import mean_absolute_error, r2_score

BASE = os.path.dirname(__file__)
DATA = os.path.join(BASE, '../datasets/fuel_consumption.csv')
df = pd.read_csv(DATA)

cat_cols = ['aircraft_type']
encoders = {}
for col in cat_cols:
    le = LabelEncoder()
    df[col] = le.fit_transform(df[col])
    encoders[col] = le

FEATURES = ['aircraft_type','distance_km','passengers','cargo_kg','altitude_ft',
            'wind_speed_kmh','temperature_c','engine_age_years']
TARGET = 'fuel_kg'

X, y = df[FEATURES], df[TARGET]
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = XGBRegressor(n_estimators=200, max_depth=6, learning_rate=0.1, random_state=42)
model.fit(X_train, y_train, eval_set=[(X_test, y_test)], verbose=False)

y_pred = model.predict(X_test)
mae = mean_absolute_error(y_test, y_pred)
r2  = r2_score(y_test, y_pred)
accuracy = round(max(0, 1 - mae / (y_test.mean() + 1e-9)) * 100, 2)
importance = {k: round(float(v), 4) for k, v in zip(FEATURES, model.feature_importances_)}

with open(os.path.join(BASE, 'fuel_model.pkl'), 'wb') as f:
    pickle.dump({'model': model, 'encoders': encoders, 'features': FEATURES}, f)

json.dump({'accuracy': accuracy, 'mae': round(mae, 2), 'r2': round(r2, 3),
           'feature_importance': importance, 'algorithm': 'XGBRegressor',
           'target': TARGET, 'n_features': len(FEATURES)},
          open(os.path.join(BASE, 'model_meta.json'), 'w'), indent=2)

print(f"[13] Fuel Consumption  | Accuracy: {accuracy}%  MAE: {mae:.0f} kg  R2: {r2:.3f}")

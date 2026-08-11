"""
Model 10: Predictive Aircraft Maintenance
Algorithm: XGBoost Classifier
"""
import pandas as pd, pickle, json, os
from xgboost import XGBClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score

BASE = os.path.dirname(__file__)
DATA = os.path.join(BASE, '../datasets/maintenance.csv')
df = pd.read_csv(DATA)

cat_cols = ['aircraft_type']
encoders = {}
for col in cat_cols:
    le = LabelEncoder()
    df[col] = le.fit_transform(df[col])
    encoders[col] = le

FEATURES = ['aircraft_type','flight_hours','cycles','engine_temp_c','vibration_level',
            'oil_pressure_psi','hydraulic_pressure','age_years','last_maintenance_days']
TARGET = 'needs_maintenance'

X, y = df[FEATURES], df[TARGET]
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = XGBClassifier(n_estimators=200, max_depth=6, learning_rate=0.1,
                      eval_metric='logloss', random_state=42)
model.fit(X_train, y_train, eval_set=[(X_test, y_test)], verbose=False)

acc = round(accuracy_score(y_test, model.predict(X_test)) * 100, 2)
importance = {k: round(float(v), 4) for k, v in zip(FEATURES, model.feature_importances_)}

with open(os.path.join(BASE, 'maintenance_model.pkl'), 'wb') as f:
    pickle.dump({'model': model, 'encoders': encoders, 'features': FEATURES}, f)

json.dump({'accuracy': acc, 'feature_importance': importance,
           'algorithm': 'XGBClassifier', 'target': TARGET, 'n_features': len(FEATURES)},
          open(os.path.join(BASE, 'model_meta.json'), 'w'), indent=2)

print(f"[10] Maintenance Prediction  | Accuracy: {acc}%")

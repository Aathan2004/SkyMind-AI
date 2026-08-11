"""
Model 5: Passenger Satisfaction Prediction
Algorithm: Random Forest Classifier
"""
import pandas as pd, pickle, json, os
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score

BASE = os.path.dirname(__file__)
DATA = os.path.join(BASE, '../datasets/satisfaction.csv')
df = pd.read_csv(DATA)

cat_cols = ['seat_class']
encoders = {}
for col in cat_cols:
    le = LabelEncoder()
    df[col] = le.fit_transform(df[col])
    encoders[col] = le

le_target = LabelEncoder()
df['satisfaction'] = le_target.fit_transform(df['satisfaction'])
encoders['satisfaction'] = le_target

FEATURES = ['seat_class','flight_delay_min','seat_comfort','food_quality','staff_service',
            'entertainment','cleanliness','wifi_quality','checkin_ease','flight_distance_km']
TARGET = 'satisfaction'

X, y = df[FEATURES], df[TARGET]
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = RandomForestClassifier(n_estimators=200, max_depth=8, random_state=42)
model.fit(X_train, y_train)

acc = round(accuracy_score(y_test, model.predict(X_test)) * 100, 2)
importance = {k: round(float(v), 4) for k, v in zip(FEATURES, model.feature_importances_)}

with open(os.path.join(BASE, 'satisfaction_model.pkl'), 'wb') as f:
    pickle.dump({'model': model, 'encoders': encoders, 'features': FEATURES,
                 'classes': le_target.classes_.tolist()}, f)

json.dump({'accuracy': acc, 'feature_importance': importance,
           'algorithm': 'RandomForestClassifier', 'target': TARGET,
           'classes': le_target.classes_.tolist(), 'n_features': len(FEATURES)},
          open(os.path.join(BASE, 'model_meta.json'), 'w'), indent=2)

print(f"[5] Satisfaction Prediction  | Accuracy: {acc}%")

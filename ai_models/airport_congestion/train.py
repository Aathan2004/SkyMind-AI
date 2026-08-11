"""
Model 15: Airport Congestion Prediction
Algorithm: XGBoost Classifier
"""
import pandas as pd, pickle, json, os
from xgboost import XGBClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score

BASE = os.path.dirname(__file__)
DATA = os.path.join(BASE, '../datasets/airport_congestion.csv')
df = pd.read_csv(DATA)

cat_cols = ['airport']
encoders = {}
for col in cat_cols:
    le = LabelEncoder()
    df[col] = le.fit_transform(df[col])
    encoders[col] = le

le_target = LabelEncoder()
df['congestion_level'] = le_target.fit_transform(df['congestion_level'])
encoders['congestion_level'] = le_target

FEATURES = ['airport','hour_of_day','day_of_week','month','flights_per_hour',
            'gate_utilization_pct','runway_utilization_pct','avg_taxi_time_min','weather_score']
TARGET = 'congestion_level'

X, y = df[FEATURES], df[TARGET]
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = XGBClassifier(n_estimators=200, max_depth=5, learning_rate=0.1,
                      eval_metric='mlogloss', random_state=42)
model.fit(X_train, y_train, eval_set=[(X_test, y_test)], verbose=False)

acc = round(accuracy_score(y_test, model.predict(X_test)) * 100, 2)
importance = {k: round(float(v), 4) for k, v in zip(FEATURES, model.feature_importances_)}

with open(os.path.join(BASE, 'congestion_model.pkl'), 'wb') as f:
    pickle.dump({'model': model, 'encoders': encoders, 'features': FEATURES,
                 'classes': le_target.classes_.tolist()}, f)

json.dump({'accuracy': acc, 'feature_importance': importance,
           'algorithm': 'XGBClassifier', 'target': TARGET,
           'classes': le_target.classes_.tolist(), 'n_features': len(FEATURES)},
          open(os.path.join(BASE, 'model_meta.json'), 'w'), indent=2)

print(f"[15] Airport Congestion  | Accuracy: {acc}%")

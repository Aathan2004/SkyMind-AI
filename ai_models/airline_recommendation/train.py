"""
Model 6: Airline Recommendation Engine
Algorithm: Random Forest Classifier
"""
import pandas as pd, pickle, json, os
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score

BASE = os.path.dirname(__file__)
DATA = os.path.join(BASE, '../datasets/airline_recommendation.csv')
df = pd.read_csv(DATA)

cat_cols = ['preferred_class','preferred_airline','loyalty_tier','recommended_airline']
encoders = {}
for col in cat_cols:
    le = LabelEncoder()
    df[col] = le.fit_transform(df[col])
    encoders[col] = le

FEATURES = ['preferred_class','budget_usd','preferred_airline','avg_rating_given',
            'trips_per_year','loyalty_tier','prefers_direct']
TARGET = 'recommended_airline'

X, y = df[FEATURES], df[TARGET]
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = RandomForestClassifier(n_estimators=200, max_depth=8, random_state=42)
model.fit(X_train, y_train)

acc = round(accuracy_score(y_test, model.predict(X_test)) * 100, 2)
importance = {k: round(float(v), 4) for k, v in zip(FEATURES, model.feature_importances_)}
airline_classes = encoders['recommended_airline'].classes_.tolist()

with open(os.path.join(BASE, 'airline_rec_model.pkl'), 'wb') as f:
    pickle.dump({'model': model, 'encoders': encoders, 'features': FEATURES,
                 'classes': airline_classes}, f)

json.dump({'accuracy': acc, 'feature_importance': importance,
           'algorithm': 'RandomForestClassifier', 'target': TARGET,
           'classes': airline_classes, 'n_features': len(FEATURES)},
          open(os.path.join(BASE, 'model_meta.json'), 'w'), indent=2)

print(f"[6] Airline Recommendation  | Accuracy: {acc}%")

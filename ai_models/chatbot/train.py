"""
Model 9: AI Chatbot Intent Classifier
Algorithm: TF-IDF + Logistic Regression
"""
import pandas as pd, pickle, json, os
from sklearn.linear_model import LogisticRegression
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score
from sklearn.pipeline import Pipeline

BASE = os.path.dirname(__file__)
DATA = os.path.join(BASE, '../datasets/chatbot_intents.csv')
df = pd.read_csv(DATA)

le = LabelEncoder()
df['intent_enc'] = le.fit_transform(df['intent'])

X, y = df['query'], df['intent_enc']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

pipeline = Pipeline([
    ('tfidf', TfidfVectorizer(max_features=300, ngram_range=(1, 2))),
    ('clf',   LogisticRegression(max_iter=500, C=5.0, random_state=42)),
])
pipeline.fit(X_train, y_train)

acc = round(accuracy_score(y_test, pipeline.predict(X_test)) * 100, 2)

RESPONSES = {
    'booking':      'To book a flight, visit our booking page or use the search above.',
    'delay_info':   'You can check real-time delay info in the Operations Center.',
    'baggage':      'Standard allowance: 23kg checked, 7kg cabin. Business: 32kg.',
    'cancellation': 'To cancel, go to My Bookings and select Cancel. Refunds take 5-7 days.',
    'check_in':     'Online check-in opens 48 hours before departure.',
    'refund':       'Refunds are processed within 5-7 business days to your original payment.',
    'upgrade':      'Upgrades can be requested at check-in or via the Manage Booking page.',
    'general':      'I am SkyMind AI assistant. How can I help you today?',
}

with open(os.path.join(BASE, 'chatbot_model.pkl'), 'wb') as f:
    pickle.dump({'pipeline': pipeline, 'encoder': le,
                 'classes': le.classes_.tolist(), 'responses': RESPONSES}, f)

json.dump({'accuracy': acc, 'feature_importance': {'intents': le.classes_.tolist()},
           'algorithm': 'TF-IDF + LogisticRegression', 'target': 'intent',
           'classes': le.classes_.tolist(), 'n_features': 300},
          open(os.path.join(BASE, 'model_meta.json'), 'w'), indent=2)

print(f"[9] Chatbot Intent Classifier  | Accuracy: {acc}%")

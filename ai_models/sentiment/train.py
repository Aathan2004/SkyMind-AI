"""
Model 8: Sentiment Analysis
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
DATA = os.path.join(BASE, '../datasets/sentiment.csv')
df = pd.read_csv(DATA)

le = LabelEncoder()
df['sentiment_enc'] = le.fit_transform(df['sentiment'])

X, y = df['review_text'], df['sentiment_enc']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

pipeline = Pipeline([
    ('tfidf', TfidfVectorizer(max_features=500, ngram_range=(1, 2))),
    ('clf',   LogisticRegression(max_iter=500, random_state=42)),
])
pipeline.fit(X_train, y_train)

acc = round(accuracy_score(y_test, pipeline.predict(X_test)) * 100, 2)
importance = {'tfidf_features': 500, 'ngram_range': '(1,2)', 'algorithm': 'LogisticRegression'}

with open(os.path.join(BASE, 'sentiment_model.pkl'), 'wb') as f:
    pickle.dump({'pipeline': pipeline, 'encoder': le, 'classes': le.classes_.tolist()}, f)

json.dump({'accuracy': acc, 'feature_importance': importance,
           'algorithm': 'TF-IDF + LogisticRegression', 'target': 'sentiment',
           'classes': le.classes_.tolist(), 'n_features': 500},
          open(os.path.join(BASE, 'model_meta.json'), 'w'), indent=2)

print(f"[8] Sentiment Analysis  | Accuracy: {acc}%")

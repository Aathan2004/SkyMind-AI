# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

SkyMind AI — a flight analytics platform (final-year AI & DS project). React/TypeScript SPA talking to a FastAPI backend that serves 15 scikit-learn/XGBoost models pickled to disk, plus SQLite-backed auth, flights, and passenger bookings.

## Commands

### Backend (run from `backend/`, not repo root — imports are root-relative to this dir)
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload      # http://localhost:8000, Swagger at /docs
```

### Frontend (run from `frontend/`)
```bash
cd frontend
npm install
npm run dev        # http://localhost:5173
npm run build       # tsc typecheck + vite build
npm run preview
```

### Retrain an AI model
Each model directory under `ai_models/` is self-contained; run its `train.py` from within that directory to regenerate the `.pkl` and `model_meta.json`:
```bash
cd ai_models/delay_prediction && python train.py
```
`ai_models/datasets/generate_all_datasets.py` (and `regenerate_datasets.py`) regenerate the synthetic CSVs those trainers read from.

### Docker (full stack)
```bash
docker-compose -f docker/docker-compose.yml up --build
```

There are no test suites or linters configured in this repo currently.

## Architecture

```
[React + TS + Tailwind]  --HTTP (Axios)-->  [FastAPI]
                                              ├── routers/ (auth, flights, passenger, predictions)
                                              ├── services/ (flight_service — used; prediction_service — dead code, see below)
                                              ├── auth/ (JWT via python-jose, bcrypt via passlib)
                                              ├── database/ (SQLAlchemy, SQLite at backend/skymind.db)
                                              └── ai/model_loader.py -> ai_models/*/*.pkl (scikit-learn/XGBoost)
```

### Backend layout (`backend/`)
- `main.py` — app entrypoint. Creates all DB tables via `Base.metadata.create_all`, calls `load_all_models()` at startup (all 15 pickles are loaded into memory once, not per-request), then mounts routers.
- `routers/predictions.py` — **the actual inference logic lives here**, not in `services/`. Each of the 15 endpoints (`/api/predictions/{delay,price,no-show,cancellation,satisfaction,airline-recommendation,travel-recommendation,sentiment,chatbot,maintenance,weather,route,fuel,carbon,congestion}`) defines its own Pydantic input model, pulls a loaded model+encoders out of `ai.model_loader`, encodes categorical fields via `_encode()`, runs `_infer_reg`/`_infer_clf` (or inline logic for multi-class classifiers), and writes a row to `prediction_history` via `_save_history`. When adding a new model, follow this same pattern rather than introducing a new abstraction layer.
- `ai/model_loader.py` — the `MODEL_REGISTRY` dict maps a short key (e.g. `'delay'`) to a `(folder, pkl_filename)` pair under `ai_models/`. This registry is the single source of truth for which models exist and where their pickles/`model_meta.json` live.
- `ai/delay_model.py`, `ai/price_model.py`, `services/prediction_service.py` — **dead code**, superseded by `model_loader.py` + `routers/predictions.py`. Not imported by `main.py`. Don't extend these; they're leftover from an earlier design.
- `services/flight_service.py` — the one service module actually in use, backing `routers/flights.py`.
- Model imports throughout the backend are root-relative (`from app.config import settings`, `from ai.model_loader import ...`, etc. — not `backend.app...`), which is why the server must be launched with `backend/` as the working directory.
- Auth: JWT access + refresh tokens (`auth/jwt_handler.py`), password hashing via passlib/bcrypt. `get_current_user` (`auth/dependencies.py`) is the standard `Depends()` guard used across all protected routes.

### AI models (`ai_models/`)
Each of the 15 subdirectories (`delay_prediction/`, `price_prediction/`, `no_show/`, `cancellation/`, `satisfaction/`, `airline_recommendation/`, `travel_recommendation/`, `sentiment/`, `chatbot/`, `maintenance/`, `weather/`, `route_optimization/`, `fuel_consumption/`, `carbon_emission/`, `airport_congestion/`) follows the same shape:
- `train.py` — reads a CSV from `ai_models/datasets/`, label-encodes categorical columns, fits a scikit-learn/XGBoost model, pickles `{model, encoders, features[, classes]}` to `<name>_model.pkl`, and writes accuracy/feature-importance metrics to `model_meta.json`.
- `predict.py` — a standalone loader/predict helper for the model, kept for reference/manual testing. **The FastAPI backend does not import these** — it reloads the pickle itself through `ai/model_loader.py` and duplicates the inference logic in `routers/predictions.py`. If you change a model's feature set or output shape, update both `train.py` and the corresponding endpoint in `routers/predictions.py` (and `predict.py` if you want it to stay accurate).
- `model_meta.json` is served directly to the frontend via `GET /api/predictions/meta` / `/meta/{model_name}` — it's the source for any "model accuracy/feature importance" UI, not just a training artifact.

### Frontend layout (`frontend/src/`)
- `App.tsx` — all routing. Public routes under `MainLayout` (`/`, `/login`); everything under `/dashboard/*` is wrapped in `ProtectedDashboard` (redirects to `/login` if `AppContext`'s `isAuthenticated` is false) and rendered inside `DashboardLayout`.
- `dashboard/` — one folder per major dashboard section (`admin/`, `ai/`, `analytics/`, `flights/`, `operations/`, `passenger/`, `settings/`), plus top-level pages (`Overview.tsx`, `DelayPredictor.tsx`, `PricePredictor.tsx`). `WorkspacePage.tsx` is a generic placeholder page parameterized by a `kind` prop, used for sections (`aircraft`, `airport`, `crew`, `notifications`, `profile`, `support`) that don't yet have a bespoke view.
- `context/AppContext.tsx` — global provider for theme (light/dark/system), language, currency, and auth state (`user`, `isAuthenticated`, `isAuthLoading`). Auth state is hydrated on mount by calling `refreshSession()` if a token exists in storage.
- `services/api.ts` — the shared Axios instance. Reads the bearer token from `localStorage` or `sessionStorage` (remember-me vs session-only login), and on a `401` response clears all auth storage keys client-side (no auto-redirect — callers/`AppContext` handle that via `isAuthenticated`).
- `services/authService.ts`, `aiService.ts`, `passengerService.ts` — API wrappers per domain, all built on `services/api.ts`.
- Backend base URL is configured via `VITE_API_BASE_URL`, defaulting to `http://localhost:8000`.

### Data model (SQLite via SQLAlchemy, `backend/models/`)
- `User` — auth identity, `role` field (default `"user"`) gates admin-only behavior.
- `Flight` — flight catalog (`flight_number`, `origin`/`destination`, times, `price`, `status`).
- `PassengerBooking` — a booking against a `Flight`, keyed by `user_email` (not a FK), with its own payment/booking status lifecycle (`pending`→`paid`/`failed`, `confirmed`→`cancelled`).
- `PredictionHistory` — append-only log of every prediction call (`model_name`, JSON-serialized `input_data`/`result`, `confidence`, `user_email`); backs `GET /api/predictions/history`.

Tables are created automatically at startup (`Base.metadata.create_all`) — there is no migration tool (e.g. Alembic); schema changes to `backend/models/*.py` take effect on next server start against the existing `skymind.db` (additive changes only; you'll need to delete `backend/skymind.db` to pick up column changes/renames).

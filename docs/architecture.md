# Architecture Overview

## System Design

```
[React + TypeScript + Tailwind]
        ↓ HTTP (Axios)
[FastAPI Backend]
   ├── Auth (JWT)
   ├── Routers → Services → SQLite (SQLAlchemy)
   └── AI Layer → .pkl Models (scikit-learn)
```

## Layers
- Frontend: Vite + React SPA, communicates via REST API
- Backend: FastAPI with layered architecture (router → service → db)
- Auth: JWT tokens via python-jose + bcrypt password hashing
- Database: SQLite via SQLAlchemy ORM
- AI: scikit-learn models serialized as .pkl, loaded at startup

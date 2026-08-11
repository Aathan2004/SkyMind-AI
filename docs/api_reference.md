# API Reference

Base URL: `http://localhost:8000`

## Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login, returns JWT token |

## Flights
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/flights/` | List all flights |
| GET | `/api/flights/{id}` | Get flight by ID |

## Predictions
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/predictions/delay` | Predict flight delay |
| POST | `/api/predictions/price` | Predict ticket price |

All prediction endpoints require `Authorization: Bearer <token>` header.

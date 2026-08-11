# SkyMind AI — Setup Guide

## Prerequisites
- Python 3.11+
- Node.js 20+

## Backend Setup
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```
API runs at: http://localhost:8000
Swagger docs: http://localhost:8000/docs

## Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
App runs at: http://localhost:5173

## Train AI Models
```bash
cd ai_models/delay_prediction && python train.py
cd ai_models/price_prediction && python train.py
```

## Docker (Full Stack)
```bash
docker-compose -f docker/docker-compose.yml up --build
```

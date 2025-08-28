@echo off
echo Starting FastAPI ぶいざっぷ Backend...
cd backend
echo Installing dependencies...
pip install -r requirements.txt
echo Starting server on http://localhost:8000
python main.py

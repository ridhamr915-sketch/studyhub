@echo off
echo ==========================================================
echo Starting StudyHub 1.0 Backend Server (FastAPI)
echo http://127.0.0.1:8000
echo Documentation: http://127.0.0.1:8000/docs
echo ==========================================================
cd /d "%~dp0backend"
set PYTHONPATH=%~dp0backend
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
pause

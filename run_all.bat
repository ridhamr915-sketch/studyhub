@echo off
echo ==========================================================
echo Starting StudyHub 1.0 Full-Stack Application
echo ==========================================================
start "StudyHub 1.0 Backend" cmd /k "%~dp0run_backend.bat"
timeout /t 3 /nobreak >nul
start "StudyHub 1.0 Frontend" cmd /k "%~dp0run_frontend.bat"
echo Both servers launched!
echo Access frontend at: http://localhost:5173
echo Access backend API docs at: http://127.0.0.1:8000/docs

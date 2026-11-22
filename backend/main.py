import os
import sys

# Ensure backend root is in Python sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.core.config import settings
from app.api.router import api_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="StudyHub 1.0 - AI-Based Study Resource Organizer Backend API (FastAPI + Supabase + Gemini API)"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount local uploads for static file serving
if os.path.exists(settings.UPLOAD_DIR):
    app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# Include Core API Router
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "status": "online",
        "app": "StudyHub 1.0 - AI-Based Study Resource Organizer",
        "version": settings.VERSION,
        "docs": "/docs",
        "health": "OK"
    }

@app.get("/health")
def health_check():
    from app.services.gemini_service import gemini_service
    from app.db.supabase_client import is_supabase_configured
    
    return {
        "status": "healthy",
        "supabase_connected": is_supabase_configured(),
        "gemini_service": gemini_service.check_connection(),
        "storage_mode": "Supabase Cloud + Local Mirror" if is_supabase_configured() else "Local File Storage (Ready for Supabase)"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)

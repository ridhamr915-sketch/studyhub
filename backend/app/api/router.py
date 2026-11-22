from fastapi import APIRouter
from app.api.subjects import router as subjects_router
from app.api.resources import router as resources_router
from app.api.assistant import router as assistant_router
from app.api.notes import router as notes_router
from app.api.quizzes import router as quizzes_router
from app.api.flashcards import router as flashcards_router
from app.api.planner import router as planner_router
from app.api.analytics import router as analytics_router

api_router = APIRouter()

api_router.include_router(subjects_router, prefix="/subjects", tags=["Subjects"])
api_router.include_router(resources_router, prefix="/resources", tags=["Resources"])
api_router.include_router(assistant_router, prefix="/assistant", tags=["AI Assistant"])
api_router.include_router(notes_router, prefix="/notes", tags=["AI Notes Generator"])
api_router.include_router(quizzes_router, prefix="/quizzes", tags=["Quizzes"])
api_router.include_router(flashcards_router, prefix="/flashcards", tags=["Flashcards"])
api_router.include_router(planner_router, prefix="/planner", tags=["Study Planner"])
api_router.include_router(analytics_router, prefix="/analytics", tags=["Analytics"])

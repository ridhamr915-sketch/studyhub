from datetime import datetime, date, timedelta
from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query
from app.schemas.models import TaskCreate, TaskUpdate, TaskResponse
from app.db.local_store import local_store

router = APIRouter()

@router.get("/tasks", response_model=List[TaskResponse])
def get_tasks(
    task_date: Optional[str] = Query(None),
    is_completed: Optional[bool] = Query(None),
    task_type: Optional[str] = Query(None)
):
    tasks = local_store.get_tasks()
    if task_date:
        tasks = [t for t in tasks if t.get("task_date") == task_date]
    if is_completed is not None:
        tasks = [t for t in tasks if t.get("is_completed") == is_completed]
    if task_type:
        tasks = [t for t in tasks if t.get("task_type") == task_type]
    return tasks

@router.post("/tasks", response_model=TaskResponse)
def create_task(payload: TaskCreate):
    data = payload.model_dump() if hasattr(payload, 'model_dump') else payload.dict()
    return local_store.add_task(data)

@router.put("/tasks/{task_id}", response_model=TaskResponse)
def update_task(task_id: str, payload: TaskUpdate):
    data = payload.model_dump(exclude_unset=True) if hasattr(payload, 'model_dump') else payload.dict(exclude_unset=True)
    updated = local_store.update_task(task_id, data)
    if not updated:
        raise HTTPException(status_code=404, detail="Task not found")
    return updated

@router.delete("/tasks/{task_id}")
def delete_task(task_id: str):
    success = local_store.delete_task(task_id)
    if not success:
        raise HTTPException(status_code=404, detail="Task not found")
    return {"message": "Task deleted successfully"}

@router.get("/deadlines")
def get_upcoming_deadlines():
    today = date.today().isoformat()
    tasks = local_store.get_tasks()
    upcoming = [
        t for t in tasks 
        if not t.get("is_completed") and t.get("deadline")
    ]
    upcoming.sort(key=lambda x: x.get("deadline") or "")
    
    # Calculate days remaining
    results = []
    for t in upcoming:
        dl_str = t.get("deadline", "")
        days_left = 0
        try:
            dl_dt = datetime.fromisoformat(dl_str.replace("Z", "+00:00")).date()
            days_left = (dl_dt - date.today()).days
        except Exception:
            pass
        results.append({
            **t,
            "days_remaining": days_left
        })
    return results

@router.get("/timetable")
def get_weekly_timetable():
    """Provides a balanced weekly BTech study schedule recommendation."""
    subjects = local_store.get_subjects()
    sub_names = [s["name"] for s in subjects] if subjects else ["DSA", "Discrete Math", "Digital Electronics", "COA"]
    
    schedule = {
        "Monday": [
            {"time": "09:00 - 10:30", "subject": sub_names[0] if len(sub_names) > 0 else "Self Study", "activity": "Lecture & Code Lab"},
            {"time": "14:00 - 15:30", "subject": sub_names[1] if len(sub_names) > 1 else "Self Study", "activity": "Problem Solving"}
        ],
        "Tuesday": [
            {"time": "10:00 - 11:30", "subject": sub_names[2] if len(sub_names) > 2 else "Self Study", "activity": "Circuit Simulation"},
            {"time": "15:00 - 16:30", "subject": sub_names[3] if len(sub_names) > 3 else "Self Study", "activity": "Architecture Review"}
        ],
        "Wednesday": [
            {"time": "09:00 - 11:00", "subject": sub_names[0] if len(sub_names) > 0 else "Self Study", "activity": "Data Structures Practice"},
            {"time": "14:30 - 16:00", "subject": "AI Assistant Study", "activity": "PDF Notes Review"}
        ],
        "Thursday": [
            {"time": "11:00 - 12:30", "subject": sub_names[1] if len(sub_names) > 1 else "Self Study", "activity": "Logic & Combinatorics"},
            {"time": "16:00 - 17:00", "subject": "Quiz & Flashcards", "activity": "Self Assessment"}
        ],
        "Friday": [
            {"time": "09:30 - 11:00", "subject": sub_names[3] if len(sub_names) > 3 else "Self Study", "activity": "Pipeline Hazards & Cache"},
            {"time": "14:00 - 16:00", "subject": "Mini-Project Work", "activity": "Project Lab"}
        ],
        "Saturday": [
            {"time": "10:00 - 12:00", "subject": "Weekly Revision", "activity": "Summary Notes Generation"},
            {"time": "15:00 - 16:30", "subject": "Mock Test", "activity": "Attempt AI Quizzes"}
        ],
        "Sunday": [
            {"time": "11:00 - 12:00", "subject": "Study Planning", "activity": "Plan upcoming week tasks"}
        ]
    }
    return schedule

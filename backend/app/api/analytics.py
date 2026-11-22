from datetime import datetime, date, timedelta
from typing import List, Dict, Any
from fastapi import APIRouter
from app.db.local_store import local_store
from app.schemas.models import AnalyticsResponse

router = APIRouter()

@router.get("", response_model=AnalyticsResponse)
def get_analytics():
    subjects = local_store.get_subjects()
    resources = local_store.get_resources()
    tasks = local_store.get_tasks()
    attempts = local_store.get_quiz_attempts()

    total_tasks = len(tasks)
    completed_tasks = len([t for t in tasks if t.get("is_completed")])
    pending_tasks = total_tasks - completed_tasks

    # Quiz statistics
    quiz_attempts_count = len(attempts)
    if quiz_attempts_count > 0:
        avg_score = sum(a.get("percentage", 0) for a in attempts) / quiz_attempts_count
    else:
        avg_score = 0.0

    # Calculate weekly activity (last 7 days based on tasks and attempts)
    days_map = {}
    today = date.today()
    for i in range(6, -1, -1):
        day_date = today - timedelta(days=i)
        day_str = day_date.strftime("%a") # Mon, Tue, etc.
        iso_str = day_date.isoformat()
        days_map[iso_str] = {
            "day": day_str,
            "date": iso_str,
            "tasks_completed": 0,
            "quiz_attempts": 0,
            "study_hours": 0.0
        }

    for t in tasks:
        t_date = t.get("task_date")
        if t_date in days_map and t.get("is_completed"):
            days_map[t_date]["tasks_completed"] += 1
            days_map[t_date]["study_hours"] += 1.5

    for a in attempts:
        a_date = a.get("completed_at", "")[:10]
        if a_date in days_map:
            days_map[a_date]["quiz_attempts"] += 1
            days_map[a_date]["study_hours"] += 0.5

    weekly_activity = list(days_map.values())
    total_hours = sum(d["study_hours"] for d in weekly_activity)

    # Subject-wise progress (calculated from topic completion)
    subject_progress = []
    for sub in subjects:
        total_topics = 0
        completed_topics = 0
        for unit in sub.get("units", []):
            for top in unit.get("topics", []):
                total_topics += 1
                if top.get("is_completed"):
                    completed_topics += 1
                    
        pct = round((completed_topics / total_topics * 100), 1) if total_topics > 0 else 0
        subject_progress.append({
            "subject_id": sub.get("id"),
            "subject_name": sub.get("name"),
            "color": sub.get("color", "#7C3AED"),
            "total_topics": total_topics,
            "completed_topics": completed_topics,
            "completion_percentage": pct
        })

    return {
        "total_subjects": len(subjects),
        "total_resources": len(resources),
        "total_tasks": total_tasks,
        "completed_tasks": completed_tasks,
        "pending_tasks": pending_tasks,
        "quiz_attempts": quiz_attempts_count,
        "average_quiz_score": round(avg_score, 1),
        "study_time_hours": round(total_hours, 1),
        "weekly_activity": weekly_activity,
        "subject_progress": subject_progress
    }

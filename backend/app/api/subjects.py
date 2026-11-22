from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from app.schemas.models import (
    SubjectCreate, SubjectUpdate, SubjectResponse,
    UnitCreate, UnitResponse, TopicCreate, TopicResponse
)
from app.db.local_store import local_store
from app.db.supabase_client import get_supabase_client

router = APIRouter()

@router.get("", response_model=List[SubjectResponse])
def get_subjects():
    supabase = get_supabase_client()
    if supabase:
        try:
            res = supabase.table("subjects").select("*, units(*, topics(*))").execute()
            if res.data:
                return res.data
        except Exception:
            pass
    return local_store.get_subjects()

@router.post("", response_model=SubjectResponse)
def create_subject(payload: SubjectCreate):
    data = payload.model_dump() if hasattr(payload, 'model_dump') else payload.dict()
    new_sub = local_store.add_subject(data)
    supabase = get_supabase_client()
    if supabase:
        try:
            supabase.table("subjects").insert({
                "id": new_sub["id"],
                "name": new_sub["name"],
                "code": new_sub["code"],
                "semester": new_sub["semester"],
                "description": new_sub["description"],
                "color": new_sub["color"],
                "icon": new_sub["icon"],
                "is_demo": False
            }).execute()
        except Exception:
            pass
    return new_sub

@router.put("/{subject_id}", response_model=SubjectResponse)
def update_subject(subject_id: str, payload: SubjectUpdate):
    data = payload.model_dump(exclude_unset=True) if hasattr(payload, 'model_dump') else payload.dict(exclude_unset=True)
    updated = local_store.update_subject(subject_id, data)
    if not updated:
        raise HTTPException(status_code=404, detail="Subject not found")
    supabase = get_supabase_client()
    if supabase:
        try:
            supabase.table("subjects").update(data).eq("id", subject_id).execute()
        except Exception:
            pass
    return updated

@router.delete("/{subject_id}")
def delete_subject(subject_id: str):
    success = local_store.delete_subject(subject_id)
    if not success:
        raise HTTPException(status_code=404, detail="Subject not found")
    supabase = get_supabase_client()
    if supabase:
        try:
            supabase.table("subjects").delete().eq("id", subject_id).execute()
        except Exception:
            pass
    return {"message": "Subject deleted successfully"}

@router.post("/{subject_id}/units", response_model=UnitResponse)
def add_unit(subject_id: str, payload: UnitCreate):
    data = payload.model_dump() if hasattr(payload, 'model_dump') else payload.dict()
    unit = local_store.add_unit(subject_id, data)
    if not unit:
        raise HTTPException(status_code=404, detail="Subject not found")
    return unit

@router.post("/{subject_id}/units/{unit_id}/topics", response_model=TopicResponse)
def add_topic(subject_id: str, unit_id: str, payload: TopicCreate):
    data = payload.model_dump() if hasattr(payload, 'model_dump') else payload.dict()
    topic = local_store.add_topic(subject_id, unit_id, data)
    if not topic:
        raise HTTPException(status_code=404, detail="Subject or Unit not found")
    return topic

@router.post("/topics/{topic_id}/toggle")
def toggle_topic(topic_id: str):
    topic = local_store.toggle_topic(topic_id)
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")
    return {"message": "Topic status updated", "topic": topic}

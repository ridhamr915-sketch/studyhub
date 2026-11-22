from fastapi import APIRouter, HTTPException
from typing import List, Optional
from app.schemas.models import NotesGenerateRequest, NotesResponse, NotesUpdateRequest
from app.services.gemini_service import gemini_service
from app.db.local_store import local_store

router = APIRouter()

@router.get("", response_model=List[NotesResponse])
def get_notes():
    return local_store.get_notes()

@router.post("/generate", response_model=NotesResponse)
def generate_notes(payload: NotesGenerateRequest):
    topic = payload.topic_title or "General Engineering Concept"
    context = ""
    
    # Fetch resource context if attached
    if payload.resource_id:
        res = local_store.get_resource(payload.resource_id)
        if res:
            context = res.get("extracted_text", "")
            if not payload.topic_title:
                topic = res.get("title", "Study Document")

    # Call Gemini notes generation
    generated = gemini_service.generate_notes(
        topic=topic,
        document_context=context,
        note_type=payload.note_type
    )

    # Save to database
    saved_note = local_store.add_note({
        "subject_id": payload.subject_id,
        "resource_id": payload.resource_id,
        "topic_title": topic,
        "note_type": payload.note_type,
        "title": generated["title"],
        "content": generated["content"]
    })

    return saved_note

@router.put("/{note_id}", response_model=NotesResponse)
def update_note(note_id: str, payload: NotesUpdateRequest):
    updated = local_store.update_note(note_id, payload.dict(exclude_unset=True))
    if not updated:
        raise HTTPException(status_code=404, detail="Note not found")
    return updated

@router.delete("/{note_id}")
def delete_note(note_id: str):
    success = local_store.delete_note(note_id)
    if not success:
        raise HTTPException(status_code=404, detail="Note not found")
    return {"message": "Note deleted successfully"}

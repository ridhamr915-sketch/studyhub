from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from app.schemas.models import FlashcardCreate, FlashcardResponse, FlashcardGenerateRequest
from app.services.gemini_service import gemini_service
from app.db.local_store import local_store

router = APIRouter()

@router.get("", response_model=List[FlashcardResponse])
def get_flashcards(subject_id: Optional[str] = Query(None)):
    return local_store.get_flashcards(subject_id=subject_id)

@router.post("", response_model=FlashcardResponse)
def create_flashcard(payload: FlashcardCreate):
    data = payload.model_dump() if hasattr(payload, 'model_dump') else payload.dict()
    return local_store.add_flashcard(data)

@router.post("/generate", response_model=List[FlashcardResponse])
def generate_flashcards(payload: FlashcardGenerateRequest):
    topic = payload.deck_title or "Key Concepts"
    context = ""
    
    if payload.resource_id:
        res = local_store.get_resource(payload.resource_id)
        if res:
            context = res.get("extracted_text", "")
            if not payload.deck_title:
                topic = f"{res.get('title', 'Study')} Concepts"

    cards = gemini_service.generate_flashcards(
        topic=topic,
        document_context=context,
        count=payload.count
    )

    saved_cards = []
    for card in cards:
        saved = local_store.add_flashcard({
            "subject_id": payload.subject_id,
            "resource_id": payload.resource_id,
            "deck_title": topic,
            "front": card.get("front", ""),
            "back": card.get("back", "")
        })
        saved_cards.append(saved)

    return saved_cards

@router.post("/{fc_id}/star")
def toggle_star(fc_id: str):
    fc = local_store.toggle_flashcard_star(fc_id)
    if not fc:
        raise HTTPException(status_code=404, detail="Flashcard not found")
    return {"message": "Star updated", "flashcard": fc}

@router.delete("/{fc_id}")
def delete_flashcard(fc_id: str):
    success = local_store.delete_flashcard(fc_id)
    if not success:
        raise HTTPException(status_code=404, detail="Flashcard not found")
    return {"message": "Flashcard deleted successfully"}

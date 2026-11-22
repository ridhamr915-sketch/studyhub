from fastapi import APIRouter, HTTPException
from typing import List, Optional
from app.schemas.models import ChatMessageRequest, ChatMessageResponse, ChatSessionResponse
from app.services.gemini_service import gemini_service
from app.db.local_store import local_store

router = APIRouter()

@router.get("/status")
def get_assistant_status():
    """Checks whether the Gemini model or AI engine is live."""
    return gemini_service.check_connection()

@router.get("/sessions", response_model=List[ChatSessionResponse])
def get_sessions():
    return local_store.get_chat_sessions()

@router.get("/sessions/{session_id}", response_model=ChatSessionResponse)
def get_session(session_id: str):
    session = local_store.get_or_create_chat_session(session_id=session_id)
    return session

@router.post("/ask", response_model=ChatMessageResponse)
def ask_assistant(payload: ChatMessageRequest):
    if not payload.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty.")

    # 1. Fetch document context if a resource was selected
    document_context = ""
    resource_title = ""
    if payload.resource_id:
        res = local_store.get_resource(payload.resource_id)
        if res:
            document_context = res.get("extracted_text", "")
            resource_title = res.get("title", "Resource")

    # 2. Get or create chat session
    session_title = f"Q&A: {payload.question[:30]}..." if not payload.session_id else "Study Consultation"
    if resource_title:
        session_title = f"{resource_title} Chat"
        
    session = local_store.get_or_create_chat_session(
        session_id=payload.session_id,
        resource_id=payload.resource_id,
        title=session_title
    )
    session_id = session["id"]

    # 3. Record user question
    local_store.add_chat_message(
        session_id=session_id,
        role="user",
        content=payload.question
    )

    # 4. Generate grounded academic answer via Gemini
    ai_result = gemini_service.answer_question(
        question=payload.question,
        document_context=document_context,
        history=payload.history
    )

    # 5. Record assistant response
    assistant_msg = local_store.add_chat_message(
        session_id=session_id,
        role="assistant",
        content=ai_result["answer"],
        sources=ai_result.get("sources", [])
    )

    return assistant_msg

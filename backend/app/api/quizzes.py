from fastapi import APIRouter, HTTPException
from typing import List, Optional
from app.schemas.models import (
    QuizGenerateRequest, QuizResponse, QuizSubmission, 
    QuizAttemptResponse
)
from app.services.gemini_service import gemini_service
from app.db.local_store import local_store

router = APIRouter()

@router.post("/generate", response_model=QuizResponse)
def generate_quiz(payload: QuizGenerateRequest):
    topic = payload.topic or "Computer Science & Engineering"
    context = ""
    
    if payload.resource_id:
        res = local_store.get_resource(payload.resource_id)
        if res:
            context = res.get("extracted_text", "")
            if not payload.topic:
                topic = res.get("title", "Resource Topics")

    questions = gemini_service.generate_quiz(
        topic=topic,
        document_context=context,
        difficulty=payload.difficulty,
        count=payload.total_questions
    )

    saved_quiz = local_store.add_quiz({
        "subject_id": payload.subject_id,
        "resource_id": payload.resource_id,
        "title": f"{topic} ({payload.difficulty}) Quiz",
        "topic": topic,
        "difficulty": payload.difficulty,
        "questions": questions
    })

    return saved_quiz

@router.get("/{quiz_id}", response_model=QuizResponse)
def get_quiz(quiz_id: str):
    quiz = local_store.get_quiz(quiz_id)
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    return quiz

@router.post("/submit", response_model=QuizAttemptResponse)
def submit_quiz(payload: QuizSubmission):
    quiz = local_store.get_quiz(payload.quiz_id)
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")

    questions = quiz.get("questions", [])
    total_questions = len(questions)
    
    score = 0
    detailed_answers = []
    
    for item in payload.answers:
        q_idx = item.get("question_index", 0)
        selected = item.get("selected_option", -1)
        
        if 0 <= q_idx < total_questions:
            q = questions[q_idx]
            correct_idx = q.get("correct_answer_index", 0)
            is_correct = (selected == correct_idx)
            if is_correct:
                score += 1
                
            detailed_answers.append({
                "question_index": q_idx,
                "question_text": q.get("question_text"),
                "selected_option": selected,
                "correct_option": correct_idx,
                "is_correct": is_correct,
                "explanation": q.get("explanation", "")
            })

    percentage = round((score / total_questions * 100), 2) if total_questions > 0 else 0.0

    attempt = local_store.add_quiz_attempt({
        "quiz_id": payload.quiz_id,
        "score": score,
        "total_questions": total_questions,
        "percentage": percentage,
        "answers": detailed_answers
    })

    return attempt

@router.get("/attempts/history", response_model=List[QuizAttemptResponse])
def get_quiz_attempts():
    return local_store.get_quiz_attempts()

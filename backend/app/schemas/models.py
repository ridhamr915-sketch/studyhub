from typing import List, Optional, Any, Dict
from pydantic import BaseModel, Field
from datetime import datetime, date

# ----------------- Subject & Topic Schemas -----------------
class TopicCreate(BaseModel):
    title: str
    notes: Optional[str] = None

class TopicResponse(BaseModel):
    id: str
    unit_id: Optional[str] = None
    subject_id: Optional[str] = None
    title: str
    is_completed: bool = False
    notes: Optional[str] = None
    created_at: Optional[str] = None

class UnitCreate(BaseModel):
    unit_number: int
    title: str
    description: Optional[str] = None
    topics: Optional[List[TopicCreate]] = []

class UnitResponse(BaseModel):
    id: str
    subject_id: Optional[str] = None
    unit_number: int
    title: str
    description: Optional[str] = None
    topics: List[TopicResponse] = []
    created_at: Optional[str] = None

class SubjectCreate(BaseModel):
    name: str
    code: Optional[str] = None
    semester: int = 4
    description: Optional[str] = None
    color: Optional[str] = "#7C3AED"
    icon: Optional[str] = "BookOpen"

class SubjectUpdate(BaseModel):
    name: Optional[str] = None
    code: Optional[str] = None
    semester: Optional[int] = None
    description: Optional[str] = None
    color: Optional[str] = None
    icon: Optional[str] = None

class SubjectResponse(BaseModel):
    id: str
    user_id: Optional[str] = None
    name: str
    code: Optional[str] = None
    semester: int = 4
    description: Optional[str] = None
    color: str = "#7C3AED"
    icon: str = "BookOpen"
    is_demo: bool = False
    units: List[UnitResponse] = []
    created_at: Optional[str] = None

# ----------------- Resource Schemas -----------------
class ResourceUpdate(BaseModel):
    title: Optional[str] = None
    subject_id: Optional[str] = None
    unit_id: Optional[str] = None
    is_bookmarked: Optional[bool] = None
    tags: Optional[List[str]] = None

class ResourceResponse(BaseModel):
    id: str
    user_id: Optional[str] = None
    subject_id: Optional[str] = None
    unit_id: Optional[str] = None
    title: str
    file_name: str
    file_path: str
    file_type: str
    file_size: int
    extracted_text: Optional[str] = None
    is_bookmarked: bool = False
    tags: List[str] = []
    created_at: Optional[str] = None
    download_url: Optional[str] = None

# ----------------- Notes Schemas -----------------
class NotesGenerateRequest(BaseModel):
    subject_id: Optional[str] = None
    resource_id: Optional[str] = None
    topic_title: Optional[str] = None
    note_type: str = "detailed" # short, detailed, simple, definitions, exam, qa
    custom_instructions: Optional[str] = None

class NotesUpdateRequest(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None

class NotesResponse(BaseModel):
    id: str
    user_id: Optional[str] = None
    subject_id: Optional[str] = None
    resource_id: Optional[str] = None
    topic_title: Optional[str] = None
    note_type: str
    title: str
    content: str
    created_at: Optional[str] = None

# ----------------- AI Study Assistant Schemas -----------------
class ChatMessageRequest(BaseModel):
    session_id: Optional[str] = None
    resource_id: Optional[str] = None
    question: str
    history: Optional[List[Dict[str, str]]] = []

class ChatMessageResponse(BaseModel):
    id: Optional[str] = None
    role: str
    content: str
    sources: List[Dict[str, Any]] = []
    created_at: Optional[str] = None

class ChatSessionResponse(BaseModel):
    id: str
    title: str
    resource_id: Optional[str] = None
    messages: List[ChatMessageResponse] = []
    created_at: Optional[str] = None

# ----------------- Quiz Schemas -----------------
class QuizQuestion(BaseModel):
    id: Optional[str] = None
    question_text: str
    options: List[str]
    correct_answer_index: int
    explanation: Optional[str] = None

class QuizGenerateRequest(BaseModel):
    subject_id: Optional[str] = None
    resource_id: Optional[str] = None
    topic: Optional[str] = None
    difficulty: str = "Medium" # Easy, Medium, Hard
    total_questions: int = 5

class QuizResponse(BaseModel):
    id: str
    user_id: Optional[str] = None
    subject_id: Optional[str] = None
    resource_id: Optional[str] = None
    title: str
    topic: Optional[str] = None
    difficulty: str
    total_questions: int
    questions: List[QuizQuestion] = []
    created_at: Optional[str] = None

class QuizSubmission(BaseModel):
    quiz_id: str
    answers: List[Dict[str, Any]] # e.g. [{"question_index": 0, "selected_option": 1}]

class QuizAttemptResponse(BaseModel):
    id: str
    quiz_id: str
    score: int
    total_questions: int
    percentage: float
    answers: List[Dict[str, Any]]
    completed_at: str

# ----------------- Flashcards Schemas -----------------
class FlashcardCreate(BaseModel):
    subject_id: Optional[str] = None
    resource_id: Optional[str] = None
    deck_title: str = "Core Concepts"
    front: str
    back: str

class FlashcardGenerateRequest(BaseModel):
    subject_id: Optional[str] = None
    resource_id: Optional[str] = None
    deck_title: Optional[str] = "Generated Deck"
    count: int = 6

class FlashcardResponse(BaseModel):
    id: str
    user_id: Optional[str] = None
    subject_id: Optional[str] = None
    resource_id: Optional[str] = None
    deck_title: str
    front: str
    back: str
    is_starred: bool = False
    created_at: Optional[str] = None

# ----------------- Study Planner Schemas -----------------
class TaskCreate(BaseModel):
    subject_id: Optional[str] = None
    title: str
    description: Optional[str] = None
    task_date: str
    deadline: Optional[str] = None
    priority: str = "Medium" # Low, Medium, High, Urgent
    task_type: str = "study" # study, assignment, exam_prep, revision

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    task_date: Optional[str] = None
    deadline: Optional[str] = None
    priority: Optional[str] = None
    is_completed: Optional[bool] = None
    task_type: Optional[str] = None

class TaskResponse(BaseModel):
    id: str
    user_id: Optional[str] = None
    subject_id: Optional[str] = None
    title: str
    description: Optional[str] = None
    task_date: str
    deadline: Optional[str] = None
    priority: str
    is_completed: bool
    task_type: str
    created_at: Optional[str] = None

# ----------------- Analytics Schemas -----------------
class AnalyticsResponse(BaseModel):
    total_subjects: int
    total_resources: int
    total_tasks: int
    completed_tasks: int
    pending_tasks: int
    quiz_attempts: int
    average_quiz_score: float
    study_time_hours: float
    weekly_activity: List[Dict[str, Any]]
    subject_progress: List[Dict[str, Any]]

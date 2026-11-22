import os
import json
import uuid
from datetime import datetime, date
from typing import Dict, List, Any, Optional

class LocalDatabaseStore:
    def __init__(self, filepath: str = "backend/data/studyhub_store.json"):
        self.filepath = filepath
        os.makedirs(os.path.dirname(self.filepath), exist_ok=True)
        self.data: Dict[str, Any] = {
            "subjects": [],
            "units": [],
            "topics": [],
            "resources": [],
            "notes": [],
            "chat_sessions": [],
            "chat_messages": [],
            "quizzes": [],
            "quiz_questions": [],
            "quiz_attempts": [],
            "flashcards": [],
            "tasks": [],
            "profiles": {}
        }
        self.load()
        if not self.data["subjects"]:
            self._seed_sample_subjects()

    def load(self):
        if os.path.exists(self.filepath):
            try:
                with open(self.filepath, "r", encoding="utf-8") as f:
                    self.data = json.load(f)
            except Exception:
                self.save()
        else:
            self.save()

    def save(self):
        try:
            with open(self.filepath, "w", encoding="utf-8") as f:
                json.dump(self.data, f, indent=2, default=str)
        except Exception as e:
            print(f"Error saving local DB: {e}")

    def _seed_sample_subjects(self):
        """Seeds the 4 sample CSE subjects requested in the specification."""
        demo_subjects = [
            {
                "id": "demo-sub-1",
                "name": "Data Structures & Algorithms",
                "code": "CS-201",
                "semester": 4,
                "description": "Fundamental linear and non-linear data structures, trees, graphs, and sorting algorithms.",
                "color": "#7C3AED",
                "icon": "Layers",
                "is_demo": True,
                "created_at": datetime.utcnow().isoformat(),
                "units": [
                    {
                        "id": "demo-unit-1-1",
                        "unit_number": 1,
                        "title": "Linear Data Structures",
                        "description": "Arrays, Linked Lists, Stacks, and Queues",
                        "topics": [
                            {"id": "demo-top-1", "title": "Singly & Doubly Linked Lists", "is_completed": True},
                            {"id": "demo-top-2", "title": "Stack implementation using Arrays and Linked Lists", "is_completed": True},
                            {"id": "demo-top-3", "title": "Circular Queues and Priority Queues", "is_completed": False}
                        ]
                    },
                    {
                        "id": "demo-unit-1-2",
                        "unit_number": 2,
                        "title": "Non-Linear Structures & Trees",
                        "description": "Binary Trees, BST, AVL Trees",
                        "topics": [
                            {"id": "demo-top-4", "title": "Binary Tree Traversals (Inorder, Preorder, Postorder)", "is_completed": True},
                            {"id": "demo-top-5", "title": "Binary Search Tree (BST) Operations", "is_completed": False},
                            {"id": "demo-top-6", "title": "AVL Trees and Rotations", "is_completed": False}
                        ]
                    }
                ]
            },
            {
                "id": "demo-sub-2",
                "name": "Discrete Mathematics",
                "code": "CS-202",
                "semester": 4,
                "description": "Set theory, propositional logic, relations, combinatorics, and graph theory.",
                "color": "#8B5CF6",
                "icon": "Binary",
                "is_demo": True,
                "created_at": datetime.utcnow().isoformat(),
                "units": [
                    {
                        "id": "demo-unit-2-1",
                        "unit_number": 1,
                        "title": "Propositional Logic & Proofs",
                        "description": "Truth tables, logical equivalences, and direct/indirect proofs",
                        "topics": [
                            {"id": "demo-top-7", "title": "Propositional Equivalences and De Morgan's Laws", "is_completed": True},
                            {"id": "demo-top-8", "title": "Predicates, Quantifiers, and Rules of Inference", "is_completed": False}
                        ]
                    }
                ]
            },
            {
                "id": "demo-sub-3",
                "name": "Digital Electronics",
                "code": "EC-203",
                "semester": 4,
                "description": "Logic gates, Boolean algebra, combinational and sequential circuit design.",
                "color": "#6366F1",
                "icon": "Cpu",
                "is_demo": True,
                "created_at": datetime.utcnow().isoformat(),
                "units": [
                    {
                        "id": "demo-unit-3-1",
                        "unit_number": 1,
                        "title": "Boolean Algebra & Logic Simplification",
                        "description": "Logic gates, Karnaugh Maps (K-Maps), SOP and POS forms",
                        "topics": [
                            {"id": "demo-top-9", "title": "Karnaugh Map (K-Map) 4-Variable Minimization", "is_completed": True},
                            {"id": "demo-top-10", "title": "Multiplexers, Demultiplexers, and Decoders", "is_completed": False}
                        ]
                    }
                ]
            },
            {
                "id": "demo-sub-4",
                "name": "Computer Organization & Architecture",
                "code": "CS-204",
                "semester": 4,
                "description": "CPU architecture, memory hierarchy, instruction pipelining, and I/O systems.",
                "color": "#4F46E5",
                "icon": "Server",
                "is_demo": True,
                "created_at": datetime.utcnow().isoformat(),
                "units": [
                    {
                        "id": "demo-unit-4-1",
                        "unit_number": 1,
                        "title": "Basic Processing Unit & Pipelining",
                        "description": "Instruction cycles, hazard detection, and cache hierarchies",
                        "topics": [
                            {"id": "demo-top-11", "title": "5-Stage Instruction Pipeline & Hazard Resolution", "is_completed": False},
                            {"id": "demo-top-12", "title": "Cache Memory Mapping (Direct, Set-Associative)", "is_completed": False}
                        ]
                    }
                ]
            }
        ]
        self.data["subjects"] = demo_subjects

        # Seed sample tasks
        today_str = date.today().isoformat()
        self.data["tasks"] = [
            {
                "id": "demo-task-1",
                "title": "Complete AVL Tree Rotations Assignment",
                "subject_id": "demo-sub-1",
                "description": "Solve Left-Right and Right-Left rebalancing numericals.",
                "task_date": today_str,
                "deadline": f"{today_str}T23:59:00",
                "priority": "High",
                "is_completed": False,
                "task_type": "assignment",
                "created_at": datetime.utcnow().isoformat()
            },
            {
                "id": "demo-task-2",
                "title": "Revise 4-variable K-Maps",
                "subject_id": "demo-sub-3",
                "description": "Review grouping rules and don't care conditions.",
                "task_date": today_str,
                "deadline": f"{today_str}T20:00:00",
                "priority": "Medium",
                "is_completed": True,
                "task_type": "study",
                "created_at": datetime.utcnow().isoformat()
            },
            {
                "id": "demo-task-3",
                "title": "Midterm Exam Preparation - Cache Memory",
                "subject_id": "demo-sub-4",
                "description": "Direct mapped vs 4-way set associative hit ratio calculations.",
                "task_date": today_str,
                "deadline": f"{today_str}T18:00:00",
                "priority": "Urgent",
                "is_completed": False,
                "task_type": "exam_prep",
                "created_at": datetime.utcnow().isoformat()
            }
        ]

        # Seed sample flashcards
        self.data["flashcards"] = [
            {
                "id": "fc-1",
                "subject_id": "demo-sub-1",
                "deck_title": "DSA Quick Revision",
                "front": "What is the worst-case time complexity of QuickSort?",
                "back": "O(n^2), which occurs when the selected pivot is always the smallest or largest element (e.g. sorted array with first element as pivot).",
                "is_starred": True,
                "created_at": datetime.utcnow().isoformat()
            },
            {
                "id": "fc-2",
                "subject_id": "demo-sub-1",
                "deck_title": "DSA Quick Revision",
                "front": "What condition identifies a full Circular Queue?",
                "back": "(rear + 1) % capacity == front",
                "is_starred": False,
                "created_at": datetime.utcnow().isoformat()
            },
            {
                "id": "fc-3",
                "subject_id": "demo-sub-4",
                "deck_title": "COA Essentials",
                "front": "Name the 3 major pipeline hazards in CPU architecture.",
                "back": "1. Structural Hazard (resource conflict)\n2. Data Hazard (RAW, WAR, WAW dependencies)\n3. Control Hazard (branching & jumps)",
                "is_starred": True,
                "created_at": datetime.utcnow().isoformat()
            }
        ]
        self.save()

    # Subjects
    def get_subjects(self, user_id: Optional[str] = None) -> List[Dict[str, Any]]:
        self.load()
        return self.data["subjects"]

    def add_subject(self, subject_data: Dict[str, Any]) -> Dict[str, Any]:
        self.load()
        subject_id = str(uuid.uuid4())
        new_subject = {
            "id": subject_id,
            "name": subject_data["name"],
            "code": subject_data.get("code", ""),
            "semester": subject_data.get("semester", 4),
            "description": subject_data.get("description", ""),
            "color": subject_data.get("color", "#7C3AED"),
            "icon": subject_data.get("icon", "BookOpen"),
            "is_demo": False,
            "created_at": datetime.utcnow().isoformat(),
            "units": []
        }
        self.data["subjects"].append(new_subject)
        self.save()
        return new_subject

    def update_subject(self, subject_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        self.load()
        for sub in self.data["subjects"]:
            if sub["id"] == subject_id:
                for k, v in updates.items():
                    if v is not None:
                        sub[k] = v
                self.save()
                return sub
        return None

    def delete_subject(self, subject_id: str) -> bool:
        self.load()
        init_len = len(self.data["subjects"])
        self.data["subjects"] = [s for s in self.data["subjects"] if s["id"] != subject_id]
        if len(self.data["subjects"]) < init_len:
            self.save()
            return True
        return False

    # Units & Topics
    def add_unit(self, subject_id: str, unit_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        self.load()
        for sub in self.data["subjects"]:
            if sub["id"] == subject_id:
                unit_id = str(uuid.uuid4())
                new_unit = {
                    "id": unit_id,
                    "subject_id": subject_id,
                    "unit_number": unit_data.get("unit_number", len(sub.get("units", [])) + 1),
                    "title": unit_data["title"],
                    "description": unit_data.get("description", ""),
                    "topics": []
                }
                sub.setdefault("units", []).append(new_unit)
                self.save()
                return new_unit
        return None

    def add_topic(self, subject_id: str, unit_id: str, topic_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        self.load()
        for sub in self.data["subjects"]:
            if sub["id"] == subject_id:
                for unit in sub.get("units", []):
                    if unit["id"] == unit_id:
                        topic_id = str(uuid.uuid4())
                        new_topic = {
                            "id": topic_id,
                            "subject_id": subject_id,
                            "unit_id": unit_id,
                            "title": topic_data["title"],
                            "is_completed": False,
                            "notes": topic_data.get("notes", ""),
                            "created_at": datetime.utcnow().isoformat()
                        }
                        unit.setdefault("topics", []).append(new_topic)
                        self.save()
                        return new_topic
        return None

    def toggle_topic(self, topic_id: str) -> Optional[Dict[str, Any]]:
        self.load()
        for sub in self.data["subjects"]:
            for unit in sub.get("units", []):
                for topic in unit.get("topics", []):
                    if topic["id"] == topic_id:
                        topic["is_completed"] = not topic.get("is_completed", False)
                        self.save()
                        return topic
        return None

    # Resources
    def get_resources(self) -> List[Dict[str, Any]]:
        self.load()
        return self.data["resources"]

    def add_resource(self, res_data: Dict[str, Any]) -> Dict[str, Any]:
        self.load()
        res_id = str(uuid.uuid4())
        item = {
            "id": res_id,
            "title": res_data["title"],
            "subject_id": res_data.get("subject_id"),
            "unit_id": res_data.get("unit_id"),
            "file_name": res_data["file_name"],
            "file_path": res_data["file_path"],
            "file_type": res_data.get("file_type", "pdf"),
            "file_size": res_data.get("file_size", 0),
            "extracted_text": res_data.get("extracted_text", ""),
            "is_bookmarked": False,
            "tags": res_data.get("tags", []),
            "created_at": datetime.utcnow().isoformat(),
            "download_url": f"/api/v1/resources/{res_id}/download"
        }
        self.data["resources"].append(item)
        self.save()
        return item

    def get_resource(self, resource_id: str) -> Optional[Dict[str, Any]]:
        self.load()
        for res in self.data["resources"]:
            if res["id"] == resource_id:
                return res
        return None

    def update_resource(self, resource_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        self.load()
        for res in self.data["resources"]:
            if res["id"] == resource_id:
                for k, v in updates.items():
                    if v is not None:
                        res[k] = v
                self.save()
                return res
        return None

    def delete_resource(self, resource_id: str) -> bool:
        self.load()
        init_len = len(self.data["resources"])
        self.data["resources"] = [r for r in self.data["resources"] if r["id"] != resource_id]
        if len(self.data["resources"]) < init_len:
            self.save()
            return True
        return False

    # Notes
    def get_notes(self) -> List[Dict[str, Any]]:
        self.load()
        return self.data["notes"]

    def add_note(self, note_data: Dict[str, Any]) -> Dict[str, Any]:
        self.load()
        note_id = str(uuid.uuid4())
        item = {
            "id": note_id,
            "subject_id": note_data.get("subject_id"),
            "resource_id": note_data.get("resource_id"),
            "topic_title": note_data.get("topic_title", ""),
            "note_type": note_data.get("note_type", "detailed"),
            "title": note_data["title"],
            "content": note_data["content"],
            "created_at": datetime.utcnow().isoformat()
        }
        self.data["notes"].append(item)
        self.save()
        return item

    def update_note(self, note_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        self.load()
        for note in self.data["notes"]:
            if note["id"] == note_id:
                if "title" in updates and updates["title"]:
                    note["title"] = updates["title"]
                if "content" in updates and updates["content"]:
                    note["content"] = updates["content"]
                self.save()
                return note
        return None

    def delete_note(self, note_id: str) -> bool:
        self.load()
        init_len = len(self.data["notes"])
        self.data["notes"] = [n for n in self.data["notes"] if n["id"] != note_id]
        if len(self.data["notes"]) < init_len:
            self.save()
            return True
        return False

    # Chat Sessions & Messages
    def get_chat_sessions(self) -> List[Dict[str, Any]]:
        self.load()
        return self.data["chat_sessions"]

    def get_or_create_chat_session(self, session_id: Optional[str] = None, resource_id: Optional[str] = None, title: str = "Study Consultation") -> Dict[str, Any]:
        self.load()
        if session_id:
            for s in self.data["chat_sessions"]:
                if s["id"] == session_id:
                    return s
        new_id = str(uuid.uuid4())
        session = {
            "id": new_id,
            "resource_id": resource_id,
            "title": title,
            "created_at": datetime.utcnow().isoformat(),
            "messages": []
        }
        self.data["chat_sessions"].append(session)
        self.save()
        return session

    def add_chat_message(self, session_id: str, role: str, content: str, sources: List[Dict[str, Any]] = None) -> Dict[str, Any]:
        self.load()
        msg_id = str(uuid.uuid4())
        msg = {
            "id": msg_id,
            "session_id": session_id,
            "role": role,
            "content": content,
            "sources": sources or [],
            "created_at": datetime.utcnow().isoformat()
        }
        for s in self.data["chat_sessions"]:
            if s["id"] == session_id:
                s.setdefault("messages", []).append(msg)
                break
        self.save()
        return msg

    # Quizzes
    def add_quiz(self, quiz_data: Dict[str, Any]) -> Dict[str, Any]:
        self.load()
        quiz_id = str(uuid.uuid4())
        quiz = {
            "id": quiz_id,
            "subject_id": quiz_data.get("subject_id"),
            "resource_id": quiz_data.get("resource_id"),
            "title": quiz_data["title"],
            "topic": quiz_data.get("topic", "General"),
            "difficulty": quiz_data.get("difficulty", "Medium"),
            "total_questions": len(quiz_data.get("questions", [])),
            "questions": quiz_data.get("questions", []),
            "created_at": datetime.utcnow().isoformat()
        }
        self.data["quizzes"].append(quiz)
        self.save()
        return quiz

    def get_quiz(self, quiz_id: str) -> Optional[Dict[str, Any]]:
        self.load()
        for q in self.data["quizzes"]:
            if q["id"] == quiz_id:
                return q
        return None

    def add_quiz_attempt(self, attempt_data: Dict[str, Any]) -> Dict[str, Any]:
        self.load()
        attempt_id = str(uuid.uuid4())
        attempt = {
            "id": attempt_id,
            "quiz_id": attempt_data["quiz_id"],
            "score": attempt_data["score"],
            "total_questions": attempt_data["total_questions"],
            "percentage": attempt_data["percentage"],
            "answers": attempt_data.get("answers", []),
            "completed_at": datetime.utcnow().isoformat()
        }
        self.data["quiz_attempts"].append(attempt)
        self.save()
        return attempt

    def get_quiz_attempts(self) -> List[Dict[str, Any]]:
        self.load()
        return self.data["quiz_attempts"]

    # Flashcards
    def get_flashcards(self, subject_id: Optional[str] = None) -> List[Dict[str, Any]]:
        self.load()
        if subject_id:
            return [fc for fc in self.data["flashcards"] if fc.get("subject_id") == subject_id]
        return self.data["flashcards"]

    def add_flashcard(self, fc_data: Dict[str, Any]) -> Dict[str, Any]:
        self.load()
        fc_id = str(uuid.uuid4())
        item = {
            "id": fc_id,
            "subject_id": fc_data.get("subject_id"),
            "resource_id": fc_data.get("resource_id"),
            "deck_title": fc_data.get("deck_title", "Core Concepts"),
            "front": fc_data["front"],
            "back": fc_data["back"],
            "is_starred": False,
            "created_at": datetime.utcnow().isoformat()
        }
        self.data["flashcards"].append(item)
        self.save()
        return item

    def toggle_flashcard_star(self, fc_id: str) -> Optional[Dict[str, Any]]:
        self.load()
        for fc in self.data["flashcards"]:
            if fc["id"] == fc_id:
                fc["is_starred"] = not fc.get("is_starred", False)
                self.save()
                return fc
        return None

    def delete_flashcard(self, fc_id: str) -> bool:
        self.load()
        init_len = len(self.data["flashcards"])
        self.data["flashcards"] = [fc for fc in self.data["flashcards"] if fc["id"] != fc_id]
        if len(self.data["flashcards"]) < init_len:
            self.save()
            return True
        return False

    # Tasks
    def get_tasks(self) -> List[Dict[str, Any]]:
        self.load()
        return self.data["tasks"]

    def add_task(self, task_data: Dict[str, Any]) -> Dict[str, Any]:
        self.load()
        task_id = str(uuid.uuid4())
        item = {
            "id": task_id,
            "subject_id": task_data.get("subject_id"),
            "title": task_data["title"],
            "description": task_data.get("description", ""),
            "task_date": task_data.get("task_date", date.today().isoformat()),
            "deadline": task_data.get("deadline"),
            "priority": task_data.get("priority", "Medium"),
            "is_completed": False,
            "task_type": task_data.get("task_type", "study"),
            "created_at": datetime.utcnow().isoformat()
        }
        self.data["tasks"].append(item)
        self.save()
        return item

    def update_task(self, task_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        self.load()
        for t in self.data["tasks"]:
            if t["id"] == task_id:
                for k, v in updates.items():
                    if v is not None:
                        t[k] = v
                self.save()
                return t
        return None

    def delete_task(self, task_id: str) -> bool:
        self.load()
        init_len = len(self.data["tasks"])
        self.data["tasks"] = [t for t in self.data["tasks"] if t["id"] != task_id]
        if len(self.data["tasks"]) < init_len:
            self.save()
            return True
        return False

local_store = LocalDatabaseStore()

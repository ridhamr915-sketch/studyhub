import sys
import os
import unittest
from fastapi.testclient import TestClient

# Ensure backend root is on sys.path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import app

class TestStudyHubAPI(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)

    def test_01_health_and_root(self):
        res = self.client.get("/")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json()["health"], "OK")

        health_res = self.client.get("/health")
        self.assertEqual(health_res.status_code, 200)
        self.assertIn("gemini_service", health_res.json())

    def test_02_subjects_flow(self):
        # 1. Get initial subjects
        res = self.client.get("/api/v1/subjects")
        self.assertEqual(res.status_code, 200)
        self.assertGreaterEqual(len(res.json()), 4) # 4 demo subjects

        # 2. Create subject
        sub_payload = {
            "name": "Operating Systems",
            "code": "CS-205",
            "semester": 4,
            "description": "Kernel architecture, processes, and memory management",
            "color": "#6366F1"
        }
        create_res = self.client.post("/api/v1/subjects", json=sub_payload)
        self.assertEqual(create_res.status_code, 200)
        sub_id = create_res.json()["id"]

        # 3. Add unit
        unit_res = self.client.post(f"/api/v1/subjects/{sub_id}/units", json={
            "unit_number": 1,
            "title": "Processes & Threads",
            "description": "PCB, Context Switching, Scheduling"
        })
        self.assertEqual(unit_res.status_code, 200)
        unit_id = unit_res.json()["id"]

        # 4. Add topic
        topic_res = self.client.post(f"/api/v1/subjects/{sub_id}/units/{unit_id}/topics", json={
            "title": "Round Robin CPU Scheduling"
        })
        self.assertEqual(topic_res.status_code, 200)
        topic_id = topic_res.json()["id"]

        # 5. Toggle topic
        toggle_res = self.client.post(f"/api/v1/subjects/topics/{topic_id}/toggle")
        self.assertEqual(toggle_res.status_code, 200)
        self.assertTrue(toggle_res.json()["topic"]["is_completed"])

    def test_03_resources_flow(self):
        # 1. Upload sample text resource
        sample_content = b"--- [Page 1] ---\nOPERATING SYSTEMS: Deadlock occurs when processes hold resources and wait for others.\nConditions: Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait."
        files = {
            "file": ("Deadlocks_Overview.txt", sample_content, "text/plain")
        }
        data = {
            "title": "Deadlocks Overview Notes",
            "tags": "OS,Deadlocks,Unit2"
        }
        upload_res = self.client.post("/api/v1/resources/upload", files=files, data=data)
        self.assertEqual(upload_res.status_code, 200)
        res_data = upload_res.json()
        self.assertEqual(res_data["title"], "Deadlocks Overview Notes")
        self.assertIn("extracted_text", res_data)
        self.assertIn("Deadlock occurs", res_data["extracted_text"])
        res_id = res_data["id"]

        # 2. Download resource
        dl_res = self.client.get(f"/api/v1/resources/{res_id}/download")
        self.assertEqual(dl_res.status_code, 200)
        self.assertIn(b"Deadlock occurs", dl_res.content)

        # 3. Toggle Bookmark
        bm_res = self.client.put(f"/api/v1/resources/{res_id}", json={"is_bookmarked": True})
        self.assertEqual(bm_res.status_code, 200)
        self.assertTrue(bm_res.json()["is_bookmarked"])

    def test_04_ai_assistant_ask(self):
        # Get uploaded resource
        resources = self.client.get("/api/v1/resources").json()
        res_id = resources[0]["id"] if resources else None

        ask_res = self.client.post("/api/v1/assistant/ask", json={
            "question": "What is the difference between stack and queue?",
            "resource_id": res_id
        })
        self.assertEqual(ask_res.status_code, 200)
        answer_data = ask_res.json()
        self.assertIn("content", answer_data)
        self.assertGreater(len(answer_data["content"]), 20)

    def test_05_ai_notes_generator(self):
        notes_res = self.client.post("/api/v1/notes/generate", json={
            "topic_title": "Binary Search Trees",
            "note_type": "exam"
        })
        self.assertEqual(notes_res.status_code, 200)
        note_data = notes_res.json()
        self.assertIn("content", note_data)
        self.assertEqual(note_data["note_type"], "exam")

    def test_06_quiz_generation_and_submission(self):
        # 1. Generate Quiz
        quiz_res = self.client.post("/api/v1/quizzes/generate", json={
            "topic": "Process Synchronization",
            "difficulty": "Medium",
            "total_questions": 3
        })
        self.assertEqual(quiz_res.status_code, 200)
        quiz_data = quiz_res.json()
        self.assertEqual(len(quiz_data["questions"]), 3)
        quiz_id = quiz_data["id"]

        # 2. Submit Quiz
        sub_res = self.client.post("/api/v1/quizzes/submit", json={
            "quiz_id": quiz_id,
            "answers": [
                {"question_index": 0, "selected_option": quiz_data["questions"][0]["correct_answer_index"]},
                {"question_index": 1, "selected_option": 0},
                {"question_index": 2, "selected_option": quiz_data["questions"][2]["correct_answer_index"]}
            ]
        })
        self.assertEqual(sub_res.status_code, 200)
        result = sub_res.json()
        self.assertGreaterEqual(result["score"], 2)
        self.assertGreaterEqual(result["percentage"], 60.0)

    def test_07_planner_tasks(self):
        # 1. Create task
        task_res = self.client.post("/api/v1/planner/tasks", json={
            "title": "Solve 5 LeetCode Linked List problems",
            "task_date": "2026-11-22",
            "priority": "High",
            "task_type": "study"
        })
        self.assertEqual(task_res.status_code, 200)
        task_id = task_res.json()["id"]

        # 2. Mark complete
        update_res = self.client.put(f"/api/v1/planner/tasks/{task_id}", json={
            "is_completed": True
        })
        self.assertEqual(update_res.status_code, 200)
        self.assertTrue(update_res.json()["is_completed"])

    def test_08_analytics_calculation(self):
        res = self.client.get("/api/v1/analytics")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertGreaterEqual(data["total_subjects"], 4)
        self.assertGreaterEqual(data["total_tasks"], 1)
        self.assertGreaterEqual(data["completed_tasks"], 1)
        self.assertIn("weekly_activity", data)
        self.assertIn("subject_progress", data)

if __name__ == "__main__":
    unittest.main()

# StudyHub 1.0 — Viva & Faculty Evaluation Guide

**Target Audience:** 2nd-Year B.Tech Computer Science & Engineering Evaluators & Students  
**Subject:** Full-Stack Mini-Project Presentation

---

## 1. Quick Project Elevator Pitch
"StudyHub 1.0 is an intelligent academic resource organizer designed specifically for college engineering students. Unlike generic cloud drives or isolated chatbots, StudyHub integrates curriculum-structured resource management with document-grounded AI. Students can upload their lecture PDFs, ask conceptual questions cited directly from their notes via Google Gemini, generate university-exam-ready model answers, test themselves with AI MCQs, and track their genuine syllabus progress."

---

## 2. Frequently Asked Technical Viva Questions

### Q1: Why did you choose Python FastAPI for the backend instead of Node.js / Express?
**Answer:**
1. **AI & Machine Learning Ecosystem:** Python has native, top-tier libraries for document processing (`pypdf`, `pdfplumber`), data analytics, and the official Google Generative AI SDK.
2. **Speed & Asynchronous Performance:** FastAPI is built on Starlette and Pydantic, making it one of the fastest Python frameworks available, rivaling Node.js and Go in throughput.
3. **Automatic Documentation:** FastAPI automatically generates OpenAPI / Swagger documentation (`/docs`), streamlining testing and faculty review.
4. **Strict Type Safety:** Pydantic models enforce compile-time-like validation on all request payloads.

---

### Q2: How do you prevent AI Hallucination when students ask questions about their PDFs?
**Answer:**
1. **Document-Grounded Prompting:** When a student selects a PDF, the backend extracts the text page-by-page and injects clear page markers (`--- [Page X] ---`) into the context window.
2. **Strict System Prompt Constraints:** We instruct Gemini to prioritize the document. If the document does not contain the answer, the assistant explicitly alerts the student:  
   *"ℹ️ Note: This topic is not covered in your uploaded document. Here is the explanation from general engineering knowledge."*
3. **No Hallucinated Citations:** The prompt prohibits inventing page numbers or fabricating references.

---

### Q3: Why is Gemini API called from the backend rather than the React frontend?
**Answer:**
1. **Credential Security:** API keys stored in frontend code (`import.meta.env`) are visible to anyone inspecting network requests in browser Developer Tools. By calling Gemini through FastAPI, the secret key stays strictly in the server environment.
2. **Rate Limiting & Token Management:** The backend sanitizes, chunks, and truncates input text before forwarding to Gemini, avoiding token limit overruns and quota exhaustion.
3. **Grounded Source Injection:** The backend can retrieve text, enrich context, and cache results securely.

---

### Q4: How is student data privacy maintained in Supabase?
**Answer:**
We enabled **PostgreSQL Row Level Security (RLS)** across all 15 tables in `database/supabase_schema.sql`.
Every user action is scoped to `auth.uid() = user_id`. Even if a malicious user tries to request resources or quiz scores belonging to another student ID, PostgreSQL rejects the query at the database engine level.

---

### Q5: How is this architecture future-proofed for the 3rd and 4th year?
**Answer:**
1. **Modular Domain Services:** AI services (`gemini_service.py`), PDF parsers (`pdf_service.py`), and storage layers are decoupled.
2. **Ready for 3rd Year (StudyHub 2.0):** The quiz attempt and topic completion tables already store the granular performance data required to build an AI weakness-detection engine and adaptive quiz system.
3. **Ready for 4th Year (StudyHub 3.0):** The RESTful API and JSON-based schema can easily be consumed by a mobile app (React Native) or expanded with WebSockets for real-time collaborative study rooms.

---

## 3. Recommended Live Demo Flow for Evaluators

1. **Landing Page:** Show the clean lavender theme, responsive navbar, and 3-year roadmap.
2. **Authentication:** Click **"One-Click Demo Student Login"** to show instant access with pre-seeded CSE 4th-semester data.
3. **My Subjects:** Open *Data Structures & Algorithms* (CS-201). Toggle a topic checkbox to demonstrate instant progress calculation.
4. **Resource Vault:** Highlight the pre-loaded study guide `sample_dsa_unit1.txt`. Click **Preview** to show extracted text.
5. **AI Study Assistant:** Ask: *"Explain the difference between stack and queue"* or *"What is the condition for a full circular queue?"* Show how Gemini cites the document and clearly tags the grounding source.
6. **AI Notes Generator:** Select *Binary Search Trees* and choose *Exam-Oriented Answers*. Click Generate to show structured 2-mark, 5-mark, and 10-mark model answers.
7. **Quiz & Flashcards:** Run a 3-question MCQ test. Answer the questions, click submit, and watch the confetti animation and explanation breakdown.
8. **Progress Tracker:** Show the Recharts weekly study effort and syllabus completion bars calculated strictly from real database records.

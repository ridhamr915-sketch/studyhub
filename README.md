# StudyHub 1.0 — AI-Based Study Resource Organizer

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg?style=flat&logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/Frontend-React%2019-61DAFB.svg?style=flat&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Bundler-Vite-646CFF.svg?style=flat&logo=vite)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC.svg?style=flat&logo=tailwind-css)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Database-Supabase%20PostgreSQL-3ECF8E.svg?style=flat&logo=supabase)](https://supabase.com)
[![Google Gemini](https://img.shields.io/badge/AI-Google%20Gemini%20API-4285F4.svg?style=flat&logo=google)](https://aistudio.google.com)

> **2nd-Year B.Tech Computer Science & Engineering Mini-Project**  
> Architected for smooth multi-year scaling into 3rd-year Minor Project (2.0) & 4th-year Major Project (3.0).

---

## 🚀 Quick Start (Single-Click Launch)

On Windows, double-click **`run_all.bat`** in the project root.  
This automatically spins up both servers:
- **Frontend Dashboard:** [http://localhost:5173](http://localhost:5173)
- **FastAPI Backend & Interactive API Docs:** [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

*Evaluator Shortcut:* On the login screen, click **"One-Click Demo Student Login"** for instant access with pre-configured 4th-semester CSE subjects (DSA, Discrete Math, Digital Electronics, COA).

---

## 📖 Key Modules & Features

1. **Modern EdTech SaaS Landing Page**: Professional homepage with clean lavender palette, dashboard preview mockup, how-it-works workflow, student benefits, and multi-year roadmap.
2. **Student Authentication**: Supabase Auth integration with local demo fallback, protected routes, and private student profiles.
3. **Student Dashboard**: Real database metrics, today's study checklist, upcoming exam deadlines, recent resources, and weekly study activity charts.
4. **My Subjects Module**: Course management, syllabus units, topic checklist with live syllabus completion percentages, and 4 pre-seeded CSE subjects.
5. **Resource Library**: Drag-and-drop file upload (PDF/DOCX/TXT/PPT), text extraction with page markers, subject/unit tagging, bookmarks, and in-browser preview.
6. **AI Study Assistant**: Powered by Google Gemini. Grounded in uploaded PDFs with page citations; clearly distinguishes document facts from general knowledge.
7. **AI Notes Generator**: Generates high-yield short revision notes, deep conceptual guides, definitions, and university exam model answers (2, 5 & 10 marks).
8. **Quiz & Flashcards**: AI-generated MCQs with customizable difficulty (Easy/Medium/Hard), celebratory confetti, in-depth explanations, and interactive 3D concept flashcards.
9. **Study Planner**: Daily checklists, assignment deadlines, exam countdown timers, and recommended B.Tech weekly timetable.
10. **Progress Analytics**: Calculated from real database records using Recharts (no fabricated statistics).
11. **Settings**: Profile configuration, cloud backend status monitor, and multi-year roadmap explorer.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, Vite, Tailwind CSS v4, Lucide React icons, React Router v7, Recharts, Canvas-Confetti.
- **Backend**: Python FastAPI, Uvicorn, Pydantic v2, PyPDF.
- **AI**: Google Gemini API (`gemini-1.5-flash`) orchestrated strictly through the backend.
- **Database & Auth**: Supabase PostgreSQL with 15 relational tables, Row-Level Security (RLS) policies, and Supabase Storage bucket.
- **Resilience**: Full local JSON storage fallback so the project runs out-of-the-box without requiring live keys.

---

## 📁 Repository Structure

```
d:\mini project/
├── backend/
│   ├── app/
│   │   ├── api/             # REST API routers (subjects, resources, assistant, notes, quizzes, etc.)
│   │   ├── core/            # Settings and configuration
│   │   ├── db/              # Supabase client & local storage mirror
│   │   ├── schemas/         # Pydantic request/response models
│   │   └── services/        # Gemini AI & PyPDF extraction services
│   ├── tests/               # Automated API test suite
│   ├── uploads/             # Local file storage mirror
│   ├── main.py              # FastAPI application entry point
│   ├── requirements.txt     # Python backend dependencies
│   ├── .env.example         # Backend environment variables template
│   └── .env                 # Active backend environment configuration
├── frontend/
│   ├── src/
│   │   ├── components/      # Navbar, Sidebar, Header, Modal, EmptyState
│   │   ├── context/         # AuthContext (Supabase / Local)
│   │   ├── layouts/         # Collapsible DashboardLayout
│   │   ├── lib/             # API client & Supabase JS client
│   │   ├── pages/           # 10 Application pages
│   │   ├── App.jsx          # Route definitions
│   │   └── index.css        # Tailwind CSS and Lavender theme
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── .env.example
├── database/
│   └── supabase_schema.sql  # 15 PostgreSQL tables, RLS policies & triggers
├── docs/
│   ├── ARCHITECTURE.md      # System architecture & data flow diagrams
│   ├── SETUP_GUIDE.md       # Step-by-step installation guide
│   └── VIVA_PRESENTATION_GUIDE.md # Viva questions & evaluation presentation guide
├── run_all.bat              # One-click launcher for Windows
├── run_backend.bat          # Backend launcher
├── run_frontend.bat         # Frontend launcher
└── README.md
```

---

## 🧪 Testing & Verification

Run the automated test suite to verify all core user journeys:
```bash
cd backend
python tests/test_api_endpoints.py
```
Expected output:
```
Ran 8 tests in 0.735s
OK
```

---

## 📜 Academic Project Information
- **Course**: B.Tech Computer Science & Engineering (Semester 4)
- **Project**: Mini-Project Submission (StudyHub 1.0)
- **Year**: 2nd Year

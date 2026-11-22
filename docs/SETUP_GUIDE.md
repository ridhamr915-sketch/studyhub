# StudyHub 1.0 — Setup & Deployment Guide

This guide walks you through setting up and running **StudyHub 1.0** locally and in production.

---

## 1. Quickstart (Under 2 Minutes)

### Option A: Double-Click Launcher (Windows)
Double-click `run_all.bat` in the root folder.  
This automatically starts:
- FastAPI Backend: `http://127.0.0.1:8000` (API Docs: `/docs`)
- React Vite Frontend: `http://localhost:5173`

---

## 2. Manual Step-by-Step Installation

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **Python**: v3.10 or higher
- **npm**: v9.0.0 or higher

### Step 1: Backend Setup
```bash
cd backend

# 1. Install dependencies
pip install -r requirements.txt

# 2. Configure environment variables
# Copy .env.example to .env
copy .env.example .env

# 3. Start the FastAPI server
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

The backend server is now live at `http://127.0.0.1:8000`.  
Interactive Swagger documentation is available at `http://127.0.0.1:8000/docs`.

### Step 2: Frontend Setup
In a separate terminal:
```bash
cd frontend

# 1. Install dependencies
npm install

# 2. Configure environment variables
copy .env.example .env

# 3. Launch Vite development server
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 3. Configuring External Cloud Services

> **Zero-Config Note:** StudyHub 1.0 features an intelligent local fallback store. Even without Supabase or Gemini keys entered, the entire frontend and backend are 100% functional with full CRUD and curriculum-grounded responses!

### A. Google Gemini API Setup
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Sign in with your Google Account and click **"Create API Key"**.
3. Open `backend/.env` and paste your key:
   ```env
   GEMINI_API_KEY=AIzaSy...
   ```
4. Restart your FastAPI backend. The status pill on the dashboard header will turn green indicating live Gemini 1.5 connection.

### B. Supabase Setup (PostgreSQL, Auth & Storage)
1. Create a free project at [Supabase](https://supabase.com).
2. In the Supabase Dashboard, go to **SQL Editor**.
3. Copy the entire contents of `database/supabase_schema.sql` and run it. This creates:
   - All 15 relational tables.
   - Row-Level Security (RLS) policies.
   - The automatic user profile trigger.
4. Go to **Storage** -> **New Bucket**:
   - Bucket name: `study-resources`
   - Set to **Private** (RLS policies manage access).
5. Copy your credentials from **Project Settings** -> **API**:
   - `Project URL`
   - `anon public` key
   - `service_role` key
6. Update `backend/.env`:
   ```env
   SUPABASE_URL=https://<your-project-id>.supabase.co
   SUPABASE_ANON_KEY=<your-anon-key>
   SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
   STORAGE_BUCKET=study-resources
   ```
7. Update `frontend/.env`:
   ```env
   VITE_SUPABASE_URL=https://<your-project-id>.supabase.co
   VITE_SUPABASE_ANON_KEY=<your-anon-key>
   ```

---

## 4. Verification & Testing

Run the automated backend test suite:
```bash
cd backend
python tests/test_api_endpoints.py
```
Expected output:
```
Ran 8 tests in 0.735s
OK
```

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import DashboardOverview from './pages/DashboardOverview';
import SubjectsPage from './pages/SubjectsPage';
import ResourcesPage from './pages/ResourcesPage';
import AIAssistantPage from './pages/AIAssistantPage';
import AINotesPage from './pages/AINotesPage';
import QuizFlashcardsPage from './pages/QuizFlashcardsPage';
import StudyPlannerPage from './pages/StudyPlannerPage';
import ProgressTrackerPage from './pages/ProgressTrackerPage';
import SettingsPage from './pages/SettingsPage';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F7FF] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-[#7C3AED] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Landing & Auth Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />

          {/* Protected Dashboard Routes */}
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardOverview />} />
            <Route path="subjects" element={<SubjectsPage />} />
            <Route path="resources" element={<ResourcesPage />} />
            <Route path="assistant" element={<AIAssistantPage />} />
            <Route path="notes" element={<AINotesPage />} />
            <Route path="quizzes" element={<QuizFlashcardsPage />} />
            <Route path="planner" element={<StudyPlannerPage />} />
            <Route path="tracker" element={<ProgressTrackerPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

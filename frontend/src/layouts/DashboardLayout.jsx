import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const PAGE_TITLES = {
  '/app': { title: 'Student Dashboard', subtitle: 'Overview of your academic resources, tasks, and study progress' },
  '/app/subjects': { title: 'My Subjects', subtitle: 'Manage your engineering courses, syllabus units, and topic completion' },
  '/app/resources': { title: 'Resource Library', subtitle: 'Upload and manage PDFs, notes, question papers, and study materials' },
  '/app/assistant': { title: 'AI Study Assistant', subtitle: 'Ask conceptual questions grounded in your uploaded study documents' },
  '/app/notes': { title: 'AI Notes Generator', subtitle: 'Generate high-scoring exam notes, definitions, and model answers' },
  '/app/quizzes': { title: 'Quiz & Flashcards', subtitle: 'Self-evaluate understanding through AI MCQs and interactive flashcards' },
  '/app/planner': { title: 'Study Planner & Timetable', subtitle: 'Organize study sessions, assignment deadlines, and exam countdowns' },
  '/app/tracker': { title: 'Academic Progress Tracker', subtitle: 'Real-time analytics and statistics computed from your study records' },
  '/app/settings': { title: 'Account & Settings', subtitle: 'Manage your student profile, cloud storage, and platform preferences' }
};

export default function DashboardLayout() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  const current = PAGE_TITLES[location.pathname] || {
    title: 'StudyHub 1.0',
    subtitle: 'AI-Based Study Resource Organizer'
  };

  return (
    <div className="min-h-screen bg-[#F8F7FF] flex">
      {/* Sidebar */}
      <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          setIsMobileOpen={setIsMobileOpen}
          title={current.title}
          subtitle={current.subtitle}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

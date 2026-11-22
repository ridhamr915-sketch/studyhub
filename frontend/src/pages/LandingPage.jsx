import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import {
  BookOpen,
  Sparkles,
  ArrowRight,
  FolderArchive,
  Bot,
  FileText,
  BrainCircuit,
  CalendarCheck2,
  TrendingUp,
  CheckCircle2,
  ShieldCheck,
  Zap,
  GraduationCap,
  Layers,
  ChevronRight
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F8F7FF] text-[#1F2937]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
        {/* Subtle Background Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-[#DDD6FE]/40 to-[#EDE9FE]/20 rounded-full blur-3xl -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Project Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#EDE9FE] text-xs font-semibold text-[#7C3AED] shadow-xs mb-8">
            <Sparkles className="w-3.5 h-3.5 text-[#7C3AED]" />
            <span>2nd Year B.Tech CSE Mini-Project • StudyHub 1.0</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#1F2937] max-w-4xl mx-auto leading-[1.15]">
            Your Entire Study World, <br />
            <span className="bg-gradient-to-r from-[#7C3AED] via-[#8B5CF6] to-[#A78BFA] bg-clip-text text-transparent">
              Organized in One Place.
            </span>
          </h1>

          {/* Subheading */}
          <p className="mt-6 text-lg sm:text-xl text-[#6B7280] max-w-2xl mx-auto leading-relaxed">
            Organize your resources, understand difficult concepts, generate smart notes, and manage your academic journey with AI.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/app"
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-2xl font-semibold text-base text-white bg-[#7C3AED] hover:bg-[#6D28D9] shadow-lg shadow-[#7C3AED]/25 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <span>Get Started</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <a
              href="#features"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl font-semibold text-base text-[#4B5563] bg-white hover:bg-[#F8F7FF] border border-[#EDE9FE] shadow-xs hover:border-[#DDD6FE] transition-all"
            >
              <span>Explore Features</span>
            </a>
          </div>

          {/* Dashboard Preview Mockup Card */}
          <div className="mt-16 sm:mt-20 max-w-5xl mx-auto p-3 sm:p-4 rounded-3xl bg-white/70 border border-[#EDE9FE] shadow-2xl backdrop-blur-sm">
            <div className="rounded-2xl border border-[#EDE9FE] bg-[#F8F7FF] overflow-hidden text-left p-6 sm:p-8">
              {/* Mockup Top Header */}
              <div className="flex items-center justify-between pb-6 border-b border-[#EDE9FE]">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  <span className="ml-3 text-xs font-mono font-medium text-[#9CA3AF]">studyhub.student/portal/dashboard</span>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#EDE9FE] text-[#7C3AED]">
                  Live Demo Preview
                </span>
              </div>

              {/* Mockup Dashboard Grid */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="p-5 rounded-2xl bg-white border border-[#EDE9FE] shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#6B7280]">Total Subjects</span>
                    <BookOpen className="w-4 h-4 text-[#7C3AED]" />
                  </div>
                  <p className="text-2xl font-bold text-[#1F2937] mt-2">4 Courses</p>
                  <p className="text-[11px] text-[#10B981] font-medium mt-1">DSA, Discrete Math, DE, COA</p>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-[#EDE9FE] shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#6B7280]">AI Study Assistant</span>
                    <Bot className="w-4 h-4 text-[#7C3AED]" />
                  </div>
                  <p className="text-2xl font-bold text-[#1F2937] mt-2">Gemini 1.5</p>
                  <p className="text-[11px] text-[#7C3AED] font-medium mt-1">Grounded in uploaded syllabus PDFs</p>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-[#EDE9FE] shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#6B7280]">Syllabus Completion</span>
                    <TrendingUp className="w-4 h-4 text-[#7C3AED]" />
                  </div>
                  <p className="text-2xl font-bold text-[#1F2937] mt-2">68.5%</p>
                  <div className="w-full bg-[#EDE9FE] h-2 rounded-full mt-2 overflow-hidden">
                    <div className="bg-[#7C3AED] h-full rounded-full w-[68%]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section id="features" className="py-20 bg-white border-y border-[#EDE9FE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold tracking-widest text-[#7C3AED] uppercase">Academic Superpowers</h2>
            <p className="mt-2 text-3xl sm:text-4xl font-extrabold text-[#1F2937] tracking-tight">
              Everything an Engineering Student Needs in One Place
            </p>
            <p className="mt-4 text-base text-[#6B7280]">
              Built specifically for college workflows. No more scattered PDFs on WhatsApp, missed assignment deadlines, or confusing exam topics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-7 rounded-2xl bg-[#F8F7FF] border border-[#EDE9FE] hover:border-[#C4B5FD] transition-all group">
              <div className="w-12 h-12 rounded-xl bg-white border border-[#EDE9FE] flex items-center justify-center text-[#7C3AED] shadow-xs mb-5 group-hover:scale-110 transition-transform">
                <FolderArchive className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#1F2937]">Resource Library</h3>
              <p className="mt-2 text-xs text-[#6B7280] leading-relaxed">
                Upload PDFs, DOCX, and lecture presentations. Categorized subject-wise and unit-wise with drag-and-drop, tagging, and instant document preview.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-7 rounded-2xl bg-[#F8F7FF] border border-[#EDE9FE] hover:border-[#C4B5FD] transition-all group">
              <div className="w-12 h-12 rounded-xl bg-white border border-[#EDE9FE] flex items-center justify-center text-[#7C3AED] shadow-xs mb-5 group-hover:scale-110 transition-transform">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#1F2937]">AI Study Assistant</h3>
              <p className="mt-2 text-xs text-[#6B7280] leading-relaxed">
                Powered by Gemini. Ask questions directly grounded in your uploaded syllabus PDFs. Distinguishes document facts from general CS knowledge with page references.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-7 rounded-2xl bg-[#F8F7FF] border border-[#EDE9FE] hover:border-[#C4B5FD] transition-all group">
              <div className="w-12 h-12 rounded-xl bg-white border border-[#EDE9FE] flex items-center justify-center text-[#7C3AED] shadow-xs mb-5 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#1F2937]">Smart Notes Generator</h3>
              <p className="mt-2 text-xs text-[#6B7280] leading-relaxed">
                Transform complex PDFs into high-yield exam notes, definitions, 5-mark and 10-mark model answers, or simple ELI5 explanations with a single click.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-7 rounded-2xl bg-[#F8F7FF] border border-[#EDE9FE] hover:border-[#C4B5FD] transition-all group">
              <div className="w-12 h-12 rounded-xl bg-white border border-[#EDE9FE] flex items-center justify-center text-[#7C3AED] shadow-xs mb-5 group-hover:scale-110 transition-transform">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#1F2937]">Quizzes & Flashcards</h3>
              <p className="mt-2 text-xs text-[#6B7280] leading-relaxed">
                Generate customized MCQs with customizable difficulty (Easy/Medium/Hard) and interactive 3D concept flashcards for active recall revision.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-7 rounded-2xl bg-[#F8F7FF] border border-[#EDE9FE] hover:border-[#C4B5FD] transition-all group">
              <div className="w-12 h-12 rounded-xl bg-white border border-[#EDE9FE] flex items-center justify-center text-[#7C3AED] shadow-xs mb-5 group-hover:scale-110 transition-transform">
                <CalendarCheck2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#1F2937]">Study Planner</h3>
              <p className="mt-2 text-xs text-[#6B7280] leading-relaxed">
                Prioritized study tasks, assignment deadline countdowns, exam prep trackers, and a weekly timetable tailored to university schedules.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-7 rounded-2xl bg-[#F8F7FF] border border-[#EDE9FE] hover:border-[#C4B5FD] transition-all group">
              <div className="w-12 h-12 rounded-xl bg-white border border-[#EDE9FE] flex items-center justify-center text-[#7C3AED] shadow-xs mb-5 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#1F2937]">Progress Analytics</h3>
              <p className="mt-2 text-xs text-[#6B7280] leading-relaxed">
                Real data calculations tracking completed topics, quiz average scores, and weekly activity charts. No fabricated vanity metrics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How StudyHub Works */}
      <section id="how-it-works" className="py-20 bg-[#F8F7FF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xs font-bold tracking-widest text-[#7C3AED] uppercase">Streamlined Workflow</h2>
          <p className="mt-2 text-3xl sm:text-4xl font-extrabold text-[#1F2937] tracking-tight">
            How StudyHub Works in 3 Simple Steps
          </p>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="p-8 rounded-2xl bg-white border border-[#EDE9FE] shadow-xs relative">
              <div className="w-10 h-10 rounded-xl bg-[#EDE9FE] text-[#7C3AED] font-bold flex items-center justify-center mb-6">
                1
              </div>
              <h3 className="text-lg font-bold text-[#1F2937]">Upload Semester Materials</h3>
              <p className="mt-2 text-xs text-[#6B7280] leading-relaxed">
                Drop your faculty lecture notes, reference PDFs, and syllabus documents into designated subjects and units.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white border border-[#EDE9FE] shadow-xs relative">
              <div className="w-10 h-10 rounded-xl bg-[#EDE9FE] text-[#7C3AED] font-bold flex items-center justify-center mb-6">
                2
              </div>
              <h3 className="text-lg font-bold text-[#1F2937]">Learn with Grounded AI</h3>
              <p className="mt-2 text-xs text-[#6B7280] leading-relaxed">
                Ask doubts, generate summary notes, extract formulas, and generate revision flashcards grounded directly in your syllabus.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white border border-[#EDE9FE] shadow-xs relative">
              <div className="w-10 h-10 rounded-xl bg-[#EDE9FE] text-[#7C3AED] font-bold flex items-center justify-center mb-6">
                3
              </div>
              <h3 className="text-lg font-bold text-[#1F2937]">Self-Test & Excel</h3>
              <p className="mt-2 text-xs text-[#6B7280] leading-relaxed">
                Attempt AI-generated MCQs, review answer explanations, track syllabus completion, and walk into exams fully confident.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits for Students */}
      <section id="benefits" className="py-20 bg-white border-y border-[#EDE9FE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-xs font-bold tracking-widest text-[#7C3AED] uppercase">Targeted For University Success</h2>
              <p className="mt-2 text-3xl sm:text-4xl font-extrabold text-[#1F2937] tracking-tight">
                Designed by CSE Students, for College Students
              </p>
              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#7C3AED] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-[#1F2937]">Zero Document Hallucination</h4>
                    <p className="text-xs text-[#6B7280] mt-0.5">The AI assistant strictly verifies answers against your uploaded notes and cites page numbers.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#7C3AED] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-[#1F2937]">Clean Lavender & Purple Theme</h4>
                    <p className="text-xs text-[#6B7280] mt-0.5">Carefully calibrated typography and soothing contrast to reduce eye fatigue during late-night study sessions.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#7C3AED] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-[#1F2937]">Row Level Security & Data Privacy</h4>
                    <p className="text-xs text-[#6B7280] mt-0.5">Supabase PostgreSQL RLS policies guarantee your study materials and tasks remain strictly private to your account.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-gradient-to-br from-[#EDE9FE] to-[#F8F7FF] border border-[#C4B5FD]/50 shadow-lg text-left">
              <div className="flex items-center gap-2 mb-4">
                <GraduationCap className="w-6 h-6 text-[#7C3AED]" />
                <h3 className="font-bold text-lg text-[#1F2937]">Academic Demo Modules Included</h3>
              </div>
              <p className="text-xs text-[#6B7280] mb-6">
                Pre-configured with 4 core 2nd-year BTech Computer Science subjects:
              </p>
              <ul className="space-y-3 text-xs font-medium text-[#4B5563]">
                <li className="flex items-center gap-2.5 p-2.5 bg-white rounded-xl border border-[#EDE9FE]">
                  <span className="w-2 h-2 rounded-full bg-[#7C3AED]" />
                  <span>Data Structures & Algorithms (CS-201)</span>
                </li>
                <li className="flex items-center gap-2.5 p-2.5 bg-white rounded-xl border border-[#EDE9FE]">
                  <span className="w-2 h-2 rounded-full bg-[#8B5CF6]" />
                  <span>Discrete Mathematics (CS-202)</span>
                </li>
                <li className="flex items-center gap-2.5 p-2.5 bg-white rounded-xl border border-[#EDE9FE]">
                  <span className="w-2 h-2 rounded-full bg-[#6366F1]" />
                  <span>Digital Electronics (EC-203)</span>
                </li>
                <li className="flex items-center gap-2.5 p-2.5 bg-white rounded-xl border border-[#EDE9FE]">
                  <span className="w-2 h-2 rounded-full bg-[#4F46E5]" />
                  <span>Computer Organization & Architecture (CS-204)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Future Roadmap Section */}
      <section id="roadmap" className="py-20 bg-[#F8F7FF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xs font-bold tracking-widest text-[#7C3AED] uppercase">Three-Year Project Roadmap</h2>
          <p className="mt-2 text-3xl sm:text-4xl font-extrabold text-[#1F2937] tracking-tight">
            Designed for 2nd Year Mini-Project to 4th Year Major Project
          </p>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="p-6 rounded-2xl bg-white border-2 border-[#7C3AED] shadow-sm">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EDE9FE] text-[#7C3AED] uppercase">Current Release</span>
              <h3 className="text-lg font-bold text-[#1F2937] mt-3">StudyHub 1.0 (2nd Year)</h3>
              <p className="text-xs text-[#6B7280] mt-1 mb-4">Foundation & Core Intelligence</p>
              <ul className="space-y-2 text-xs text-[#4B5563]">
                <li>• Subject & syllabus unit organization</li>
                <li>• PDF extraction & Gemini grounding</li>
                <li>• AI Notes generator & MCQ quizzes</li>
                <li>• Study planner & progress tracking</li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#EDE9FE] opacity-90 shadow-xs">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 uppercase">3rd Year Minor Project</span>
              <h3 className="text-lg font-bold text-[#1F2937] mt-3">StudyHub 2.0</h3>
              <p className="text-xs text-[#6B7280] mt-1 mb-4">Adaptive Learning & OCR</p>
              <ul className="space-y-2 text-xs text-[#6B7280]">
                <li>• AI-based weakness detection</li>
                <li>• Handwritten OCR note extraction</li>
                <li>• Voice-based doubt solving</li>
                <li>• Personalized adaptive learning paths</li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#EDE9FE] opacity-80 shadow-xs">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 uppercase">4th Year Major Project</span>
              <h3 className="text-lg font-bold text-[#1F2937] mt-3">StudyHub 3.0</h3>
              <p className="text-xs text-[#6B7280] mt-1 mb-4">Enterprise & Collaborative SaaS</p>
              <ul className="space-y-2 text-xs text-[#6B7280]">
                <li>• Collaborative student study rooms</li>
                <li>• Faculty grading & teacher dashboard</li>
                <li>• University ERP & LMS integration</li>
                <li>• Cross-platform native mobile apps</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-[#EDE9FE] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#7C3AED] to-[#A78BFA] flex items-center justify-center text-white">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#1F2937]">StudyHub 1.0</p>
              <p className="text-[11px] text-[#6B7280]">AI-Based Study Resource Organizer</p>
            </div>
          </div>

          <p className="text-xs text-[#6B7280]">
            B.Tech Computer Science & Engineering • 2nd Year Mini-Project Submission
          </p>

          <div className="flex items-center gap-4 text-xs font-medium text-[#7C3AED]">
            <Link to="/app" className="hover:underline">Dashboard</Link>
            <Link to="/auth?mode=login" className="hover:underline">Student Login</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

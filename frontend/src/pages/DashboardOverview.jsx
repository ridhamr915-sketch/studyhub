import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  FolderArchive,
  CheckCircle2,
  BrainCircuit,
  Bot,
  FileText,
  Calendar,
  Clock,
  ArrowRight,
  Plus,
  Sparkles,
  Upload,
  Layers,
  ChevronRight,
  CalendarClock
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';

export default function DashboardOverview() {
  const { profile } = useAuth();
  const navigate = useNavigate();

  const [analytics, setAnalytics] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [resources, setResources] = useState([]);
  const [deadlines, setDeadlines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [analyticsData, tasksData, resourcesData, deadlinesData] = await Promise.all([
        api.getAnalytics().catch(() => null),
        api.getTasks().catch(() => []),
        api.getResources().catch(() => []),
        api.getDeadlines().catch(() => [])
      ]);

      setAnalytics(analyticsData);
      setTasks(tasksData.slice(0, 4));
      setResources(resourcesData.slice(0, 4));
      setDeadlines(deadlinesData.slice(0, 3));
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTask = async (taskId, currentStatus) => {
    try {
      await api.updateTask(taskId, { is_completed: !currentStatus });
      loadDashboardData();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#7C3AED] via-[#8B5CF6] to-[#A78BFA] text-white shadow-xl shadow-[#7C3AED]/15">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-semibold text-white mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Academic Term: Semester {profile?.semester || 4}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {profile?.full_name || 'Student'}! 🚀
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-purple-100 max-w-xl leading-relaxed">
            Your resources and AI study tools are synchronized. You have {analytics?.pending_tasks || 0} tasks pending today.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/app/assistant"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-white text-[#7C3AED] hover:bg-purple-50 transition-all shadow-xs"
            >
              <Bot className="w-4 h-4" />
              <span>Ask AI Assistant</span>
            </Link>

            <Link
              to="/app/resources"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white backdrop-blur-xs transition-all border border-white/20"
            >
              <Upload className="w-4 h-4" />
              <span>Upload New PDF</span>
            </Link>
          </div>
        </div>

        {/* Decorative Circles */}
        <div className="absolute right-0 bottom-0 translate-x-10 translate-y-10 w-72 h-72 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 rounded-2xl bg-white border border-[#EDE9FE] shadow-xs hover:border-[#DDD6FE] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B7280]">Total Subjects</span>
            <div className="p-2 rounded-xl bg-[#EDE9FE] text-[#7C3AED]">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] mt-3">
            {analytics?.total_subjects || 4}
          </p>
          <p className="text-[11px] text-[#7C3AED] font-medium mt-1">Enrolled Courses</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#EDE9FE] shadow-xs hover:border-[#DDD6FE] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B7280]">Study Resources</span>
            <div className="p-2 rounded-xl bg-purple-100 text-[#7C3AED]">
              <FolderArchive className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] mt-3">
            {analytics?.total_resources || resources.length}
          </p>
          <p className="text-[11px] text-[#6B7280] font-medium mt-1">Uploaded & Indexed</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#EDE9FE] shadow-xs hover:border-[#DDD6FE] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B7280]">Tasks Completed</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] mt-3">
            {analytics?.completed_tasks || 0}
            <span className="text-xs font-normal text-[#9CA3AF] ml-1">/ {analytics?.total_tasks || 0}</span>
          </p>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">
            {analytics?.total_tasks ? Math.round((analytics.completed_tasks / analytics.total_tasks) * 100) : 0}% Completion
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#EDE9FE] shadow-xs hover:border-[#DDD6FE] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B7280]">Quiz Attempts</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <BrainCircuit className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] mt-3">
            {analytics?.quiz_attempts || 0}
          </p>
          <p className="text-[11px] text-amber-600 font-medium mt-1">
            {analytics?.average_quiz_score ? `${analytics.average_quiz_score}% Avg Score` : 'No quizzes yet'}
          </p>
        </div>
      </div>

      {/* Main Grid: Weekly Chart & Exam Countdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Study Activity Chart */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white border border-[#EDE9FE] shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-[#1F2937]">Weekly Study Activity</h3>
              <p className="text-xs text-[#6B7280]">Computed from logged tasks and quiz assessments</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#EDE9FE] text-[#7C3AED]">
              Past 7 Days
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={analytics?.weekly_activity || [
                  { day: 'Mon', study_hours: 1.5 },
                  { day: 'Tue', study_hours: 2.0 },
                  { day: 'Wed', study_hours: 0.5 },
                  { day: 'Thu', study_hours: 3.0 },
                  { day: 'Fri', study_hours: 1.0 },
                  { day: 'Sat', study_hours: 2.5 },
                  { day: 'Sun', study_hours: 1.2 }
                ]}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#7C3AED" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F0FA" />
                <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} unit="h" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1F2937', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '11px' }}
                  formatter={(val) => [`${val} hrs`, 'Study Effort']}
                />
                <Area type="monotone" dataKey="study_hours" stroke="#7C3AED" strokeWidth={2.5} fillOpacity={1} fill="url(#purpleGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Upcoming Deadlines & Exam Countdown */}
        <div className="p-6 rounded-3xl bg-white border border-[#EDE9FE] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#EDE9FE]">
              <div className="flex items-center gap-2">
                <CalendarClock className="w-4 h-4 text-[#7C3AED]" />
                <h3 className="text-sm font-bold text-[#1F2937]">Upcoming Deadlines</h3>
              </div>
              <Link to="/app/planner" className="text-xs font-semibold text-[#7C3AED] hover:underline">
                View All
              </Link>
            </div>

            <div className="mt-4 space-y-3">
              {deadlines.length > 0 ? (
                deadlines.map((item) => (
                  <div key={item.id} className="p-3 rounded-2xl bg-[#F8F7FF] border border-[#EDE9FE] hover:border-[#C4B5FD] transition-all">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.priority === 'Urgent' ? 'bg-red-100 text-red-600' : 'bg-purple-100 text-[#7C3AED]'
                      }`}>
                        {item.priority}
                      </span>
                      <span className="text-[11px] font-semibold text-[#7C3AED]">
                        {item.days_remaining !== undefined ? `${item.days_remaining}d left` : 'Due soon'}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-[#1F2937] mt-1.5 truncate">{item.title}</p>
                    <p className="text-[11px] text-[#6B7280] truncate mt-0.5">{item.description || 'College course requirement'}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-[#9CA3AF]">
                  <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-400 mb-2" />
                  <p className="text-xs font-medium">All caught up! No imminent deadlines.</p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#EDE9FE]">
            <Link
              to="/app/planner"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-[#7C3AED] bg-[#EDE9FE] hover:bg-[#DDD6FE] transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Schedule New Task</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Lower Section: Today's Tasks & Recent Resources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Tasks */}
        <div className="p-6 rounded-3xl bg-white border border-[#EDE9FE] shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#EDE9FE] mb-4">
            <div>
              <h3 className="text-base font-bold text-[#1F2937]">Today's Study Checklist</h3>
              <p className="text-xs text-[#6B7280]">Click to mark completion</p>
            </div>
            <Link to="/app/planner" className="text-xs font-semibold text-[#7C3AED] hover:underline">
              Planner &rarr;
            </Link>
          </div>

          <div className="space-y-2.5">
            {tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => handleToggleTask(task.id, task.is_completed)}
                className={`p-3.5 rounded-2xl border transition-all flex items-center gap-3 cursor-pointer ${
                  task.is_completed
                    ? 'bg-[#F8F7FF] border-[#EDE9FE] opacity-60'
                    : 'bg-white border-[#EDE9FE] hover:border-[#C4B5FD] shadow-xs'
                }`}
              >
                <div className={`w-5 h-5 rounded-lg flex items-center justify-center transition-colors ${
                  task.is_completed ? 'bg-emerald-500 text-white' : 'border-2 border-[#DDD6FE]'
                }`}>
                  {task.is_completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                </div>

                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-bold truncate ${task.is_completed ? 'line-through text-[#9CA3AF]' : 'text-[#1F2937]'}`}>
                    {task.title}
                  </p>
                  <p className="text-[11px] text-[#6B7280] truncate mt-0.5">
                    {task.description || 'Task scheduled'}
                  </p>
                </div>

                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#EDE9FE] text-[#7C3AED]">
                  {task.priority}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Uploaded Resources */}
        <div className="p-6 rounded-3xl bg-white border border-[#EDE9FE] shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#EDE9FE] mb-4">
            <div>
              <h3 className="text-base font-bold text-[#1F2937]">Recent Study Resources</h3>
              <p className="text-xs text-[#6B7280]">Instant access to your notes & PDFs</p>
            </div>
            <Link to="/app/resources" className="text-xs font-semibold text-[#7C3AED] hover:underline">
              Library &rarr;
            </Link>
          </div>

          <div className="space-y-2.5">
            {resources.map((res) => (
              <div
                key={res.id}
                className="p-3.5 rounded-2xl bg-[#F8F7FF] border border-[#EDE9FE] hover:border-[#C4B5FD] transition-all flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-white border border-[#EDE9FE] flex items-center justify-center text-[#7C3AED] font-bold text-xs shrink-0">
                    {res.file_type?.toUpperCase() || 'PDF'}
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-bold text-[#1F2937] truncate">{res.title}</p>
                    <p className="text-[11px] text-[#6B7280] truncate mt-0.5">
                      {res.file_name} • {(res.file_size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    to={`/app/assistant?resource_id=${res.id}`}
                    className="p-2 rounded-xl bg-white border border-[#EDE9FE] text-[#7C3AED] hover:bg-[#EDE9FE] transition-colors"
                    title="Ask AI about this PDF"
                  >
                    <Bot className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    to={`/app/notes?resource_id=${res.id}`}
                    className="p-2 rounded-xl bg-white border border-[#EDE9FE] text-[#7C3AED] hover:bg-[#EDE9FE] transition-colors"
                    title="Generate AI Notes"
                  >
                    <FileText className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  Award,
  CheckCircle2,
  BrainCircuit,
  BookOpen,
  Calendar,
  Sparkles,
  ArrowRight,
  FolderArchive
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { api } from '../lib/api';
import EmptyState from '../components/EmptyState';

const PIE_COLORS = ['#10B981', '#DDD6FE'];

export default function ProgressTrackerPage() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const data = await api.getAnalytics();
      setAnalytics(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const hasData = analytics && (analytics.total_tasks > 0 || analytics.quiz_attempts > 0 || analytics.total_resources > 0);

  const taskPieData = analytics ? [
    { name: 'Completed', value: analytics.completed_tasks },
    { name: 'Pending', value: analytics.pending_tasks }
  ] : [];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#1F2937]">Academic Progress Tracker</h2>
          <p className="text-xs text-[#6B7280]">
            Real-time analytics and syllabus mastery calculated strictly from your study records
          </p>
        </div>
      </div>

      {!hasData ? (
        <EmptyState
          icon={TrendingUp}
          title="No Study Records Yet"
          description="Complete your first study task or attempt an AI quiz to start building your academic analytics!"
          actionLabel="Start Studying"
          onAction={() => window.location.href = '/app/planner'}
        />
      ) : (
        <>
          {/* Key Metric Overview Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="p-5 rounded-3xl bg-white border border-[#EDE9FE] shadow-xs">
              <span className="text-xs font-semibold text-[#6B7280]">Total Tasks</span>
              <p className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] mt-2">
                {analytics.total_tasks}
              </p>
              <p className="text-[11px] text-emerald-600 font-medium mt-1">
                {analytics.completed_tasks} Completed ({analytics.total_tasks ? Math.round((analytics.completed_tasks / analytics.total_tasks) * 100) : 0}%)
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-[#EDE9FE] shadow-xs">
              <span className="text-xs font-semibold text-[#6B7280]">Quiz Attempts</span>
              <p className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] mt-2">
                {analytics.quiz_attempts}
              </p>
              <p className="text-[11px] text-[#7C3AED] font-medium mt-1">
                {analytics.average_quiz_score}% Average Score
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-[#EDE9FE] shadow-xs">
              <span className="text-xs font-semibold text-[#6B7280]">Study Resources</span>
              <p className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] mt-2">
                {analytics.total_resources}
              </p>
              <p className="text-[11px] text-[#6B7280] font-medium mt-1">
                Indexed in Vault
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-[#EDE9FE] shadow-xs">
              <span className="text-xs font-semibold text-[#6B7280]">Logged Study Effort</span>
              <p className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] mt-2">
                {analytics.study_time_hours}
                <span className="text-sm font-normal text-[#9CA3AF] ml-1">hrs</span>
              </p>
              <p className="text-[11px] text-purple-600 font-medium mt-1">
                Last 7 Days Activity
              </p>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Weekly Activity Bar Chart */}
            <div className="lg:col-span-8 p-6 rounded-3xl bg-white border border-[#EDE9FE] shadow-xs">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-base font-bold text-[#1F2937]">Weekly Task & Assessment Activity</h3>
                  <p className="text-xs text-[#6B7280]">Number of completed tasks per day</p>
                </div>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.weekly_activity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F0FA" />
                    <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} />
                    <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1F2937', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '11px' }}
                      formatter={(val) => [val, 'Completed Tasks']}
                    />
                    <Bar dataKey="tasks_completed" fill="#7C3AED" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Task Completion Donut */}
            <div className="lg:col-span-4 p-6 rounded-3xl bg-white border border-[#EDE9FE] shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-[#1F2937]">Task Completion Ratio</h3>
                <p className="text-xs text-[#6B7280]">Pending vs Completed Tasks</p>

                <div className="h-48 w-full mt-4 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={taskPieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {taskPieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="flex justify-around pt-3 border-t border-[#EDE9FE] text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-[#4B5563]">Completed ({analytics.completed_tasks})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#DDD6FE]" />
                  <span className="text-[#4B5563]">Pending ({analytics.pending_tasks})</span>
                </div>
              </div>
            </div>
          </div>

          {/* Subject-Wise Syllabus Completion */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#EDE9FE] shadow-xs">
            <h3 className="text-base font-bold text-[#1F2937] mb-1">Subject-Wise Syllabus Progress</h3>
            <p className="text-xs text-[#6B7280] mb-6">Calculated from checked topics in My Subjects</p>

            <div className="space-y-4">
              {(analytics.subject_progress || []).map((sp) => (
                <div key={sp.subject_id} className="p-4 rounded-2xl bg-[#F8F7FF] border border-[#EDE9FE]">
                  <div className="flex items-center justify-between text-xs font-semibold mb-2">
                    <span className="text-[#1F2937] font-bold">{sp.subject_name}</span>
                    <span className="text-[#7C3AED]">
                      {sp.completed_topics} / {sp.total_topics} Topics ({sp.completion_percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-[#EDE9FE] h-2.5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${sp.completion_percentage}%`, backgroundColor: sp.color || '#7C3AED' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

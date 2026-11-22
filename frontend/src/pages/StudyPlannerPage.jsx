import React, { useState, useEffect } from 'react';
import {
  CalendarCheck2,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Clock,
  AlertCircle,
  Calendar,
  BookOpen,
  Filter,
  Flame,
  Check
} from 'lucide-react';
import { api } from '../lib/api';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';

export default function StudyPlannerPage() {
  const [tasks, setTasks] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [deadlines, setDeadlines] = useState([]);
  const [timetable, setTimetable] = useState(null);
  const [viewMode, setViewMode] = useState('tasks'); // 'tasks' or 'timetable'

  // Task Filter
  const [filterType, setFilterType] = useState('all'); // 'all', 'today', 'pending', 'completed'

  // Modals
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [taskDate, setTaskDate] = useState(new Date().toISOString().split('T')[0]);
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [taskType, setTaskType] = useState('study');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [tasksData, subsData, deadlinesData, timetableData] = await Promise.all([
        api.getTasks(),
        api.getSubjects(),
        api.getDeadlines(),
        api.getTimetable()
      ]);
      setTasks(tasksData);
      setSubjects(subsData);
      setDeadlines(deadlinesData);
      setTimetable(timetableData);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await api.createTask({
        title,
        description,
        subject_id: subjectId || undefined,
        task_date: taskDate,
        deadline: deadline ? `${deadline}:00` : undefined,
        priority,
        task_type: taskType
      });
      setIsAddTaskOpen(false);
      resetForm();
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleToggleComplete = async (taskId, currentStatus) => {
    try {
      await api.updateTask(taskId, { is_completed: !currentStatus });
      loadData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Delete this task?')) {
      await api.deleteTask(taskId);
      loadData();
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setSubjectId('');
    setDeadline('');
    setPriority('Medium');
    setTaskType('study');
  };

  const todayStr = new Date().toISOString().split('T')[0];

  const filteredTasks = tasks.filter(t => {
    if (filterType === 'today') return t.task_date === todayStr;
    if (filterType === 'pending') return !t.is_completed;
    if (filterType === 'completed') return t.is_completed;
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#1F2937]">Study Planner & Schedules</h2>
          <p className="text-xs text-[#6B7280]">
            Organize daily revision checklists, assignment deadlines, and exam preparations
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex p-1 bg-white rounded-2xl border border-[#EDE9FE] shadow-xs">
            <button
              onClick={() => setViewMode('tasks')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                viewMode === 'tasks' ? 'bg-[#EDE9FE] text-[#7C3AED]' : 'text-[#6B7280]'
              }`}
            >
              Task Checklist
            </button>
            <button
              onClick={() => setViewMode('timetable')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                viewMode === 'timetable' ? 'bg-[#EDE9FE] text-[#7C3AED]' : 'text-[#6B7280]'
              }`}
            >
              Weekly Schedule
            </button>
          </div>

          <button
            onClick={() => setIsAddTaskOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[#7C3AED] hover:bg-[#6D28D9] shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Study Task</span>
          </button>
        </div>
      </div>

      {viewMode === 'tasks' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Tasks List */}
          <div className="lg:col-span-8 space-y-4">
            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 pb-2">
              {[
                { id: 'all', label: 'All Tasks' },
                { id: 'today', label: "Today's Checklist" },
                { id: 'pending', label: 'Pending' },
                { id: 'completed', label: 'Completed' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setFilterType(f.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    filterType === f.id
                      ? 'bg-[#7C3AED] text-white shadow-xs'
                      : 'bg-white border border-[#EDE9FE] text-[#6B7280] hover:text-[#1F2937]'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {filteredTasks.length === 0 ? (
              <EmptyState
                icon={CalendarCheck2}
                title="No tasks match this filter"
                description="Keep your semester productivity on track by scheduling daily study goals."
                actionLabel="Create Task"
                onAction={() => setIsAddTaskOpen(true)}
              />
            ) : (
              <div className="space-y-3">
                {filteredTasks.map((task) => {
                  const subject = subjects.find(s => s.id === task.subject_id);

                  return (
                    <div
                      key={task.id}
                      className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                        task.is_completed
                          ? 'bg-[#F8F7FF] border-[#EDE9FE] opacity-60'
                          : 'bg-white border-[#EDE9FE] hover:border-[#C4B5FD] shadow-xs'
                      }`}
                    >
                      <div className="flex items-start gap-3.5 flex-1 min-w-0">
                        <button
                          onClick={() => handleToggleComplete(task.id, task.is_completed)}
                          className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                            task.is_completed ? 'bg-emerald-500 text-white' : 'border-2 border-[#DDD6FE]'
                          }`}
                        >
                          {task.is_completed && <Check className="w-3.5 h-3.5" />}
                        </button>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`text-xs font-bold ${task.is_completed ? 'line-through text-[#9CA3AF]' : 'text-[#1F2937]'}`}>
                              {task.title}
                            </span>
                            {subject && (
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#EDE9FE] text-[#7C3AED]">
                                {subject.name}
                              </span>
                            )}
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-[#4B5563] uppercase">
                              {task.task_type}
                            </span>
                          </div>

                          {task.description && (
                            <p className="text-xs text-[#6B7280] mt-1 line-clamp-2">
                              {task.description}
                            </p>
                          )}

                          <div className="mt-2.5 flex items-center gap-4 text-[11px] text-[#9CA3AF]">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-[#7C3AED]" />
                              <span>{task.task_date}</span>
                            </span>
                            {task.deadline && (
                              <span className="flex items-center gap-1 text-red-500 font-semibold">
                                <Clock className="w-3 h-3" />
                                <span>Deadline: {task.deadline.replace('T', ' ')}</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                          task.priority === 'Urgent'
                            ? 'bg-red-100 text-red-600'
                            : task.priority === 'High'
                            ? 'bg-amber-100 text-amber-600'
                            : 'bg-purple-100 text-[#7C3AED]'
                        }`}>
                          {task.priority}
                        </span>

                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="p-1.5 text-[#9CA3AF] hover:text-red-500 rounded-lg transition-colors ml-2"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Side: Deadlines & Exam Countdown */}
          <div className="lg:col-span-4 space-y-5">
            <div className="p-6 rounded-3xl bg-white border border-[#EDE9FE] shadow-xs">
              <h3 className="text-sm font-bold text-[#1F2937] pb-3 border-b border-[#EDE9FE] flex items-center gap-2">
                <Flame className="w-4 h-4 text-[#7C3AED]" />
                <span>Assignment & Exam Deadlines</span>
              </h3>

              <div className="mt-4 space-y-3">
                {deadlines.length === 0 ? (
                  <p className="text-xs text-[#9CA3AF] text-center py-6">
                    No active deadlines recorded. Add deadlines when creating tasks.
                  </p>
                ) : (
                  deadlines.map((dl) => (
                    <div key={dl.id} className="p-3.5 rounded-2xl bg-[#F8F7FF] border border-[#EDE9FE]">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-600">
                          {dl.days_remaining} Days Left
                        </span>
                        <span className="text-[10px] font-bold text-[#7C3AED] uppercase">{dl.task_type}</span>
                      </div>
                      <p className="text-xs font-bold text-[#1F2937] mt-1.5 truncate">{dl.title}</p>
                      <p className="text-[11px] text-[#6B7280] mt-0.5">{dl.deadline ? dl.deadline.split('T')[0] : 'No date'}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Timetable View */
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#EDE9FE] shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#EDE9FE]">
            <div>
              <h3 className="text-base font-bold text-[#1F2937]">B.Tech CSE Recommended Timetable</h3>
              <p className="text-xs text-[#6B7280]">Balanced schedule for core engineering coursework and revision</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {timetable && Object.entries(timetable).map(([day, slots]) => (
              <div key={day} className="p-4 rounded-2xl bg-[#F8F7FF] border border-[#EDE9FE] space-y-3">
                <h4 className="text-xs font-bold text-[#7C3AED] uppercase tracking-wider">{day}</h4>
                <div className="space-y-2">
                  {slots.map((slot, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-white border border-[#EDE9FE] text-xs">
                      <p className="font-semibold text-[#1F2937]">{slot.subject}</p>
                      <p className="text-[11px] text-[#6B7280] mt-0.5">{slot.time} • {slot.activity}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Add Task */}
      <Modal isOpen={isAddTaskOpen} onClose={() => setIsAddTaskOpen(false)} title="Schedule Study Task">
        <form onSubmit={handleCreateTask} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#374151]">Task Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Solve Discrete Math Propositional Logic Proofs"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full px-3 py-2 text-xs bg-[#F8F7FF] border border-[#EDE9FE] rounded-xl focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#374151]">Associated Subject</label>
            <select
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              className="mt-1 block w-full px-3 py-2 text-xs bg-[#F8F7FF] border border-[#EDE9FE] rounded-xl focus:bg-white focus:outline-none"
            >
              <option value="">-- No Subject Assigned --</option>
              {subjects.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.code || 'Course'})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#374151]">Scheduled Date</label>
              <input
                type="date"
                required
                value={taskDate}
                onChange={(e) => setTaskDate(e.target.value)}
                className="mt-1 block w-full px-3 py-2 text-xs bg-[#F8F7FF] border border-[#EDE9FE] rounded-xl focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#374151]">Deadline (Optional)</label>
              <input
                type="datetime-local"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="mt-1 block w-full px-3 py-2 text-xs bg-[#F8F7FF] border border-[#EDE9FE] rounded-xl focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#374151]">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="mt-1 block w-full px-3 py-2 text-xs bg-[#F8F7FF] border border-[#EDE9FE] rounded-xl focus:bg-white focus:outline-none"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#374151]">Category</label>
              <select
                value={taskType}
                onChange={(e) => setTaskType(e.target.value)}
                className="mt-1 block w-full px-3 py-2 text-xs bg-[#F8F7FF] border border-[#EDE9FE] rounded-xl focus:bg-white focus:outline-none"
              >
                <option value="study">Regular Study</option>
                <option value="assignment">Assignment</option>
                <option value="exam_prep">Exam Prep</option>
                <option value="revision">Revision</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#374151]">Details / Notes</label>
            <textarea
              rows={2}
              placeholder="Key sub-topics to cover..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full px-3 py-2 text-xs bg-[#F8F7FF] border border-[#EDE9FE] rounded-xl focus:bg-white focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddTaskOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-[#6B7280]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-[#7C3AED] rounded-xl"
            >
              Add Task
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

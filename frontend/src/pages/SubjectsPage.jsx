import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronUp,
  Layers,
  Sparkles,
  BookMarked
} from 'lucide-react';
import { api } from '../lib/api';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedSubject, setExpandedSubject] = useState(null);

  // Modals
  const [isAddSubjectOpen, setIsAddSubjectOpen] = useState(false);
  const [isAddUnitOpen, setIsAddUnitOpen] = useState(false);
  const [isAddTopicOpen, setIsAddTopicOpen] = useState(false);
  const [activeSubjectId, setActiveSubjectId] = useState(null);
  const [activeUnitId, setActiveUnitId] = useState(null);

  // Form states
  const [newSubName, setNewSubName] = useState('');
  const [newSubCode, setNewSubCode] = useState('');
  const [newSubSem, setNewSubSem] = useState(4);
  const [newSubDesc, setNewSubDesc] = useState('');
  const [newSubColor, setNewSubColor] = useState('#7C3AED');

  const [newUnitNum, setNewUnitNum] = useState(1);
  const [newUnitTitle, setNewUnitTitle] = useState('');
  const [newUnitDesc, setNewUnitDesc] = useState('');

  const [newTopicTitle, setNewTopicTitle] = useState('');

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    setLoading(true);
    try {
      const data = await api.getSubjects();
      setSubjects(data);
      if (data.length > 0 && !expandedSubject) {
        setExpandedSubject(data[0].id);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSubject = async (e) => {
    e.preventDefault();
    if (!newSubName.trim()) return;
    try {
      await api.createSubject({
        name: newSubName,
        code: newSubCode,
        semester: parseInt(newSubSem, 10),
        description: newSubDesc,
        color: newSubColor
      });
      setIsAddSubjectOpen(false);
      setNewSubName('');
      setNewSubCode('');
      setNewSubDesc('');
      loadSubjects();
    } catch (e) {
      alert(e.message);
    }
  };

  const handleDeleteSubject = async (id, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this subject and its topics?')) {
      await api.deleteSubject(id);
      loadSubjects();
    }
  };

  const handleAddUnit = async (e) => {
    e.preventDefault();
    if (!newUnitTitle.trim()) return;
    try {
      await api.addUnit(activeSubjectId, {
        unit_number: parseInt(newUnitNum, 10),
        title: newUnitTitle,
        description: newUnitDesc
      });
      setIsAddUnitOpen(false);
      setNewUnitTitle('');
      setNewUnitDesc('');
      loadSubjects();
    } catch (e) {
      alert(e.message);
    }
  };

  const handleAddTopic = async (e) => {
    e.preventDefault();
    if (!newTopicTitle.trim()) return;
    try {
      await api.addTopic(activeSubjectId, activeUnitId, {
        title: newTopicTitle
      });
      setIsAddTopicOpen(false);
      setNewTopicTitle('');
      loadSubjects();
    } catch (e) {
      alert(e.message);
    }
  };

  const handleToggleTopic = async (topicId) => {
    try {
      await api.toggleTopic(topicId);
      loadSubjects();
    } catch (e) {
      console.error(e);
    }
  };

  const calculateProgress = (subject) => {
    let total = 0;
    let completed = 0;
    (subject.units || []).forEach((unit) => {
      (unit.topics || []).forEach((top) => {
        total++;
        if (top.is_completed) completed++;
      });
    });
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#1F2937]">Academic Subjects & Syllabus</h2>
          <p className="text-xs text-[#6B7280]">Structure your semester courses, units, and learning checklist</p>
        </div>
        <button
          onClick={() => setIsAddSubjectOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[#7C3AED] hover:bg-[#6D28D9] shadow-md shadow-[#7C3AED]/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Subject</span>
        </button>
      </div>

      {/* Subject Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {subjects.map((sub) => {
          const progress = calculateProgress(sub);
          const isExpanded = expandedSubject === sub.id;

          return (
            <div
              key={sub.id}
              onClick={() => setExpandedSubject(isExpanded ? null : sub.id)}
              className={`p-6 rounded-3xl bg-white border transition-all cursor-pointer ${
                isExpanded
                  ? 'border-[#7C3AED] shadow-md shadow-[#7C3AED]/10 ring-2 ring-[#7C3AED]/10'
                  : 'border-[#EDE9FE] shadow-xs hover:border-[#C4B5FD]'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shadow-xs"
                    style={{ backgroundColor: sub.color || '#7C3AED' }}
                  >
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#1F2937] leading-tight">{sub.name}</h3>
                    <p className="text-[11px] font-mono text-[#6B7280] mt-0.5">{sub.code || 'Course Code'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {sub.is_demo ? (
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#EDE9FE] text-[#7C3AED] uppercase">
                      Demo
                    </span>
                  ) : (
                    <button
                      onClick={(e) => handleDeleteSubject(sub.id, e)}
                      className="p-1.5 text-[#9CA3AF] hover:text-red-500 rounded-lg transition-colors"
                      title="Delete subject"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <p className="text-xs text-[#6B7280] line-clamp-2 mt-3 leading-relaxed">
                {sub.description || 'No description provided.'}
              </p>

              {/* Progress Bar */}
              <div className="mt-5 pt-4 border-t border-[#EDE9FE]">
                <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
                  <span className="text-[#6B7280]">Topic Completion</span>
                  <span className="text-[#7C3AED] font-bold">{progress}%</span>
                </div>
                <div className="w-full bg-[#EDE9FE] h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${progress}%`, backgroundColor: sub.color || '#7C3AED' }}
                  />
                </div>
              </div>

              {/* Toggle details indicator */}
              <div className="mt-3 flex items-center justify-between text-[11px] text-[#7C3AED] font-semibold">
                <span>{(sub.units || []).length} Units</span>
                <span className="flex items-center gap-1">
                  {isExpanded ? 'Hide Syllabus' : 'View Syllabus'}
                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Expanded Subject Detail & Syllabus Units Tree */}
      {expandedSubject && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#EDE9FE] shadow-sm animate-in fade-in duration-200">
          {(() => {
            const currentSub = subjects.find((s) => s.id === expandedSubject);
            if (!currentSub) return null;

            return (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-[#EDE9FE] gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#EDE9FE] text-[#7C3AED]">
                        Sem {currentSub.semester}
                      </span>
                      <h3 className="text-lg font-bold text-[#1F2937]">{currentSub.name} — Syllabus Breakdown</h3>
                    </div>
                    <p className="text-xs text-[#6B7280] mt-1">{currentSub.description}</p>
                  </div>

                  <button
                    onClick={() => {
                      setActiveSubjectId(currentSub.id);
                      setNewUnitNum((currentSub.units || []).length + 1);
                      setIsAddUnitOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-[#7C3AED] bg-[#EDE9FE] hover:bg-[#DDD6FE] transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Unit</span>
                  </button>
                </div>

                {/* Units List */}
                <div className="space-y-5">
                  {(currentSub.units || []).length === 0 ? (
                    <EmptyState
                      icon={Layers}
                      title="No Units Added Yet"
                      description="Create Unit 1 to start organizing topics and study tracking."
                      actionLabel="Add Unit 1"
                      onAction={() => {
                        setActiveSubjectId(currentSub.id);
                        setIsAddUnitOpen(true);
                      }}
                    />
                  ) : (
                    currentSub.units.map((unit) => (
                      <div key={unit.id} className="p-5 rounded-2xl bg-[#F8F7FF] border border-[#EDE9FE]">
                        <div className="flex items-center justify-between pb-3 border-b border-[#EDE9FE]">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-lg bg-white text-[#7C3AED] font-bold text-xs flex items-center justify-center border border-[#EDE9FE]">
                              {unit.unit_number}
                            </span>
                            <h4 className="text-sm font-bold text-[#1F2937]">{unit.title}</h4>
                          </div>
                          <button
                            onClick={() => {
                              setActiveSubjectId(currentSub.id);
                              setActiveUnitId(unit.id);
                              setIsAddTopicOpen(true);
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-[#7C3AED] bg-white border border-[#EDE9FE] hover:bg-[#EDE9FE] transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Add Topic</span>
                          </button>
                        </div>

                        {unit.description && (
                          <p className="text-xs text-[#6B7280] mt-2 mb-3">{unit.description}</p>
                        )}

                        {/* Topics List */}
                        <div className="mt-3 space-y-2">
                          {(unit.topics || []).map((topic) => (
                            <div
                              key={topic.id}
                              onClick={() => handleToggleTopic(topic.id)}
                              className={`p-3 rounded-xl bg-white border transition-all flex items-center gap-3 cursor-pointer ${
                                topic.is_completed
                                  ? 'border-emerald-200 bg-emerald-50/30'
                                  : 'border-[#EDE9FE] hover:border-[#C4B5FD]'
                              }`}
                            >
                              <div className={`w-4 h-4 rounded-md flex items-center justify-center transition-colors ${
                                topic.is_completed ? 'bg-emerald-500 text-white' : 'border-2 border-[#DDD6FE]'
                              }`}>
                                {topic.is_completed && <CheckCircle2 className="w-3 h-3" />}
                              </div>
                              <span className={`text-xs font-medium ${topic.is_completed ? 'line-through text-[#9CA3AF]' : 'text-[#1F2937]'}`}>
                                {topic.title}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Modal: Create Subject */}
      <Modal isOpen={isAddSubjectOpen} onClose={() => setIsAddSubjectOpen(false)} title="Add Academic Subject">
        <form onSubmit={handleCreateSubject} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#374151]">Subject Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Operating Systems"
              value={newSubName}
              onChange={(e) => setNewSubName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 text-xs bg-[#F8F7FF] border border-[#EDE9FE] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#374151]">Course Code</label>
              <input
                type="text"
                placeholder="e.g. CS-205"
                value={newSubCode}
                onChange={(e) => setNewSubCode(e.target.value)}
                className="mt-1 block w-full px-3 py-2 text-xs bg-[#F8F7FF] border border-[#EDE9FE] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#374151]">Semester</label>
              <select
                value={newSubSem}
                onChange={(e) => setNewSubSem(e.target.value)}
                className="mt-1 block w-full px-3 py-2 text-xs bg-[#F8F7FF] border border-[#EDE9FE] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                  <option key={s} value={s}>Semester {s}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#374151]">Course Description</label>
            <textarea
              rows={2}
              placeholder="Brief course objectives and topics..."
              value={newSubDesc}
              onChange={(e) => setNewSubDesc(e.target.value)}
              className="mt-1 block w-full px-3 py-2 text-xs bg-[#F8F7FF] border border-[#EDE9FE] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#374151]">Accent Color</label>
            <div className="flex gap-2 mt-1.5">
              {['#7C3AED', '#8B5CF6', '#6366F1', '#4F46E5', '#EC4899', '#10B981'].map(color => (
                <button
                  type="button"
                  key={color}
                  onClick={() => setNewSubColor(color)}
                  className={`w-7 h-7 rounded-full transition-transform ${newSubColor === color ? 'scale-125 ring-2 ring-offset-2 ring-[#7C3AED]' : ''}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddSubjectOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-[#6B7280] hover:text-[#1F2937]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-[#7C3AED] hover:bg-[#6D28D9] rounded-xl shadow-xs"
            >
              Create Subject
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Add Unit */}
      <Modal isOpen={isAddUnitOpen} onClose={() => setIsAddUnitOpen(false)} title="Add Syllabus Unit">
        <form onSubmit={handleAddUnit} className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#374151]">Unit Number</label>
              <input
                type="number"
                min="1"
                required
                value={newUnitNum}
                onChange={(e) => setNewUnitNum(e.target.value)}
                className="mt-1 block w-full px-3 py-2 text-xs bg-[#F8F7FF] border border-[#EDE9FE] rounded-xl"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold text-[#374151]">Unit Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Memory Management"
                value={newUnitTitle}
                onChange={(e) => setNewUnitTitle(e.target.value)}
                className="mt-1 block w-full px-3 py-2 text-xs bg-[#F8F7FF] border border-[#EDE9FE] rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#374151]">Topics Summary</label>
            <textarea
              rows={2}
              placeholder="e.g. Paging, Segmentation, Virtual Memory..."
              value={newUnitDesc}
              onChange={(e) => setNewUnitDesc(e.target.value)}
              className="mt-1 block w-full px-3 py-2 text-xs bg-[#F8F7FF] border border-[#EDE9FE] rounded-xl"
            />
          </div>

          <div className="pt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddUnitOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-[#6B7280]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-[#7C3AED] rounded-xl"
            >
              Add Unit
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Add Topic */}
      <Modal isOpen={isAddTopicOpen} onClose={() => setIsAddTopicOpen(false)} title="Add Learning Topic">
        <form onSubmit={handleAddTopic} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#374151]">Topic Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Multi-level Paging and TLB"
              value={newTopicTitle}
              onChange={(e) => setNewTopicTitle(e.target.value)}
              className="mt-1 block w-full px-3 py-2 text-xs bg-[#F8F7FF] border border-[#EDE9FE] rounded-xl"
            />
          </div>

          <div className="pt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddTopicOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-[#6B7280]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-[#7C3AED] rounded-xl"
            >
              Add Topic
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  FileText,
  Sparkles,
  Copy,
  Download,
  Trash2,
  Edit2,
  Check,
  BookOpen,
  FolderArchive,
  ArrowRight,
  Printer,
  Bookmark
} from 'lucide-react';
import { api } from '../lib/api';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';

const NOTE_TYPES = [
  { id: 'short', name: 'Short Notes', desc: 'High-yield key revision points & formulas' },
  { id: 'detailed', name: 'Detailed Notes', desc: 'In-depth conceptual guide with examples' },
  { id: 'simple', name: 'Simple Explanations', desc: 'Intuitive analogies for difficult topics' },
  { id: 'definitions', name: 'Important Definitions', desc: 'Formal university technical terms & glossary' },
  { id: 'exam', name: 'Exam-Oriented Answers', desc: '2, 5 & 10 mark high-scoring model answers' },
  { id: 'qa', name: 'Top 10 Questions & Answers', desc: 'Most frequent semester examination questions' },
];

export default function AINotesPage() {
  const [searchParams] = useSearchParams();
  const initialResourceId = searchParams.get('resource_id') || '';

  const [subjects, setSubjects] = useState([]);
  const [resources, setResources] = useState([]);
  const [savedNotes, setSavedNotes] = useState([]);
  const [activeTab, setActiveTab] = useState('generator'); // 'generator' or 'library'

  // Generator form
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [selectedResourceId, setSelectedResourceId] = useState(initialResourceId);
  const [topicTitle, setTopicTitle] = useState('');
  const [selectedNoteType, setSelectedNoteType] = useState('detailed');

  // Generation state
  const [generating, setGenerating] = useState(false);
  const [currentNote, setCurrentNote] = useState(null);
  const [copied, setCopied] = useState(false);

  // Edit note modal
  const [editingNote, setEditingNote] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [subData, resData, notesData] = await Promise.all([
        api.getSubjects(),
        api.getResources(),
        api.getNotes()
      ]);
      setSubjects(subData);
      setResources(resData);
      setSavedNotes(notesData);

      if (initialResourceId && resData.length > 0) {
        const found = resData.find(r => r.id === initialResourceId);
        if (found) {
          setSelectedResourceId(found.id);
          setSelectedSubjectId(found.subject_id || '');
          setTopicTitle(found.title);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!topicTitle.trim() && !selectedResourceId) {
      alert('Please enter a topic or select an uploaded resource.');
      return;
    }

    setGenerating(true);
    try {
      const generated = await api.generateNotes({
        subject_id: selectedSubjectId || undefined,
        resource_id: selectedResourceId || undefined,
        topic_title: topicTitle,
        note_type: selectedNoteType
      });
      setCurrentNote(generated);
      loadData();
    } catch (err) {
      alert('Note generation failed: ' + err.message);
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!currentNote) return;
    navigator.clipboard.writeText(currentNote.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (note = currentNote) => {
    if (!note) return;
    const blob = new Blob([note.content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${note.title.replace(/[^a-zA-Z0-9]/g, '_')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDeleteNote = async (id) => {
    if (window.confirm('Delete this generated note?')) {
      await api.deleteNote(id);
      if (currentNote?.id === id) setCurrentNote(null);
      loadData();
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingNote) return;
    try {
      const updated = await api.updateNote(editingNote.id, {
        title: editTitle,
        content: editContent
      });
      if (currentNote?.id === editingNote.id) {
        setCurrentNote(updated);
      }
      setEditingNote(null);
      loadData();
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header & Tab Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#1F2937]">AI Notes Generator</h2>
          <p className="text-xs text-[#6B7280]">
            Synthesize lecture notes, model answers, and revision guides directly from your PDFs
          </p>
        </div>

        <div className="flex p-1 bg-white rounded-2xl border border-[#EDE9FE] shadow-xs">
          <button
            onClick={() => setActiveTab('generator')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'generator'
                ? 'bg-[#EDE9FE] text-[#7C3AED] shadow-xs'
                : 'text-[#6B7280] hover:text-[#1F2937]'
            }`}
          >
            Create Notes
          </button>
          <button
            onClick={() => setActiveTab('library')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'library'
                ? 'bg-[#EDE9FE] text-[#7C3AED] shadow-xs'
                : 'text-[#6B7280] hover:text-[#1F2937]'
            }`}
          >
            <span>Saved Notes</span>
            <span className="px-1.5 py-0.2 rounded-full bg-[#7C3AED] text-white text-[10px]">
              {savedNotes.length}
            </span>
          </button>
        </div>
      </div>

      {activeTab === 'generator' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Form Configuration Column */}
          <div className="lg:col-span-5 p-6 rounded-3xl bg-white border border-[#EDE9FE] shadow-xs space-y-5">
            <h3 className="text-sm font-bold text-[#1F2937] pb-3 border-b border-[#EDE9FE]">
              Note Parameters
            </h3>

            <form onSubmit={handleGenerate} className="space-y-4">
              {/* Subject */}
              <div>
                <label className="block text-xs font-semibold text-[#4B5563]">1. Select Subject</label>
                <select
                  value={selectedSubjectId}
                  onChange={(e) => setSelectedSubjectId(e.target.value)}
                  className="mt-1 w-full px-3 py-2 text-xs bg-[#F8F7FF] border border-[#EDE9FE] rounded-xl focus:bg-white focus:outline-none"
                >
                  <option value="">-- Choose Subject (Optional) --</option>
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.code || 'Course'})</option>
                  ))}
                </select>
              </div>

              {/* Uploaded Resource */}
              <div>
                <label className="block text-xs font-semibold text-[#4B5563]">2. Source Study Document</label>
                <select
                  value={selectedResourceId}
                  onChange={(e) => {
                    setSelectedResourceId(e.target.value);
                    const found = resources.find(r => r.id === e.target.value);
                    if (found && !topicTitle) setTopicTitle(found.title);
                  }}
                  className="mt-1 w-full px-3 py-2 text-xs bg-[#F8F7FF] border border-[#EDE9FE] rounded-xl focus:bg-white focus:outline-none"
                >
                  <option value="">-- Synthesize standard syllabus (no PDF) --</option>
                  {resources.map(r => (
                    <option key={r.id} value={r.id}>{r.title} ({r.file_type?.toUpperCase()})</option>
                  ))}
                </select>
              </div>

              {/* Topic */}
              <div>
                <label className="block text-xs font-semibold text-[#4B5563]">3. Specific Topic or Unit *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Binary Search Trees & AVL Rotations"
                  value={topicTitle}
                  onChange={(e) => setTopicTitle(e.target.value)}
                  className="mt-1 w-full px-3 py-2 text-xs bg-[#F8F7FF] border border-[#EDE9FE] rounded-xl focus:bg-white focus:outline-none"
                />
              </div>

              {/* Note Types Grid */}
              <div>
                <label className="block text-xs font-semibold text-[#4B5563] mb-2">4. Note Format Type</label>
                <div className="space-y-2">
                  {NOTE_TYPES.map((type) => (
                    <div
                      key={type.id}
                      onClick={() => setSelectedNoteType(type.id)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        selectedNoteType === type.id
                          ? 'border-[#7C3AED] bg-[#EDE9FE]/50 shadow-xs ring-1 ring-[#7C3AED]'
                          : 'border-[#EDE9FE] bg-[#F8F7FF] hover:bg-white'
                      }`}
                    >
                      <div>
                        <p className="text-xs font-bold text-[#1F2937]">{type.name}</p>
                        <p className="text-[10px] text-[#6B7280]">{type.desc}</p>
                      </div>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        selectedNoteType === type.id ? 'border-[#7C3AED] bg-[#7C3AED] text-white' : 'border-[#9CA3AF]'
                      }`}>
                        {selectedNoteType === type.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={generating}
                className="w-full mt-4 py-3 rounded-2xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-[#7C3AED]/20 transition-all disabled:opacity-50"
              >
                {generating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Gemini is Synthesizing Notes...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Notes</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Generated Note Preview Column */}
          <div className="lg:col-span-7 flex flex-col p-6 rounded-3xl bg-white border border-[#EDE9FE] shadow-xs">
            {currentNote ? (
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-[#EDE9FE] gap-3">
                    <div>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#EDE9FE] text-[#7C3AED] uppercase">
                        {currentNote.note_type}
                      </span>
                      <h3 className="text-base font-bold text-[#1F2937] mt-1">{currentNote.title}</h3>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={handleCopy}
                        className="p-2 rounded-xl bg-[#F8F7FF] text-[#4B5563] hover:text-[#7C3AED] border border-[#EDE9FE] transition-colors"
                        title="Copy to clipboard"
                      >
                        {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      </button>

                      <button
                        onClick={() => handleDownload(currentNote)}
                        className="p-2 rounded-xl bg-[#F8F7FF] text-[#4B5563] hover:text-[#7C3AED] border border-[#EDE9FE] transition-colors"
                        title="Download Markdown"
                      >
                        <Download className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => window.print()}
                        className="p-2 rounded-xl bg-[#F8F7FF] text-[#4B5563] hover:text-[#7C3AED] border border-[#EDE9FE] transition-colors"
                        title="Print / Save PDF"
                      >
                        <Printer className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          setEditingNote(currentNote);
                          setEditTitle(currentNote.title);
                          setEditContent(currentNote.content);
                        }}
                        className="p-2 rounded-xl bg-[#F8F7FF] text-[#4B5563] hover:text-[#7C3AED] border border-[#EDE9FE] transition-colors"
                        title="Edit note"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Formatted Content View */}
                  <div className="mt-4 p-5 rounded-2xl bg-[#F8F7FF] border border-[#EDE9FE] max-h-[550px] overflow-y-auto whitespace-pre-wrap select-text text-xs sm:text-sm leading-relaxed text-[#1F2937]">
                    {currentNote.content}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#EDE9FE] flex items-center justify-between text-xs text-[#6B7280]">
                  <span>Automatically saved to your StudyHub account</span>
                  <span className="text-[#10B981] font-semibold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Ready for examination prep
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                <div className="w-16 h-16 rounded-3xl bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center mb-4 shadow-xs">
                  <FileText className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-[#1F2937]">Notes Preview Area</h3>
                <p className="text-xs text-[#6B7280] max-w-sm mt-1 mb-6">
                  Select a syllabus unit or study PDF, choose your target format, and click Generate Notes.
                </p>
                <div className="flex flex-wrap gap-2 justify-center text-[11px] text-[#7C3AED]">
                  <span className="px-3 py-1 rounded-full bg-[#EDE9FE]">Short Notes</span>
                  <span className="px-3 py-1 rounded-full bg-[#EDE9FE]">Exam Model Answers</span>
                  <span className="px-3 py-1 rounded-full bg-[#EDE9FE]">Glossary Definitions</span>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Saved Notes Library Tab */
        <div className="space-y-4">
          {savedNotes.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No saved notes yet"
              description="Generated study notes will appear here for quick review before tests."
              actionLabel="Create Note Now"
              onAction={() => setActiveTab('generator')}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {savedNotes.map((note) => (
                <div
                  key={note.id}
                  className="p-5 rounded-3xl bg-white border border-[#EDE9FE] shadow-xs hover:border-[#C4B5FD] transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EDE9FE] text-[#7C3AED] uppercase">
                        {note.note_type}
                      </span>
                      <span className="text-[10px] text-[#9CA3AF]">
                        {new Date(note.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-[#1F2937] mt-2.5 truncate" title={note.title}>
                      {note.title}
                    </h4>

                    <p className="text-xs text-[#6B7280] line-clamp-3 mt-2 leading-relaxed">
                      {note.content}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-[#EDE9FE] flex items-center justify-between">
                    <button
                      onClick={() => {
                        setCurrentNote(note);
                        setActiveTab('generator');
                      }}
                      className="text-xs font-bold text-[#7C3AED] hover:underline flex items-center gap-1"
                    >
                      <span>Open Note</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDownload(note)}
                        className="p-1.5 text-[#6B7280] hover:text-[#7C3AED] rounded-lg"
                        title="Download Markdown"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        className="p-1.5 text-[#9CA3AF] hover:text-red-500 rounded-lg"
                        title="Delete note"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal: Edit Note */}
      <Modal
        isOpen={Boolean(editingNote)}
        onClose={() => setEditingNote(null)}
        title="Edit Study Note"
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSaveEdit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#374151]">Title</label>
            <input
              type="text"
              required
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="mt-1 block w-full px-3 py-2 text-xs bg-[#F8F7FF] border border-[#EDE9FE] rounded-xl focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#374151]">Note Content (Markdown)</label>
            <textarea
              rows={12}
              required
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="mt-1 block w-full px-3 py-2 text-xs font-mono bg-[#F8F7FF] border border-[#EDE9FE] rounded-xl focus:bg-white focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setEditingNote(null)}
              className="px-4 py-2 text-xs font-semibold text-[#6B7280]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-[#7C3AED] rounded-xl shadow-xs"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

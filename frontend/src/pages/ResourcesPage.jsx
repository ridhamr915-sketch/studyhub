import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FolderArchive,
  Upload,
  Search,
  Filter,
  Bookmark,
  BookmarkCheck,
  Download,
  Trash2,
  Edit2,
  Eye,
  Bot,
  FileText,
  BrainCircuit,
  FileCheck,
  Tag,
  AlertCircle
} from 'lucide-react';
import { api } from '../lib/api';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';

export default function ResourcesPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [resources, setResources] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedFileType, setSelectedFileType] = useState('');
  const [onlyBookmarked, setOnlyBookmarked] = useState(false);

  // Modals
  const [previewResource, setPreviewResource] = useState(null);
  const [editingResource, setEditingResource] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  // Upload Form
  const [uploadSubjectId, setUploadSubjectId] = useState('');
  const [uploadTags, setUploadTags] = useState('');

  useEffect(() => {
    loadData();
  }, [selectedSubject, selectedFileType, onlyBookmarked]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [resData, subData] = await Promise.all([
        api.getResources({
          subject_id: selectedSubject || undefined,
          file_type: selectedFileType || undefined,
          bookmarked: onlyBookmarked ? true : undefined,
          search: searchQuery || undefined
        }),
        api.getSubjects()
      ]);
      setResources(resData);
      setSubjects(subData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (files) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (uploadSubjectId) formData.append('subject_id', uploadSubjectId);
      if (uploadTags) formData.append('tags', uploadTags);

      await api.uploadResource(formData);
      setUploadTags('');
      loadData();
    } catch (err) {
      alert('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleToggleBookmark = async (id, currentVal) => {
    try {
      await api.updateResource(id, { is_bookmarked: !currentVal });
      loadData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteResource = async (id) => {
    if (window.confirm('Are you sure you want to delete this study resource?')) {
      try {
        await api.deleteResource(id);
        loadData();
      } catch (e) {
        alert(e.message);
      }
    }
  };

  const handleRenameResource = async (e) => {
    e.preventDefault();
    if (!editingResource || !editTitle.trim()) return;
    try {
      await api.updateResource(editingResource.id, { title: editTitle });
      setEditingResource(null);
      loadData();
    } catch (e) {
      alert(e.message);
    }
  };

  const filteredResources = resources.filter((res) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      res.title.toLowerCase().includes(q) ||
      res.file_name.toLowerCase().includes(q) ||
      (res.tags || []).some(t => t.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Banner / Upload Area */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#EDE9FE] shadow-xs">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl text-left">
            <h2 className="text-xl font-bold text-[#1F2937]">Resource Library & Document Vault</h2>
            <p className="text-xs text-[#6B7280] mt-1 leading-relaxed">
              Upload faculty PDFs, lecture notes, textbook chapters, and past examination papers. Files are indexed with text extraction for AI Q&A and notes generation.
            </p>
          </div>

          {/* Quick upload drop box */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              handleFileUpload(e.dataTransfer.files);
            }}
            onClick={() => fileInputRef.current?.click()}
            className="w-full md:w-auto px-8 py-6 rounded-2xl border-2 border-dashed border-[#DDD6FE] hover:border-[#7C3AED] bg-[#F8F7FF] hover:bg-[#EDE9FE]/30 transition-all flex flex-col items-center justify-center text-center cursor-pointer group"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => handleFileUpload(e.target.files)}
              className="hidden"
              accept=".pdf,.txt,.doc,.docx,.ppt,.pptx"
            />
            <div className="w-10 h-10 rounded-xl bg-white text-[#7C3AED] flex items-center justify-center shadow-xs mb-2 group-hover:scale-110 transition-transform">
              <Upload className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-[#1F2937]">
              {uploading ? 'Extracting & Uploading...' : 'Click or Drag PDF Here'}
            </p>
            <p className="text-[10px] text-[#9CA3AF] mt-0.5">Supports PDF, DOCX, TXT (up to 25MB)</p>
          </div>
        </div>

        {/* Upload Subject Selector */}
        <div className="mt-4 pt-4 border-t border-[#EDE9FE] flex flex-wrap items-center gap-4 text-xs">
          <span className="font-semibold text-[#4B5563]">Attach to Subject:</span>
          <select
            value={uploadSubjectId}
            onChange={(e) => setUploadSubjectId(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-[#F8F7FF] border border-[#EDE9FE] focus:outline-none"
          >
            <option value="">-- General / No Subject --</option>
            {subjects.map(s => (
              <option key={s.id} value={s.id}>{s.name} ({s.code || 'Course'})</option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Tags (comma separated e.g. Unit 1, Exam)"
            value={uploadTags}
            onChange={(e) => setUploadTags(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-[#F8F7FF] border border-[#EDE9FE] focus:outline-none flex-1 min-w-[200px]"
          />
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-[#EDE9FE] shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search resources by title, file name, or tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-[#F8F7FF] border border-[#EDE9FE] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20"
          />
        </div>

        {/* Filter dropdowns */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#F8F7FF] border border-[#EDE9FE] font-medium text-[#4B5563] focus:outline-none"
          >
            <option value="">All Subjects</option>
            {subjects.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>

          <select
            value={selectedFileType}
            onChange={(e) => setSelectedFileType(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#F8F7FF] border border-[#EDE9FE] font-medium text-[#4B5563] focus:outline-none"
          >
            <option value="">All Formats</option>
            <option value="pdf">PDF Documents</option>
            <option value="txt">Text Files</option>
            <option value="docx">Word DOCX</option>
          </select>

          <button
            onClick={() => setOnlyBookmarked(!onlyBookmarked)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border font-semibold transition-all ${
              onlyBookmarked
                ? 'bg-[#EDE9FE] text-[#7C3AED] border-[#C4B5FD]'
                : 'bg-[#F8F7FF] text-[#6B7280] border-[#EDE9FE] hover:text-[#1F2937]'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Bookmarked</span>
          </button>
        </div>
      </div>

      {/* Resource Cards Grid */}
      {filteredResources.length === 0 ? (
        <EmptyState
          icon={FolderArchive}
          title="No study resources found"
          description="Upload your first semester PDF or lecture note to start using AI tools."
          actionLabel="Upload PDF"
          onAction={() => fileInputRef.current?.click()}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredResources.map((res) => {
            const subject = subjects.find(s => s.id === res.subject_id);

            return (
              <div
                key={res.id}
                className="p-5 rounded-3xl bg-white border border-[#EDE9FE] shadow-xs hover:border-[#C4B5FD] transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-[#EDE9FE] text-[#7C3AED] font-bold text-xs flex items-center justify-center shrink-0 uppercase">
                        {res.file_type || 'PDF'}
                      </div>
                      <div className="truncate">
                        <h3 className="text-xs font-bold text-[#1F2937] truncate" title={res.title}>
                          {res.title}
                        </h3>
                        <p className="text-[10px] text-[#6B7280] truncate mt-0.5">
                          {res.file_name} • {(res.file_size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleToggleBookmark(res.id, res.is_bookmarked)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        res.is_bookmarked ? 'text-[#7C3AED] bg-[#EDE9FE]' : 'text-[#9CA3AF] hover:text-[#7C3AED]'
                      }`}
                      title={res.is_bookmarked ? 'Remove Bookmark' : 'Bookmark'}
                    >
                      <Bookmark className="w-4 h-4 fill-current" />
                    </button>
                  </div>

                  {/* Subject Tag */}
                  {subject && (
                    <div className="mt-3">
                      <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-[#F8F7FF] text-[#7C3AED] border border-[#EDE9FE]">
                        {subject.name}
                      </span>
                    </div>
                  )}

                  {/* Tags */}
                  {(res.tags || []).length > 0 && (
                    <div className="mt-2.5 flex flex-wrap gap-1">
                      {res.tags.map((tag, i) => (
                        <span key={i} className="text-[9px] px-2 py-0.5 rounded-md bg-slate-50 text-[#6B7280] border border-slate-100">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Action Buttons */}
                <div className="mt-5 pt-4 border-t border-[#EDE9FE] space-y-2">
                  {/* AI Quick Actions */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => navigate(`/app/assistant?resource_id=${res.id}`)}
                      className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-[11px] font-bold text-[#7C3AED] bg-[#EDE9FE]/70 hover:bg-[#EDE9FE] transition-colors"
                      title="Ask Gemini questions grounded in this PDF"
                    >
                      <Bot className="w-3.5 h-3.5" />
                      <span>Ask AI</span>
                    </button>

                    <button
                      onClick={() => navigate(`/app/notes?resource_id=${res.id}`)}
                      className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-[11px] font-bold text-[#4B5563] bg-[#F8F7FF] hover:bg-[#EDE9FE]/50 border border-[#EDE9FE] transition-colors"
                      title="Generate Smart Notes"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Notes</span>
                    </button>
                  </div>

                  {/* Utility actions */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setPreviewResource(res)}
                        className="p-1.5 text-[#6B7280] hover:text-[#7C3AED] rounded-lg transition-colors"
                        title="Preview text content"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      <a
                        href={api.getDownloadUrl(res.id)}
                        target="_blank"
                        rel="noreferrer"
                        download
                        className="p-1.5 text-[#6B7280] hover:text-[#7C3AED] rounded-lg transition-colors"
                        title="Download file"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </a>

                      <button
                        onClick={() => {
                          setEditingResource(res);
                          setEditTitle(res.title);
                        }}
                        className="p-1.5 text-[#6B7280] hover:text-[#7C3AED] rounded-lg transition-colors"
                        title="Rename resource"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => handleDeleteResource(res.id)}
                      className="p-1.5 text-[#9CA3AF] hover:text-red-500 rounded-lg transition-colors"
                      title="Delete resource"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Document Preview */}
      <Modal
        isOpen={Boolean(previewResource)}
        onClose={() => setPreviewResource(null)}
        title={previewResource?.title || 'Document Preview'}
        maxWidth="max-w-2xl"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#EDE9FE] text-xs text-[#6B7280]">
            <span>File: {previewResource?.file_name}</span>
            <span>Size: {((previewResource?.file_size || 0) / 1024).toFixed(1)} KB</span>
          </div>

          <div className="p-4 rounded-xl bg-[#F8F7FF] border border-[#EDE9FE] text-xs font-mono text-[#374151] max-h-96 overflow-y-auto whitespace-pre-wrap leading-relaxed select-text">
            {previewResource?.extracted_text || 'No text extracted from this document or document is empty.'}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <a
              href={previewResource ? api.getDownloadUrl(previewResource.id) : '#'}
              download
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#7C3AED] hover:bg-[#6D28D9]"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download File</span>
            </a>
          </div>
        </div>
      </Modal>

      {/* Modal: Rename Resource */}
      <Modal
        isOpen={Boolean(editingResource)}
        onClose={() => setEditingResource(null)}
        title="Rename Resource"
      >
        <form onSubmit={handleRenameResource} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#374151]">Resource Title</label>
            <input
              type="text"
              required
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="mt-1 block w-full px-3 py-2 text-xs bg-[#F8F7FF] border border-[#EDE9FE] rounded-xl focus:bg-white focus:outline-none"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setEditingResource(null)}
              className="px-4 py-2 text-xs font-semibold text-[#6B7280]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-[#7C3AED] rounded-xl"
            >
              Save Title
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

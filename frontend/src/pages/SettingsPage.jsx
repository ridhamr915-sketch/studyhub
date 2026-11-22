import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Settings,
  User,
  School,
  BookOpen,
  Database,
  Sparkles,
  Key,
  LogOut,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Save
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';

export default function SettingsPage() {
  const { profile, updateProfile, logout, isSupabaseLive } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [collegeName, setCollegeName] = useState(profile?.college_name || '');
  const [branch, setBranch] = useState(profile?.branch || '');
  const [semester, setSemester] = useState(profile?.semester || 4);
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '');

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [health, setHealth] = useState(null);

  useEffect(() => {
    api.getHealth()
      .then(d => setHealth(d))
      .catch(() => setHealth(null));
  }, []);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);
    try {
      await updateProfile({
        full_name: fullName,
        college_name: collegeName,
        branch,
        semester: parseInt(semester, 10),
        avatar_url: avatarUrl
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (e) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Page Title */}
      <div>
        <h2 className="text-xl font-bold text-[#1F2937]">Platform Settings & Student Profile</h2>
        <p className="text-xs text-[#6B7280]">
          Manage your academic credentials, storage sync, and future module roadmap
        </p>
      </div>

      {/* Profile Form Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#EDE9FE] shadow-xs">
        <h3 className="text-sm font-bold text-[#1F2937] pb-3 border-b border-[#EDE9FE] flex items-center gap-2">
          <User className="w-4 h-4 text-[#7C3AED]" />
          <span>Student Academic Profile</span>
        </h3>

        {savedSuccess && (
          <div className="mt-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Profile settings saved successfully!</span>
          </div>
        )}

        <form onSubmit={handleSaveProfile} className="mt-6 space-y-5">
          <div className="flex items-center gap-4">
            <img
              src={avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt="Avatar"
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-[#EDE9FE]"
            />
            <div className="flex-1">
              <label className="block text-xs font-semibold text-[#4B5563]">Avatar Image URL</label>
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://example.com/photo.jpg"
                className="mt-1 block w-full px-3 py-2 text-xs bg-[#F8F7FF] border border-[#EDE9FE] rounded-xl focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#4B5563]">Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 text-xs bg-[#F8F7FF] border border-[#EDE9FE] rounded-xl focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4B5563]">College / University Name</label>
              <input
                type="text"
                value={collegeName}
                onChange={(e) => setCollegeName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 text-xs bg-[#F8F7FF] border border-[#EDE9FE] rounded-xl focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4B5563]">Branch / Specialization</label>
              <input
                type="text"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                placeholder="Computer Science & Engineering"
                className="mt-1 block w-full px-3 py-2 text-xs bg-[#F8F7FF] border border-[#EDE9FE] rounded-xl focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4B5563]">Current Semester</label>
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="mt-1 block w-full px-3 py-2 text-xs bg-[#F8F7FF] border border-[#EDE9FE] rounded-xl focus:bg-white focus:outline-none"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                  <option key={s} value={s}>Semester {s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-3 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-[#7C3AED] hover:bg-[#6D28D9] shadow-xs transition-all disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Cloud & AI Backend Status Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#EDE9FE] shadow-xs space-y-5">
        <h3 className="text-sm font-bold text-[#1F2937] pb-3 border-b border-[#EDE9FE] flex items-center gap-2">
          <Database className="w-4 h-4 text-[#7C3AED]" />
          <span>Backend & Integration Status</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-[#F8F7FF] border border-[#EDE9FE]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#1F2937]">Google Gemini AI</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                health?.gemini_service?.active ? 'bg-emerald-100 text-emerald-700' : 'bg-purple-100 text-[#7C3AED]'
              }`}>
                {health?.gemini_service?.active ? 'Active (API Key Set)' : 'Curriculum Engine Mode'}
              </span>
            </div>
            <p className="text-[11px] text-[#6B7280] mt-2">
              Model: <span className="font-mono text-[#7C3AED]">{health?.gemini_service?.model || 'gemini-1.5-flash'}</span>
            </p>
            <p className="text-[10px] text-[#9CA3AF] mt-1">
              Set <code className="bg-slate-200 px-1 rounded">GEMINI_API_KEY</code> in <code className="bg-slate-200 px-1 rounded">backend/.env</code> for live cloud calls.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F8F7FF] border border-[#EDE9FE]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#1F2937]">Supabase Database & Auth</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                health?.supabase_connected ? 'bg-emerald-100 text-emerald-700' : 'bg-purple-100 text-[#7C3AED]'
              }`}>
                {health?.supabase_connected ? 'PostgreSQL Cloud Live' : 'Local Storage Mode'}
              </span>
            </div>
            <p className="text-[11px] text-[#6B7280] mt-2">
              Storage: <span className="font-medium text-[#7C3AED]">{health?.storage_mode}</span>
            </p>
            <p className="text-[10px] text-[#9CA3AF] mt-1">
              Run <code className="bg-slate-200 px-1 rounded">database/supabase_schema.sql</code> in your Supabase SQL editor.
            </p>
          </div>
        </div>
      </div>

      {/* Future Roadmap Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#EDE9FE]/50 to-white border border-[#DDD6FE] shadow-xs">
        <h3 className="text-sm font-bold text-[#1F2937] pb-3 border-b border-[#EDE9FE] flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#7C3AED]" />
          <span>Multi-Year Project Architecture Roadmap</span>
        </h3>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-white border border-[#EDE9FE]">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-[#7C3AED]">3rd Year Minor Project</span>
            <h4 className="text-xs font-bold text-[#1F2937] mt-2">StudyHub 2.0</h4>
            <p className="text-[11px] text-[#6B7280] mt-1">
              Includes OCR for handwritten lecture notes, AI weakness detection based on quiz score gaps, and personalized adaptive study plans.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-[#EDE9FE]">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">4th Year Major Project</span>
            <h4 className="text-xs font-bold text-[#1F2937] mt-2">StudyHub 3.0</h4>
            <p className="text-[11px] text-[#6B7280] mt-1">
              Collaborative virtual study rooms, teacher grading portal, college LMS synchronization, and cross-platform mobile apps.
            </p>
          </div>
        </div>
      </div>

      {/* Account Logout */}
      <div className="pt-4 flex justify-between items-center border-t border-[#EDE9FE]">
        <p className="text-xs text-[#9CA3AF]">StudyHub 1.0 • B.Tech CSE Mini-Project</p>
        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out Account</span>
        </button>
      </div>
    </div>
  );
}

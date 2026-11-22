import React, { useState, useEffect } from 'react';
import { Menu, Bell, Search, Sparkles, CheckCircle2, AlertCircle, Database } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';

export default function Header({ setIsMobileOpen, title, subtitle }) {
  const { profile, isSupabaseLive } = useAuth();
  const [health, setHealth] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    api.getHealth()
      .then(data => setHealth(data))
      .catch(() => setHealth({ status: 'offline' }));
  }, []);

  return (
    <header className="sticky top-0 z-20 backdrop-blur-md bg-[#F8F7FF]/80 border-b border-[#EDE9FE] px-4 sm:px-8 py-3.5">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile trigger & Page Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileOpen(true)}
            className="md:hidden p-2 text-[#4B5563] hover:text-[#7C3AED] hover:bg-white rounded-xl transition-colors border border-[#EDE9FE]"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1F2937]">{title || 'Dashboard'}</h1>
            {subtitle && <p className="text-xs text-[#6B7280] hidden sm:block">{subtitle}</p>}
          </div>
        </div>

        {/* Right: Status Pills & Notifications */}
        <div className="flex items-center gap-3">
          {/* AI & DB Status Pills */}
          <div className="hidden lg:flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#EDE9FE] text-xs font-medium text-[#4B5563] shadow-xs">
              <span className={`w-2 h-2 rounded-full ${health?.gemini_service?.active ? 'bg-emerald-500 animate-pulse' : 'bg-purple-500'}`} />
              <Sparkles className="w-3.5 h-3.5 text-[#7C3AED]" />
              <span>Gemini AI: {health?.gemini_service?.active ? 'Connected' : 'Curriculum Engine'}</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#EDE9FE] text-xs font-medium text-[#4B5563] shadow-xs">
              <Database className="w-3.5 h-3.5 text-[#7C3AED]" />
              <span>DB: {health?.supabase_connected ? 'Supabase Cloud' : 'Local Storage Mode'}</span>
            </div>
          </div>

          {/* Quick Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2.5 rounded-xl bg-white border border-[#EDE9FE] text-[#6B7280] hover:text-[#7C3AED] hover:border-[#7C3AED]/40 transition-all shadow-xs relative"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#7C3AED]" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white border border-[#EDE9FE] shadow-xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-[#EDE9FE]">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#1F2937]">Academic Reminders</h4>
                  <span className="text-[10px] text-[#7C3AED] font-semibold">2 New</span>
                </div>
                <div className="mt-3 space-y-2.5">
                  <div className="p-2.5 rounded-xl bg-[#F8F7FF] border border-[#EDE9FE] text-xs">
                    <p className="font-semibold text-[#1F2937]">Midterm Revision Due</p>
                    <p className="text-[11px] text-[#6B7280] mt-0.5">Revise Data Structures Unit 1 before tomorrow's quiz.</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#F8F7FF] border border-[#EDE9FE] text-xs">
                    <p className="font-semibold text-[#1F2937]">AI Notes Generated</p>
                    <p className="text-[11px] text-[#6B7280] mt-0.5">Summary notes for Linear Data Structures are ready to read.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Avatar Chip */}
          <div className="flex items-center gap-2 pl-2 border-l border-[#EDE9FE]">
            <img
              src={profile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt="Avatar"
              className="w-9 h-9 rounded-xl object-cover ring-2 ring-[#EDE9FE]"
            />
          </div>
        </div>
      </div>
    </header>
  );
}

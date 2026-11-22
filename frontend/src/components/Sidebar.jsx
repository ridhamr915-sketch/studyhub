import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  FolderArchive,
  Bot,
  FileText,
  BrainCircuit,
  CalendarCheck2,
  TrendingUp,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/app', icon: LayoutDashboard },
  { name: 'My Subjects', path: '/app/subjects', icon: BookOpen },
  { name: 'Resource Library', path: '/app/resources', icon: FolderArchive },
  { name: 'AI Study Assistant', path: '/app/assistant', icon: Bot, badge: 'Gemini' },
  { name: 'AI Notes Generator', path: '/app/notes', icon: FileText },
  { name: 'Quiz & Flashcards', path: '/app/quizzes', icon: BrainCircuit },
  { name: 'Study Planner', path: '/app/planner', icon: CalendarCheck2 },
  { name: 'Progress Tracker', path: '/app/tracker', icon: TrendingUp },
  { name: 'Settings', path: '/app/settings', icon: Settings },
];

export default function Sidebar({ isMobileOpen, setIsMobileOpen }) {
  const [collapsed, setCollapsed] = useState(false);
  const { profile, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-[#EDE9FE] select-none">
      {/* Brand & Toggle */}
      <div className={`p-4 flex items-center justify-between border-b border-[#EDE9FE] ${collapsed ? 'flex-col gap-2' : ''}`}>
        <NavLink to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#7C3AED] to-[#A78BFA] flex items-center justify-center text-white shadow-md shadow-[#7C3AED]/20">
            <BookOpen className="w-5 h-5" />
          </div>
          {!collapsed && (
            <div>
              <span className="font-bold text-lg tracking-tight text-[#1F2937]">Study<span className="text-[#7C3AED]">Hub</span></span>
              <span className="ml-1.5 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-[#EDE9FE] text-[#7C3AED] rounded-md">1.0</span>
            </div>
          )}
        </NavLink>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex p-1.5 rounded-lg text-[#9CA3AF] hover:text-[#7C3AED] hover:bg-[#F8F7FF] transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/app'}
              onClick={() => setIsMobileOpen?.(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all group ${
                  isActive
                    ? 'bg-[#EDE9FE] text-[#7C3AED] shadow-sm font-semibold'
                    : 'text-[#4B5563] hover:text-[#7C3AED] hover:bg-[#F8F7FF]'
                } ${collapsed ? 'justify-center' : ''}`
              }
              title={collapsed ? item.name : undefined}
            >
              <Icon className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-105`} />
              {!collapsed && (
                <div className="flex items-center justify-between w-full">
                  <span>{item.name}</span>
                  {item.badge && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#7C3AED] text-white flex items-center gap-1 shadow-xs">
                      <Sparkles className="w-2.5 h-2.5" />
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* User Info & Logout Footer */}
      <div className="p-3 border-t border-[#EDE9FE] bg-[#F8F7FF]/50">
        {!collapsed ? (
          <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-[#EDE9FE] shadow-xs">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <img
                src={profile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt="Avatar"
                className="w-9 h-9 rounded-lg object-cover ring-2 ring-[#EDE9FE]"
              />
              <div className="truncate text-left">
                <p className="text-xs font-semibold text-[#1F2937] truncate">{profile?.full_name || 'Student'}</p>
                <p className="text-[11px] text-[#6B7280] truncate">Sem {profile?.semester || 4} • {profile?.branch || 'CSE'}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 text-[#9CA3AF] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <img
              src={profile?.avatar_url}
              alt="Avatar"
              className="w-8 h-8 rounded-lg object-cover"
              title={profile?.full_name}
            />
            <button
              onClick={handleLogout}
              className="p-1.5 text-[#9CA3AF] hover:text-red-500 rounded-lg"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:block transition-all duration-300 ease-in-out shrink-0 z-30 ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div className="fixed top-0 bottom-0 left-0 transition-all duration-300 ease-in-out">
          <div className={`h-full ${collapsed ? 'w-20' : 'w-64'}`}>
            {sidebarContent}
          </div>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="relative w-72 max-w-[80vw] h-full z-10 shadow-2xl">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Sparkles, ArrowRight, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { isAuthenticated, user } = useAuth();

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-[#EDE9FE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#7C3AED] to-[#A78BFA] flex items-center justify-center text-white shadow-md shadow-[#7C3AED]/20 group-hover:scale-105 transition-transform">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-xl tracking-tight text-[#1F2937]">Study<span className="text-[#7C3AED]">Hub</span></span>
            <span className="ml-1.5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#EDE9FE] text-[#7C3AED] rounded-full">1.0</span>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm font-medium text-[#6B7280] hover:text-[#7C3AED] transition-colors">Features</a>
          <a href="#how-it-works" className="text-sm font-medium text-[#6B7280] hover:text-[#7C3AED] transition-colors">How It Works</a>
          <a href="#benefits" className="text-sm font-medium text-[#6B7280] hover:text-[#7C3AED] transition-colors">For Students</a>
          <a href="#roadmap" className="text-sm font-medium text-[#6B7280] hover:text-[#7C3AED] transition-colors">Future 2.0 & 3.0</a>
        </div>

        {/* CTA Buttons */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <Link
              to="/app"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm text-white bg-[#7C3AED] hover:bg-[#6D28D9] shadow-md shadow-[#7C3AED]/20 hover:shadow-lg transition-all"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <>
              <Link
                to="/auth?mode=login"
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-[#4B5563] hover:text-[#7C3AED] hover:bg-[#EDE9FE]/50 transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span>Log In</span>
              </Link>
              <Link
                to="/auth?mode=signup"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm text-white bg-[#7C3AED] hover:bg-[#6D28D9] shadow-md shadow-[#7C3AED]/20 hover:shadow-lg transition-all"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

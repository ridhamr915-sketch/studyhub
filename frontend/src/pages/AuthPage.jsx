import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { BookOpen, Sparkles, ArrowRight, Lock, Mail, User, School, BookMarked, Layers } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthPage() {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'login';
  const [isSignUp, setIsSignUp] = useState(initialMode === 'signup');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();
  const { login, signup } = useAuth();

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [collegeName, setCollegeName] = useState('National Institute of Technology');
  const [branch, setBranch] = useState('Computer Science & Engineering');
  const [semester, setSemester] = useState('4');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      if (isSignUp) {
        await signup({
          email,
          password,
          full_name: fullName,
          college_name: collegeName,
          branch,
          semester: parseInt(semester, 10) || 4
        });
        navigate('/app');
      } else {
        await login(email, password);
        navigate('/app');
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    try {
      await login('alex.sharma@college.edu', 'demo1234');
      navigate('/app');
    } catch (err) {
      setError('Demo login failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F7FF] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#7C3AED] to-[#A78BFA] flex items-center justify-center text-white shadow-lg shadow-[#7C3AED]/20">
            <BookOpen className="w-6 h-6" />
          </div>
          <span className="font-bold text-2xl tracking-tight text-[#1F2937]">Study<span className="text-[#7C3AED]">Hub</span></span>
        </Link>
        <h2 className="mt-6 text-2xl font-bold tracking-tight text-[#1F2937]">
          {isSignUp ? 'Create your Student Account' : 'Welcome back to StudyHub'}
        </h2>
        <p className="mt-1 text-xs text-[#6B7280]">
          {isSignUp ? 'Organize all your college study materials and AI notes' : 'Enter your credentials to access your dashboard'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-xl shadow-[#7C3AED]/5 rounded-3xl border border-[#EDE9FE] sm:px-10">
          {/* Mode Switcher Tabs */}
          <div className="flex p-1 bg-[#F8F7FF] rounded-xl border border-[#EDE9FE] mb-6">
            <button
              type="button"
              onClick={() => { setIsSignUp(false); setError(''); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                !isSignUp ? 'bg-white text-[#7C3AED] shadow-xs' : 'text-[#6B7280] hover:text-[#1F2937]'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setIsSignUp(true); setError(''); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                isSignUp ? 'bg-white text-[#7C3AED] shadow-xs' : 'text-[#6B7280] hover:text-[#1F2937]'
              }`}
            >
              Create Account
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 font-medium">
              {error}
            </div>
          )}

          {message && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-600 font-medium">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-[#374151]">Full Name</label>
                  <div className="mt-1 relative rounded-xl shadow-xs">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#9CA3AF]">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Alex Sharma"
                      className="block w-full pl-9 pr-3 py-2.5 text-xs bg-[#F8F7FF] border border-[#EDE9FE] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#374151]">Branch</label>
                    <input
                      type="text"
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                      placeholder="CSE / IT / ECE"
                      className="mt-1 block w-full px-3 py-2 text-xs bg-[#F8F7FF] border border-[#EDE9FE] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#374151]">Semester</label>
                    <select
                      value={semester}
                      onChange={(e) => setSemester(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 text-xs bg-[#F8F7FF] border border-[#EDE9FE] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED]"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                        <option key={s} value={s}>Semester {s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#374151]">College / University</label>
                  <input
                    type="text"
                    value={collegeName}
                    onChange={(e) => setCollegeName(e.target.value)}
                    placeholder="National Institute of Technology"
                    className="mt-1 block w-full px-3 py-2 text-xs bg-[#F8F7FF] border border-[#EDE9FE] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED]"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#374151]">Email Address</label>
              <div className="mt-1 relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#9CA3AF]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@college.edu"
                  className="block w-full pl-9 pr-3 py-2.5 text-xs bg-[#F8F7FF] border border-[#EDE9FE] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#374151]">Password</label>
              <div className="mt-1 relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#9CA3AF]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-9 pr-3 py-2.5 text-xs bg-[#F8F7FF] border border-[#EDE9FE] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold text-white bg-[#7C3AED] hover:bg-[#6D28D9] shadow-md shadow-[#7C3AED]/20 transition-all disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{isSignUp ? 'Create Free Account' : 'Sign In to StudyHub'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Student Sign In */}
          <div className="mt-6 pt-6 border-t border-[#EDE9FE]">
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-[#7C3AED] bg-[#EDE9FE]/70 hover:bg-[#EDE9FE] border border-[#DDD6FE] transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>One-Click Demo Student Login (Evaluation Mode)</span>
            </button>
            <p className="text-[11px] text-center text-[#9CA3AF] mt-2">
              For evaluators and faculty review — accesses pre-seeded CSE 4th-sem demo data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

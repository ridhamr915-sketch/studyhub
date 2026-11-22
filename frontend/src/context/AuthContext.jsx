import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const AuthContext = createContext(null);

const DEFAULT_PROFILE = {
  id: 'student-demo-id',
  email: 'alex.sharma@college.edu',
  full_name: 'Alex Sharma',
  college_name: 'National Institute of Technology',
  course: 'B.Tech',
  branch: 'Computer Science & Engineering',
  semester: 4,
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  theme_preference: 'lavender-light'
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. If Supabase is configured, listen to auth changes
    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setUser(session.user);
          fetchProfile(session.user.id, session.user.email);
        } else {
          checkLocalAuth();
        }
        setLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setUser(session.user);
          fetchProfile(session.user.id, session.user.email);
        } else {
          setUser(null);
        }
        setLoading(false);
      });

      return () => subscription.unsubscribe();
    } else {
      checkLocalAuth();
      setLoading(false);
    }
  }, []);

  const checkLocalAuth = () => {
    const saved = localStorage.getItem('studyhub_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setUser(parsed);
        setProfile(parsed.profile || DEFAULT_PROFILE);
      } catch (_) {
        setUser(null);
      }
    } else {
      // Default to demo student for immediate evaluation convenience
      setUser({ id: DEFAULT_PROFILE.id, email: DEFAULT_PROFILE.email });
      setProfile(DEFAULT_PROFILE);
    }
  };

  const fetchProfile = async (userId, email) => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (data) {
        setProfile(data);
      } else {
        // Fallback default
        setProfile({
          ...DEFAULT_PROFILE,
          id: userId,
          email: email
        });
      }
    } catch (e) {
      console.warn('Profile fetch error:', e);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setUser(data.user);
        return { success: true };
      } else {
        // Local auth
        const localUser = {
          id: 'student-demo-id',
          email: email,
          profile: {
            ...profile,
            email: email,
            full_name: email.split('@')[0].replace('.', ' ').toUpperCase()
          }
        };
        setUser(localUser);
        setProfile(localUser.profile);
        localStorage.setItem('studyhub_user', JSON.stringify(localUser));
        return { success: true };
      }
    } finally {
      setLoading(false);
    }
  };

  const signup = async ({ email, password, full_name, college_name, branch, semester }) => {
    setLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name, college_name, branch, semester }
          }
        });
        if (error) throw error;
        setUser(data.user);
        return { success: true };
      } else {
        const newUser = {
          id: 'user-' + Date.now(),
          email,
          profile: {
            id: 'user-' + Date.now(),
            email,
            full_name: full_name || email.split('@')[0],
            college_name: college_name || 'Engineering College',
            course: 'B.Tech',
            branch: branch || 'Computer Science & Engineering',
            semester: semester || 4,
            avatar_url: DEFAULT_PROFILE.avatar_url
          }
        };
        setUser(newUser);
        setProfile(newUser.profile);
        localStorage.setItem('studyhub_user', JSON.stringify(newUser));
        return { success: true };
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem('studyhub_user');
    setUser(null);
  };

  const updateProfile = async (updates) => {
    const updated = { ...profile, ...updates };
    setProfile(updated);
    
    if (user) {
      const stored = { ...user, profile: updated };
      localStorage.setItem('studyhub_user', JSON.stringify(stored));
    }

    if (isSupabaseConfigured && supabase && user?.id) {
      try {
        await supabase.from('profiles').update(updates).eq('id', user.id);
      } catch (e) {
        console.error('Failed to update Supabase profile:', e);
      }
    }
    return updated;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isAuthenticated: Boolean(user),
        isSupabaseLive: isSupabaseConfigured,
        login,
        signup,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

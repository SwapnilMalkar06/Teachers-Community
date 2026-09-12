'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { GraduationCap, BookOpen, Building, Search, FileText, Presentation, FileQuestion, LogOut, ArrowRight, RefreshCw, CheckCircle, Sparkles } from 'lucide-react';

interface StudentSession {
  name: string;
  email: string;
  role: string;
  studentProfile?: {
    university: string;
    department: string;
    yearOfStudy: string;
  };
}

export default function StudentDashboardPage() {
  const router = useRouter();
  const [student, setStudent] = useState<StudentSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudentSession();
  }, []);

  const fetchStudentSession = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/session');
      const data = await res.json();
      if (data.isAuthenticated && data.user && data.user.role === 'STUDENT') {
        setStudent(data.user);
      } else if (data.isAuthenticated && data.user) {
        // Logged in as non-student (e.g. Teacher or Admin)
        setStudent(data.user);
      } else {
        router.push('/login?role=student');
      }
    } catch (err) {
      console.error('Student session error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center space-x-3">
        <RefreshCw className="w-6 h-6 animate-spin text-emerald-400" />
        <span className="font-semibold text-sm">Loading Student Portal...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Card */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold">
              <GraduationCap className="w-8 h-8" />
            </div>
            <div>
              <div className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[11px] font-bold tracking-wide uppercase mb-1">
                Level 3: Student Academic Access
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Welcome, {student?.name || 'Student'}!
              </h1>
              <p className="text-xs text-slate-400">
                {student?.studentProfile?.university || 'University Student'} • {student?.studentProfile?.department || 'Engineering'} ({student?.studentProfile?.yearOfStudy || 'TE'})
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-all border border-slate-700"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>

        {/* Quick Action Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <Link
            href="/teachers"
            className="bg-slate-900 border border-slate-800 hover:border-sky-500/50 rounded-3xl p-6 space-y-4 transition-all group shadow-xl"
          >
            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center">
              <Building className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-extrabold text-white group-hover:text-sky-300 transition-colors">
                Teachers Directory
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Filter professors by University name, Department, and specialized Expertise domains.
              </p>
            </div>
            <div className="pt-2 text-xs font-bold text-sky-400 flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
              <span>Browse University Teachers</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          <Link
            href="/resources"
            className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-3xl p-6 space-y-4 transition-all group shadow-xl"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-extrabold text-white group-hover:text-amber-300 transition-colors">
                Resource Analyzer Hub
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Search & download Notes, PPT presentation slides, and Question Banks across subjects.
              </p>
            </div>
            <div className="pt-2 text-xs font-bold text-amber-400 flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
              <span>Explore Study Resources</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-extrabold text-white">Student Academic Status</h2>
              <p className="text-xs text-slate-400">
                You have full access to study materials from all participating teachers.
              </p>
            </div>
            <div className="pt-2 text-[11px] text-emerald-400 font-semibold flex items-center space-x-1.5">
              <CheckCircle className="w-4 h-4" />
              <span>Verified Student Membership</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

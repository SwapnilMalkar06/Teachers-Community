'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  Building, 
  Sparkles, 
  Search, 
  ShieldCheck, 
  UserCheck, 
  GraduationCap, 
  FileText, 
  Presentation, 
  FileQuestion, 
  ArrowRight, 
  Users, 
  ChevronRight,
  RefreshCw
} from 'lucide-react';

interface TeacherSnippet {
  id: string;
  fullName: string;
  designation: string;
  department: string;
  university: string;
  expertise: string;
  profileImageUrl: string;
  _count: { resources: number };
}

export default function HomePage() {
  const [teachers, setTeachers] = useState<TeacherSnippet[]>([]);
  const [universities, setUniversities] = useState<string[]>([]);
  const [expertises, setExpertises] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Quick Search inputs
  const [selectedUni, setSelectedUni] = useState('ALL');
  const [selectedExp, setSelectedExp] = useState('ALL');

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const res = await fetch('/api/teachers');
      const data = await res.json();
      if (data.success) {
        setTeachers(data.teachers || []);
        if (data.filters) {
          setUniversities(data.filters.universities || []);
          setExpertises(data.filters.expertises || []);
        }
      }
    } catch (err) {
      console.error('Homepage fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-4 sm:px-8 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(14,165,233,0.25),rgba(255,255,255,0))]">
        <div className="max-w-7xl mx-auto text-center space-y-6">
          
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-bold">
            <Sparkles className="w-4 h-4" />
            <span>Multi-University Academic Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight max-w-4xl mx-auto leading-tight">
            One Platform for <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-400 to-amber-400">Multiple University Teachers</span> & Students
          </h1>

          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Discover professors by <strong>University</strong> and <strong>Expertise</strong>. Explore and analyze comprehensive <strong>Notes</strong>, <strong>PPT Presentations</strong>, and <strong>Question Banks</strong> contributed by expert educators.
          </p>

          {/* Search Box Card */}
          <div className="max-w-3xl mx-auto bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 text-left">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Select University</label>
                <select
                  value={selectedUni}
                  onChange={(e) => setSelectedUni(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-medium text-white focus:ring-2 focus:ring-sky-500"
                >
                  <option value="ALL">All Universities (Mumbai, SPPU, IIT, etc.)</option>
                  {universities.map((uni, i) => (
                    <option key={i} value={uni}>{uni}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Select Expertise Domain</label>
                <select
                  value={selectedExp}
                  onChange={(e) => setSelectedExp(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-medium text-white focus:ring-2 focus:ring-sky-500"
                >
                  <option value="ALL">All Expertise Domains</option>
                  {expertises.map((exp, i) => (
                    <option key={i} value={exp}>{exp}</option>
                  ))}
                </select>
              </div>
            </div>

            <Link
              href={`/teachers?university=${encodeURIComponent(selectedUni)}&expertise=${encodeURIComponent(selectedExp)}`}
              className="w-full py-3.5 px-6 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-lg shadow-sky-900/30 transition-all flex items-center justify-center space-x-2"
            >
              <Search className="w-4 h-4" />
              <span>Search Teachers & Profiles</span>
            </Link>
          </div>

        </div>
      </section>

      {/* 3 User Levels Overview */}
      <section className="py-16 px-4 sm:px-8 border-t border-slate-900 bg-slate-950">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              3 Role-Based User Levels & Logins
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
              Dedicated interfaces tailored for System Admin, Teachers, and Students.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Level 1: Admin */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 hover:border-rose-500/40 transition-all shadow-xl flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div className="inline-block px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 text-[10px] font-bold uppercase">
                  Level 1 Role
                </div>
                <h3 className="text-xl font-bold text-white">System Admin</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Monitors the complete platform activity, adds and manages all university teacher accounts, and maintains data integrity.
                </p>
              </div>
              <Link
                href="/login?role=admin"
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-rose-600 text-slate-200 hover:text-white font-bold text-xs transition-all flex items-center justify-center space-x-2 border border-slate-700 hover:border-rose-500"
              >
                <span>Admin Login</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Level 2: Teacher */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 hover:border-sky-500/40 transition-all shadow-xl flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center">
                  <UserCheck className="w-6 h-6" />
                </div>
                <div className="inline-block px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-400 text-[10px] font-bold uppercase">
                  Level 2 Role
                </div>
                <h3 className="text-xl font-bold text-white">University Teacher</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Manages personal profile, designation, and expertise tags. Uploads and manages Notes, PPT slides, and Question Banks.
                </p>
              </div>
              <Link
                href="/login?role=teacher"
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-sky-600 text-slate-200 hover:text-white font-bold text-xs transition-all flex items-center justify-center space-x-2 border border-slate-700 hover:border-sky-500"
              >
                <span>Teacher Login</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Level 3: Student */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 hover:border-emerald-500/40 transition-all shadow-xl flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase">
                  Level 3 Role
                </div>
                <h3 className="text-xl font-bold text-white">Student Access</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Searches teachers by university and expertise. Analyzes and downloads study resources, Notes, PPTs, and Question Banks.
                </p>
              </div>
              <Link
                href="/login?role=student"
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-emerald-600 text-slate-200 hover:text-white font-bold text-xs transition-all flex items-center justify-center space-x-2 border border-slate-700 hover:border-emerald-500"
              >
                <span>Student Login / Register</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* Featured Teachers & Resources */}
      <section className="py-16 px-4 sm:px-8 border-t border-slate-900 bg-slate-950">
        <div className="max-w-7xl mx-auto space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">Featured University Teachers</h2>
              <p className="text-xs text-slate-400">Explore educators across Mumbai University, SPPU Pune, IIT Bombay, and more.</p>
            </div>

            <Link
              href="/teachers"
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-sky-400 text-xs font-bold border border-slate-800"
            >
              <span>View All Teachers</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="py-12 text-center text-slate-500 text-xs flex items-center justify-center space-x-2">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Loading teachers...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {teachers.slice(0, 3).map((t) => (
                <div key={t.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 hover:border-sky-500/40 transition-all shadow-lg flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 text-[11px] font-bold border border-sky-500/20">
                        {t.university}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white">{t.fullName}</h3>
                    <p className="text-xs font-semibold text-slate-400">{t.designation} • {t.department}</p>
                    
                    <div className="flex flex-wrap gap-1 pt-1">
                      {t.expertise.split(',').map((exp, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-medium">
                          {exp.trim()}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Link
                    href={`/teachers/${t.id}`}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-sky-600 text-slate-200 hover:text-white font-bold text-xs transition-all flex items-center justify-center space-x-2"
                  >
                    <span>View Profile & Notes</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              ))}
            </div>
          )}

        </div>
      </section>

    </div>
  );
}

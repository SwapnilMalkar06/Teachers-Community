'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, UserCheck, GraduationCap, Lock, Mail, User, Building, BookOpen, AlertCircle, CheckCircle, ArrowRight, RefreshCw } from 'lucide-react';

type RoleTab = 'ADMIN' | 'TEACHER' | 'STUDENT';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = (searchParams.get('role')?.toUpperCase() as RoleTab) || 'STUDENT';

  const [activeTab, setActiveTab] = useState<RoleTab>(initialRole);
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [university, setUniversity] = useState('Mumbai University');
  const [department, setDepartment] = useState('Computer Engineering');
  const [yearOfStudy, setYearOfStudy] = useState('TE');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    // Fill sample email defaults for easy demo
    if (activeTab === 'ADMIN') {
      setEmail('admin@teacherscommunity.com');
      setPassword('admin123');
    } else if (activeTab === 'TEACHER') {
      setEmail('ashwini@teacherscommunity.com');
      setPassword('teacher123');
    } else if (activeTab === 'STUDENT' && !isRegisterMode) {
      setEmail('student@teacherscommunity.com');
      setPassword('student123');
    }
    setError(null);
    setSuccess(null);
  }, [activeTab, isRegisterMode]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role: activeTab }),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess('Authentication successful! Redirecting...');
        setTimeout(() => {
          if (activeTab === 'ADMIN') {
            router.push('/admin/dashboard');
          } else if (activeTab === 'TEACHER') {
            router.push('/teacher/dashboard');
          } else {
            router.push('/student/dashboard');
          }
          router.refresh();
        }, 800);
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Network connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, university, department, yearOfStudy }),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess('Student registration successful! Redirecting...');
        setTimeout(() => {
          router.push('/student/dashboard');
          router.refresh();
        }, 800);
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('Network error during registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg bg-slate-800/80 backdrop-blur-xl border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
      
      {/* Role Selector Tabs */}
      <div className="grid grid-cols-3 gap-2 bg-slate-950/60 p-1.5 rounded-2xl border border-slate-800">
        <button
          type="button"
          onClick={() => { setActiveTab('ADMIN'); setIsRegisterMode(false); }}
          className={`flex flex-col items-center py-2.5 px-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'ADMIN'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-900/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <ShieldCheck className="w-5 h-5 mb-1" />
          <span>Admin</span>
        </button>

        <button
          type="button"
          onClick={() => { setActiveTab('TEACHER'); setIsRegisterMode(false); }}
          className={`flex flex-col items-center py-2.5 px-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'TEACHER'
              ? 'bg-sky-600 text-white shadow-md shadow-sky-900/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <UserCheck className="w-5 h-5 mb-1" />
          <span>Teacher</span>
        </button>

        <button
          type="button"
          onClick={() => { setActiveTab('STUDENT'); }}
          className={`flex flex-col items-center py-2.5 px-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'STUDENT'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <GraduationCap className="w-5 h-5 mb-1" />
          <span>Student</span>
        </button>
      </div>

      {/* Tab Description Header */}
      <div className="text-center pb-2 border-b border-slate-700/60">
        <h2 className="text-lg font-bold text-white flex items-center justify-center space-x-2">
          {activeTab === 'ADMIN' && <span className="text-rose-400">System Admin Sign In</span>}
          {activeTab === 'TEACHER' && <span className="text-sky-400">Teacher Management Portal</span>}
          {activeTab === 'STUDENT' && (
            <span className="text-emerald-400">
              {isRegisterMode ? 'Student Account Registration' : 'Student Sign In'}
            </span>
          )}
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          {activeTab === 'ADMIN' && 'Monitor all university teachers, manage platform accounts & system data.'}
          {activeTab === 'TEACHER' && 'Manage your teacher profile, subjects, notes, PPTs & research papers.'}
          {activeTab === 'STUDENT' && 'Access notes, search teachers by university & expertise, save resources.'}
        </p>
      </div>

      {/* Alerts */}
      {error && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-medium flex items-center space-x-2.5">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium flex items-center space-x-2.5">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Form Body */}
      {activeTab === 'STUDENT' && isRegisterMode ? (
        /* Student Register Form */
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="Rohan Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-xs font-medium text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Student Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="student@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-xs font-medium text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-xs font-medium text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">University</label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="Mumbai University"
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-xs font-medium text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Year of Study</label>
              <select
                value={yearOfStudy}
                onChange={(e) => setYearOfStudy(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-xs font-medium text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="FE">First Year (FE)</option>
                <option value="SE">Second Year (SE)</option>
                <option value="TE">Third Year (TE)</option>
                <option value="BE">Final Year (BE)</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-lg shadow-emerald-900/30 flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <span>{loading ? 'Registering Account...' : 'Complete Student Registration'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      ) : (
        /* Sign In Form */
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {activeTab === 'ADMIN' ? 'Admin Email' : activeTab === 'TEACHER' ? 'Teacher Email' : 'Student Email'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="email@teacherscommunity.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-xs font-medium text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-xs font-medium text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div className="mt-1 text-[11px] text-slate-400 font-mono">
              {activeTab === 'ADMIN' && 'Demo: admin@teacherscommunity.com / admin123'}
              {activeTab === 'TEACHER' && 'Demo: ashwini@teacherscommunity.com / teacher123'}
              {activeTab === 'STUDENT' && 'Demo: student@teacherscommunity.com / student123'}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-6 rounded-xl text-white font-bold text-xs transition-all shadow-lg flex items-center justify-center space-x-2 disabled:opacity-50 ${
              activeTab === 'ADMIN'
                ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-900/40'
                : activeTab === 'TEACHER'
                ? 'bg-sky-600 hover:bg-sky-500 shadow-sky-900/40'
                : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/40'
            }`}
          >
            <span>{loading ? 'Authenticating...' : `Log In as ${activeTab}`}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      )}

      {/* Bottom Toggle for Student / Teacher Request */}
      {activeTab === 'STUDENT' && (
        <div className="pt-2 text-center text-xs text-slate-400 border-t border-slate-700/60">
          {isRegisterMode ? (
            <span>
              Already have a student account?{' '}
              <button
                type="button"
                onClick={() => setIsRegisterMode(false)}
                className="text-emerald-400 hover:underline font-semibold"
              >
                Sign In
              </button>
            </span>
          ) : (
            <span>
              New student?{' '}
              <button
                type="button"
                onClick={() => setIsRegisterMode(true)}
                className="text-emerald-400 hover:underline font-semibold"
              >
                Create Student Account
              </button>
            </span>
          )}
        </div>
      )}

      {activeTab === 'TEACHER' && (
        <div className="pt-2 text-center text-xs text-slate-400 border-t border-slate-700/60 space-y-1.5">
          <div>
            <span>New university teacher? </span>
            <Link
              href="/teachers/join-request"
              className="text-sky-400 hover:underline font-semibold"
            >
              Send Request to Admin to Create Profile
            </Link>
          </div>
        </div>
      )}

    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-900 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(14,165,233,0.25),rgba(255,255,255,0))] flex flex-col justify-center items-center px-4 py-16 text-slate-100">
      {/* Platform Branding */}
      <div className="text-center mb-8 space-y-2">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold">
          <BookOpen className="w-4 h-4" />
          <span>Teachers-Community Unified Login</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Welcome to Teachers-Community Portal
        </h1>
        <p className="text-slate-400 text-sm max-w-md mx-auto">
          Connect across Universities, access Notes, PPTs, Question Banks & multi-role academic tools.
        </p>
      </div>

      <Suspense fallback={
        <div className="flex items-center space-x-2 text-slate-400 text-xs py-10 font-mono">
          <RefreshCw className="w-4 h-4 animate-spin text-sky-400" />
          <span>Loading Auth Portal...</span>
        </div>
      }>
        <LoginContent />
      </Suspense>
    </div>
  );
}

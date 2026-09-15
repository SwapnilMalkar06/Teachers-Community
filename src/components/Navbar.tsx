'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  BookOpen, 
  Building, 
  Users, 
  FileText, 
  Menu, 
  X, 
  UserCheck, 
  GraduationCap, 
  ShieldCheck, 
  LogOut,
  ChevronDown
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    fetchSession();
  }, [pathname]);

  const fetchSession = async () => {
    try {
      const res = await fetch('/api/auth/session');
      const data = await res.json();
      if (data.isAuthenticated && data.user) {
        setSession(data.user);
      } else {
        setSession(null);
      }
    } catch (err) {
      setSession(null);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setSession(null);
    window.location.href = '/login';
  };

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/');

  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800 text-slate-100 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Brand Logo & Name */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-sky-950 group-hover:scale-105 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-white block leading-none">
                Teachers<span className="text-sky-400">-Community</span>
              </span>
              <span className="text-[11px] font-semibold text-slate-400 block mt-1">
                Multi-University Academic Platform
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            <Link
              href="/"
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                pathname === '/'
                  ? 'text-sky-400 bg-sky-500/10 border border-sky-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              Home
            </Link>

            <Link
              href="/teachers"
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                isActive('/teachers')
                  ? 'text-sky-400 bg-sky-500/10 border border-sky-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Building className="w-3.5 h-3.5 text-sky-400" />
              <span>Teachers Directory</span>
            </Link>

            <Link
              href="/resources"
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                isActive('/resources')
                  ? 'text-amber-400 bg-amber-500/10 border border-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>Notes, PPTs & Q-Banks</span>
            </Link>

            <Link
              href="/blog"
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                isActive('/blog')
                  ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              <span>Faculty Blogs</span>
            </Link>

            {/* Role-based Dashboard or Login Link */}
            {session ? (
              <div className="flex items-center space-x-2 pl-2">
                <Link
                  href={
                    session.role === 'ADMIN'
                      ? '/admin/dashboard'
                      : session.role === 'TEACHER'
                      ? '/teacher/dashboard'
                      : '/student/dashboard'
                  }
                  className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md shadow-sky-900/30 flex items-center space-x-1.5"
                >
                  {session.role === 'ADMIN' && <ShieldCheck className="w-3.5 h-3.5 text-rose-300" />}
                  {session.role === 'TEACHER' && <UserCheck className="w-3.5 h-3.5 text-sky-200" />}
                  {session.role === 'STUDENT' && <GraduationCap className="w-3.5 h-3.5 text-emerald-200" />}
                  <span>{session.role} Dashboard</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-rose-400 border border-slate-800 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 pl-2">
                <Link
                  href="/login"
                  className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-lg shadow-sky-900/30 transition-all flex items-center space-x-1.5"
                >
                  <span>Sign In / 3 Logins</span>
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-300 hover:bg-slate-900 transition-colors"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950 border-b border-slate-800 px-4 pt-2 pb-6 space-y-2 shadow-xl">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-bold text-slate-200 hover:bg-slate-900"
          >
            Home
          </Link>
          <Link
            href="/teachers"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-bold text-slate-200 hover:bg-slate-900"
          >
            Teachers Directory (By University & Expertise)
          </Link>
          <Link
            href="/resources"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-bold text-slate-200 hover:bg-slate-900"
          >
            Notes, PPTs & Question Banks Hub
          </Link>

          <div className="pt-3 border-t border-slate-800">
            {session ? (
              <Link
                href={
                  session.role === 'ADMIN'
                    ? '/admin/dashboard'
                    : session.role === 'TEACHER'
                    ? '/teacher/dashboard'
                    : '/student/dashboard'
                }
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center py-2.5 bg-sky-600 text-white rounded-xl text-xs font-bold"
              >
                Go to {session.role} Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center py-2.5 bg-sky-600 text-white rounded-xl text-xs font-bold"
              >
                Sign In (Admin / Teacher / Student)
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

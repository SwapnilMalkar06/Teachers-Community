'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  GraduationCap, 
  BookOpen, 
  Building, 
  Search, 
  FileText, 
  LogOut, 
  ArrowRight, 
  RefreshCw, 
  CheckCircle, 
  Sparkles, 
  Calendar, 
  Eye, 
  Clock, 
  Filter, 
  X, 
  User, 
  BookMarked 
} from 'lucide-react';

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

interface TeacherProfile {
  id: string;
  fullName: string;
  designation: string;
  department: string;
  university: string;
  profileImageUrl?: string;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  coverImage?: string | null;
  isPublished: boolean;
  viewCount: number;
  estimatedReadingMinutes: number;
  createdAt: string;
  teacher?: TeacherProfile | null;
}

function getValidImageUrl(src: string | null | undefined): string {
  const defaultFallback = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800';
  if (!src) return defaultFallback;
  const trimmed = src.trim();
  if (!trimmed) return defaultFallback;
  if (trimmed.startsWith('/') || trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:image/')) {
    return trimmed;
  }
  return defaultFallback;
}

export default function StudentDashboardPage() {
  const router = useRouter();
  const [student, setStudent] = useState<StudentSession | null>(null);
  const [loading, setLoading] = useState(true);

  // Blog Portal State inside Student Dashboard
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [blogsLoading, setBlogsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeacherId, setSelectedTeacherId] = useState('');
  const [teachersList, setTeachersList] = useState<TeacherProfile[]>([]);
  
  // Quick Reader Modal State
  const [activeReadingPost, setActiveReadingPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    fetchStudentSession();
    fetchTeachers();
    fetchStudentBlogs();
  }, []);

  const fetchStudentSession = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/session');
      const data = await res.json();
      if (data.isAuthenticated && data.user) {
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

  const fetchTeachers = async () => {
    try {
      const res = await fetch('/api/teachers');
      const data = await res.json();
      if (data.success && data.teachers) {
        setTeachersList(data.teachers);
      }
    } catch (err) {
      console.error('Error fetching teachers:', err);
    }
  };

  const fetchStudentBlogs = async (query = '', teacherId = '') => {
    setBlogsLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.append('q', query);
      if (teacherId) params.append('teacherId', teacherId);

      const res = await fetch(`/api/blog?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setBlogs(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching blogs for student:', err);
    } finally {
      setBlogsLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchStudentBlogs(searchQuery, selectedTeacherId);
  };

  const handleTeacherFilterChange = (teacherId: string) => {
    setSelectedTeacherId(teacherId);
    fetchStudentBlogs(searchQuery, teacherId);
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center space-x-3">
        <RefreshCw className="w-6 h-6 animate-spin text-emerald-400" />
        <span className="font-semibold text-sm">Loading Student Portal...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header Card */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold">
              <GraduationCap className="w-8 h-8" />
            </div>
            <div>
              <div className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[11px] font-bold tracking-wide uppercase mb-1 border border-emerald-500/20">
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
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-all border border-slate-700 shadow-sm"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>

        {/* Quick Action Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
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
              <FileText className="w-6 h-6" />
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

          <Link
            href="#faculty-blogs-section"
            className="bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-3xl p-6 space-y-4 transition-all group shadow-xl"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-extrabold text-white group-hover:text-emerald-300 transition-colors">
                Faculty Blogs & Articles
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Read educational guides, DSA tips, research trends, and exam strategies written by professors.
              </p>
            </div>
            <div className="pt-2 text-xs font-bold text-emerald-400 flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
              <span>Read Faculty Blogs</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

        </div>

        {/* ========================================================================= */}
        {/* STUDENT BLOG READING PORTAL SECTION */}
        {/* ========================================================================= */}
        <div id="faculty-blogs-section" className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-6">
            <div className="space-y-1">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <BookMarked className="w-4 h-4" />
                <span>Student Reading Hub</span>
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight">
                Faculty Blogs & Academic Publications
              </h2>
              <p className="text-xs text-slate-400">
                Explore articles and guidance written by university faculty members for students.
              </p>
            </div>

            <Link
              href="/blog"
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-400 font-bold text-xs border border-slate-700 transition-all self-start md:self-auto"
            >
              <span>View Full Blog Listing Page</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Search & Filter Bar */}
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            
            <div className="sm:col-span-7 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Search articles by topic, DSA, AI, Cybersecurity..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="sm:col-span-3 relative">
              <Filter className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <select
                value={selectedTeacherId}
                onChange={(e) => handleTeacherFilterChange(e.target.value)}
                className="w-full pl-10 pr-8 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none cursor-pointer"
              >
                <option value="">All Faculty Authors</option>
                {teachersList.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.fullName} ({t.department || 'Faculty'})
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="sm:col-span-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all flex items-center justify-center space-x-1.5 shadow-md shadow-emerald-950"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search</span>
            </button>

          </form>

          {/* Articles Grid */}
          {blogsLoading ? (
            <div className="py-16 text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
              <p className="text-xs font-bold text-slate-400">Loading student articles...</p>
            </div>
          ) : blogs.length === 0 ? (
            <div className="py-16 text-center bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
              <BookOpen className="w-10 h-10 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-slate-300">No Faculty Articles Found</h3>
              <p className="text-xs text-slate-500">Try clearing search filters to see all student publications.</p>
              {(searchQuery || selectedTeacherId) && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedTeacherId('');
                    fetchStudentBlogs('', '');
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((post) => {
                const coverImg = getValidImageUrl(post.coverImage);
                const authorName = post.teacher?.fullName || 'Prof. Ashwini Sawant';
                const authorRole = post.teacher?.designation || 'Faculty Author';
                const authorUni = post.teacher?.university || 'University';

                return (
                  <div
                    key={post.id}
                    className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between group shadow-lg"
                  >
                    <div className="space-y-4">
                      
                      {/* Cover Thumbnail */}
                      <div className="relative w-full h-48 bg-slate-900 overflow-hidden">
                        <Image
                          src={coverImg}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        
                        <div className="absolute top-2.5 left-2.5 flex items-center space-x-1.5">
                          <span className="px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md text-white font-bold text-[10px] border border-slate-800 flex items-center space-x-1">
                            <Clock className="w-3 h-3 text-emerald-400" />
                            <span>{post.estimatedReadingMinutes} min read</span>
                          </span>
                        </div>

                        <div className="absolute top-2.5 right-2.5">
                          <span className="px-2.5 py-1 rounded-lg bg-emerald-950/90 backdrop-blur-md text-emerald-300 font-bold text-[10px] border border-emerald-500/30 flex items-center space-x-1">
                            <Eye className="w-3 h-3 text-emerald-400" />
                            <span>{post.viewCount} views</span>
                          </span>
                        </div>
                      </div>

                      {/* Content Header & Body */}
                      <div className="px-5 space-y-3">
                        
                        {/* Author Badge */}
                        <div className="flex items-center space-x-2.5 pb-2 border-b border-slate-900">
                          <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-xs border border-emerald-500/30 shrink-0">
                            {authorName.charAt(0)}
                          </div>
                          <div className="overflow-hidden">
                            <div className="text-xs font-bold text-white truncate">{authorName}</div>
                            <div className="text-[10px] text-slate-400 truncate">
                              {authorRole} • <span className="text-emerald-400">{authorUni}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 text-[10px] font-semibold text-slate-400">
                          <Calendar className="w-3 h-3 text-emerald-400" />
                          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>

                        <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-2 leading-snug">
                          {post.title}
                        </h3>

                        <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                          {post.summary}
                        </p>

                      </div>

                    </div>

                    {/* Action buttons */}
                    <div className="p-5 pt-4 flex items-center space-x-2">
                      <button
                        onClick={() => setActiveReadingPost(post)}
                        className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all text-center shadow-md shadow-emerald-950"
                      >
                        Quick Read Article
                      </button>

                      <Link
                        href={`/blog/${post.slug}`}
                        className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs border border-slate-800 transition-all flex items-center justify-center"
                        title="Open Full Page"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>

      </div>

      {/* ========================================================================= */}
      {/* QUICK READING MODAL FOR STUDENT DASHBOARD */}
      {/* ========================================================================= */}
      {activeReadingPost && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="p-6 bg-slate-950 border-b border-slate-800 flex items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[11px] font-bold border border-emerald-500/20">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{activeReadingPost.teacher?.department || 'Academic Blog'}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                  {activeReadingPost.title}
                </h2>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center space-x-1 text-emerald-300 font-semibold">
                    <User className="w-3.5 h-3.5" />
                    <span>{activeReadingPost.teacher?.fullName || 'Prof. Ashwini Sawant'}</span>
                  </span>
                  <span>•</span>
                  <span>{new Date(activeReadingPost.createdAt).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>{activeReadingPost.estimatedReadingMinutes} min read</span>
                </div>
              </div>

              <button
                onClick={() => setActiveReadingPost(null)}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body with Blog Content */}
            <div className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1 text-slate-200">
              
              {activeReadingPost.coverImage && (
                <div className="relative w-full h-56 sm:h-64 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
                  <Image
                    src={getValidImageUrl(activeReadingPost.coverImage)}
                    alt={activeReadingPost.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              {activeReadingPost.summary && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-300 text-xs font-medium leading-relaxed italic">
                  <strong className="not-italic text-emerald-200">Summary:</strong> {activeReadingPost.summary}
                </div>
              )}

              {/* Rendered Body Content */}
              <div 
                className="blog-content-body prose prose-invert max-w-none text-slate-200 text-sm leading-relaxed space-y-4"
                dangerouslySetInnerHTML={{ __html: activeReadingPost.content }}
              />

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
              <Link
                href={`/blog/${activeReadingPost.slug}`}
                className="text-xs font-bold text-emerald-400 hover:underline flex items-center space-x-1"
              >
                <span>Open Full Page URL</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <button
                onClick={() => setActiveReadingPost(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all"
              >
                Close Reader
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

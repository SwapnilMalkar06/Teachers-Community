'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, Calendar, Eye, Clock, ArrowRight, Search, Filter, RefreshCw } from 'lucide-react';

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

export default function BlogListingPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeacherId, setSelectedTeacherId] = useState('');
  const [teachersList, setTeachersList] = useState<TeacherProfile[]>([]);

  useEffect(() => {
    fetchTeachers();
    fetchBlogs();
  }, []);

  const fetchTeachers = async () => {
    try {
      const res = await fetch('/api/teachers');
      const data = await res.json();
      if (data.success && data.teachers) {
        setTeachersList(data.teachers);
      }
    } catch (err) {
      console.error('Error fetching teachers list:', err);
    }
  };

  const fetchBlogs = async (query = '', teacherId = '') => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.append('q', query);
      if (teacherId) params.append('teacherId', teacherId);

      const res = await fetch(`/api/blog?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setPosts(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching blog posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBlogs(searchQuery, selectedTeacherId);
  };

  const handleTeacherFilterChange = (teacherId: string) => {
    setSelectedTeacherId(teacherId);
    fetchBlogs(searchQuery, teacherId);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-b from-sky-900 via-slate-900 to-slate-950 text-white py-16 border-b border-slate-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Academic Community Blogs</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white">
            Teacher Publications & Insights
          </h1>
          
          <p className="text-slate-300 max-w-3xl font-medium text-sm sm:text-base leading-relaxed">
            Read articles written by faculty members across Computer Engineering, exam preparation strategies, algorithms, research trends, and student guides.
          </p>

          {/* Search & Filter Bar */}
          <div className="pt-4 max-w-4xl">
            <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
              
              {/* Search Keyword Input */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="Search articles by topic, title, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-800/90 border border-slate-700 text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-sky-500 placeholder-slate-400"
                />
              </div>

              {/* Filter By Teacher */}
              <div className="relative sm:w-64">
                <Filter className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <select
                  value={selectedTeacherId}
                  onChange={(e) => handleTeacherFilterChange(e.target.value)}
                  className="w-full pl-10 pr-8 py-3 rounded-2xl bg-slate-800/90 border border-slate-700 text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-sky-500 appearance-none cursor-pointer"
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
                className="px-6 py-3 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-1.5"
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
              </button>

            </form>
          </div>

        </div>
      </div>

      {/* Articles Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        
        {loading ? (
          <div className="text-center py-20 space-y-3">
            <RefreshCw className="w-8 h-8 text-sky-600 animate-spin mx-auto" />
            <p className="text-xs font-bold text-slate-500">Loading articles...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 space-y-3 shadow-sm max-w-2xl mx-auto">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800">No Articles Found</h3>
            <p className="text-xs text-slate-500">Try adjusting your search criteria or teacher filter.</p>
            {(searchQuery || selectedTeacherId) && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedTeacherId('');
                  fetchBlogs('', '');
                }}
                className="px-4 py-2 rounded-xl bg-sky-100 text-sky-800 font-bold text-xs hover:bg-sky-200"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => {
              const coverImg = getValidImageUrl(post.coverImage);
              const authorName = post.teacher?.fullName || 'Prof. Ashwini Sawant';
              const authorRole = post.teacher?.designation || 'Faculty Author';

              return (
                <div
                  key={post.id}
                  className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    
                    {/* Cover Image Container */}
                    <div className="relative w-full h-56 bg-slate-100 overflow-hidden">
                      <Image
                        src={coverImg}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      
                      <div className="absolute top-3 left-3 flex items-center space-x-2">
                        <span className="px-3 py-1 rounded-xl bg-slate-900/90 backdrop-blur-md text-white font-bold text-[11px] shadow-md flex items-center space-x-1">
                          <Clock className="w-3 h-3 text-sky-400" />
                          <span>{post.estimatedReadingMinutes} min read</span>
                        </span>
                      </div>

                      <div className="absolute top-3 right-3">
                        <span className="px-3 py-1 rounded-xl bg-sky-900/90 backdrop-blur-md text-white font-bold text-[11px] shadow-md flex items-center space-x-1">
                          <Eye className="w-3 h-3 text-sky-300" />
                          <span>{post.viewCount} reads</span>
                        </span>
                      </div>
                    </div>

                    {/* Article Content */}
                    <div className="p-6 pt-1 space-y-3">
                      
                      {/* Teacher Author Header */}
                      <div className="flex items-center space-x-2.5 pt-1 pb-2 border-b border-slate-100">
                        <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-800 flex items-center justify-center font-bold text-xs border border-sky-200">
                          {authorName.charAt(0)}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-800 leading-tight">{authorName}</div>
                          <div className="text-[10px] text-slate-500 font-medium">{authorRole}</div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 text-[11px] font-bold text-slate-400 pt-1">
                        <Calendar className="w-3.5 h-3.5 text-sky-600" />
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                      </div>

                      <h2 className="text-lg font-bold text-slate-900 group-hover:text-sky-700 transition-colors leading-snug">
                        {post.title}
                      </h2>

                      <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                        {post.summary}
                      </p>

                    </div>
                  </div>

                  {/* Read Article Action */}
                  <div className="p-6 pt-0">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center space-x-2 w-full justify-center py-2.5 rounded-xl bg-slate-900 hover:bg-sky-700 text-white text-xs font-bold transition-all shadow-sm group-hover:shadow-md"
                    >
                      <span>Read Full Article</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}

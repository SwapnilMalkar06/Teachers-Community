'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Video, Play, Filter, Search, X, Sparkles } from 'lucide-react';

interface VideoItem {
  id: string;
  title: string;
  youtubeUrl: string;
  youtubeId?: string | null;
  description?: string | null;
  createdAt: string;
  subject: {
    code: string;
    name: string;
    semester: string;
  };
}

interface SubjectItem {
  id: string;
  code: string;
  name: string;
}

export default function VideosPage() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [subjects, setSubjects] = useState<SubjectItem[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/teaching/resources');
        const json = await res.json();
        if (json.success) {
          setVideos(json.data.videos);
          setSubjects(json.data.subjects);
        }
      } catch (err) {
        console.error('Error loading video lectures:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredVideos = videos.filter((video) => {
    const matchesSubject = selectedSubject === 'ALL' || video.subject.code === selectedSubject;
    const matchesSearch =
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (video.description && video.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      video.subject.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-b from-sky-50/70 via-white to-slate-50 py-12 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Video className="w-3.5 h-3.5" />
            <span>Digital Classroom</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Video Lectures
          </h1>
          <p className="text-slate-600 mt-2 max-w-3xl font-medium">
            Recorded video lessons, topic tutorials, and lecture playlists by Prof. Ashwini Sawant.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            <Filter className="w-4 h-4 text-sky-600 flex-shrink-0" />
            <button
              onClick={() => setSelectedSubject('ALL')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex-shrink-0 ${
                selectedSubject === 'ALL'
                  ? 'bg-sky-700 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All Subjects
            </button>
            {subjects.map((sub) => (
              <button
                key={sub.id}
                onClick={() => setSelectedSubject(sub.code)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex-shrink-0 ${
                  selectedSubject === sub.code
                    ? 'bg-sky-700 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {sub.code}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search video topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
            />
          </div>

        </div>
      </div>

      {/* Videos Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="text-center py-12 text-slate-500 font-medium">Loading video lectures...</div>
        ) : filteredVideos.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 space-y-2">
            <Video className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800">No Video Lectures Found</h3>
            <p className="text-xs text-slate-500">Try selecting a different subject filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((vid) => {
              const yId = vid.youtubeId || 'RBSGKlAvoiM';
              const thumbnailUrl = `https://img.youtube.com/vi/${yId}/hqdefault.jpg`;

              return (
                <div
                  key={vid.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    {/* Thumbnail Container with Play Overlay */}
                    <div className="relative w-full h-48 bg-slate-900 group">
                      <Image
                        src={thumbnailUrl}
                        alt={vid.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
                      />
                      <button
                        onClick={() => setActiveVideoId(yId)}
                        className="absolute inset-0 flex items-center justify-center bg-slate-950/40 group-hover:bg-slate-950/20 transition-colors"
                        aria-label="Play video lecture"
                      >
                        <div className="w-14 h-14 rounded-full bg-red-600 text-white flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                          <Play className="w-6 h-6 fill-current ml-0.5" />
                        </div>
                      </button>
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-sky-900/90 text-white font-extrabold text-xs shadow-md">
                        {vid.subject.code}
                      </span>
                    </div>

                    <div className="p-5 space-y-2">
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-sky-700 transition-colors line-clamp-2">
                        {vid.title}
                      </h3>

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {vid.description || 'Recorded lecture session covering key algorithms and step-by-step implementations.'}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 pt-0">
                    <button
                      onClick={() => setActiveVideoId(yId)}
                      className="w-full inline-flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-sky-800 transition-all shadow-sm"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>Watch Lecture</span>
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Embedded YouTube Video Player Modal */}
      {activeVideoId && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden border border-slate-800 flex flex-col">
            <div className="p-4 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center space-x-2 font-bold text-sm">
                <Sparkles className="w-4 h-4 text-sky-400" />
                <span>Video Lecture Player</span>
              </div>
              <button
                onClick={() => setActiveVideoId(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="relative w-full aspect-video">
              <iframe
                src={`https://www.youtube.com/embed/${activeVideoId}?autoplay=1`}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="YouTube Video Player"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

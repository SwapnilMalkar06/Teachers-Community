'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, FileText, Presentation, FileQuestion, BookOpen, Building, User, Download, Eye, ExternalLink, RefreshCw, Sparkles, Filter } from 'lucide-react';

interface ResourceItem {
  id: string;
  title: string;
  description: string;
  resourceType: 'NOTES' | 'PPT' | 'QUESTION_BANK';
  fileUrl: string;
  fileType: string;
  uploadedAt: string;
  subject: {
    id: string;
    code: string;
    name: string;
    department: string;
    semester: string;
  };
  teacher: {
    id: string;
    fullName: string;
    university: string;
    department: string;
    designation: string;
  };
}

export default function ResourcesExplorerPage() {
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [counts, setCounts] = useState({ total: 0, notes: 0, ppt: 0, questionBank: 0 });
  const [loading, setLoading] = useState(true);

  // Filters
  const [activeType, setActiveType] = useState<string>('ALL');
  const [selectedUniversity, setSelectedUniversity] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected Resource Modal
  const [selectedResource, setSelectedResource] = useState<ResourceItem | null>(null);

  useEffect(() => {
    fetchResources();
  }, [activeType, selectedUniversity]);

  const fetchResources = async () => {
    setLoading(true);
    try {
      let url = `/api/resources?query=${encodeURIComponent(searchQuery)}`;
      if (activeType !== 'ALL') url += `&type=${activeType}`;
      if (selectedUniversity !== 'ALL') url += `&university=${encodeURIComponent(selectedUniversity)}`;

      const res = await fetch(url);
      const data = await res.json();

      if (data.success) {
        setResources(data.resources || []);
        if (data.counts) setCounts(data.counts);
      }
    } catch (err) {
      console.error('Error fetching resources:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchResources();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
            <BookOpen className="w-4 h-4" />
            <span>Academic Resource Analyzer Hub</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Explore & Analyze <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-sky-400 to-indigo-400">Notes, PPTs & Question Banks</span>
          </h1>

          <p className="text-sm text-slate-400 leading-relaxed">
            Search curated study resources contributed by top university professors. Filter by format, course subject, and university.
          </p>
        </div>

        {/* Filter Tabs Header */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-6 shadow-xl">
          
          <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search notes, PPT slides, question banks, or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-medium text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-all shadow-lg shadow-amber-900/30 flex items-center justify-center space-x-2"
            >
              <Search className="w-4 h-4" />
              <span>Search Resources</span>
            </button>
          </form>

          {/* Type Category Filter Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-800">
            <button
              onClick={() => setActiveType('ALL')}
              className={`p-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-between border ${
                activeType === 'ALL'
                  ? 'bg-amber-600 text-white border-amber-500 shadow-md'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4" />
                <span>All Resources</span>
              </div>
              <span className="text-[10px] bg-slate-900/80 px-2 py-0.5 rounded-full">{counts.total}</span>
            </button>

            <button
              onClick={() => setActiveType('NOTES')}
              className={`p-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-between border ${
                activeType === 'NOTES'
                  ? 'bg-blue-600 text-white border-blue-500 shadow-md'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-blue-400" />
                <span>Lecture Notes</span>
              </div>
              <span className="text-[10px] bg-slate-900/80 px-2 py-0.5 rounded-full">{counts.notes}</span>
            </button>

            <button
              onClick={() => setActiveType('PPT')}
              className={`p-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-between border ${
                activeType === 'PPT'
                  ? 'bg-amber-600 text-white border-amber-500 shadow-md'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Presentation className="w-4 h-4 text-amber-400" />
                <span>PPT Slides</span>
              </div>
              <span className="text-[10px] bg-slate-900/80 px-2 py-0.5 rounded-full">{counts.ppt}</span>
            </button>

            <button
              onClick={() => setActiveType('QUESTION_BANK')}
              className={`p-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-between border ${
                activeType === 'QUESTION_BANK'
                  ? 'bg-purple-600 text-white border-purple-500 shadow-md'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <FileQuestion className="w-4 h-4 text-purple-400" />
                <span>Question Banks</span>
              </div>
              <span className="text-[10px] bg-slate-900/80 px-2 py-0.5 rounded-full">{counts.questionBank}</span>
            </button>
          </div>

        </div>

        {/* Resources Grid */}
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <RefreshCw className="w-8 h-8 animate-spin text-amber-400 mx-auto" />
            <p className="text-xs text-slate-400">Loading resources catalog...</p>
          </div>
        ) : resources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((res) => (
              <div
                key={res.id}
                className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between hover:border-amber-500/50 transition-all space-y-4 shadow-xl group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                      res.resourceType === 'NOTES' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                      res.resourceType === 'PPT' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                    }`}>
                      {res.resourceType === 'NOTES' ? 'Lecture Notes' : res.resourceType === 'PPT' ? 'PPT Presentation' : 'Question Bank'}
                    </span>

                    <span className="text-[10px] text-slate-400 bg-slate-950 px-2.5 py-1 rounded-full font-semibold border border-slate-800">
                      {res.teacher?.university || 'University'}
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-white group-hover:text-amber-300 transition-colors line-clamp-2">
                    {res.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {res.description || 'Comprehensive study resource and reference material.'}
                  </p>

                  <div className="pt-2 border-t border-slate-800 space-y-1 text-xs">
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="text-slate-500">Subject:</span>
                      <span className="font-semibold text-sky-400">{res.subject?.name} ({res.subject?.code})</span>
                    </div>

                    <div className="flex items-center justify-between text-slate-300">
                      <span className="text-slate-500">Contributed by:</span>
                      <Link href={`/teachers/${res.teacher?.id}`} className="font-bold text-white hover:underline">
                        {res.teacher?.fullName}
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2">
                  <button
                    onClick={() => setSelectedResource(res)}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center justify-center space-x-1.5 border border-slate-700"
                  >
                    <Eye className="w-3.5 h-3.5 text-amber-400" />
                    <span>Analyze</span>
                  </button>

                  <a
                    href={res.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-all flex items-center justify-center space-x-1.5 shadow-md shadow-amber-900/30"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </a>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-16 text-center space-y-4">
            <BookOpen className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-slate-300">No Matching Resources Found</h3>
            <p className="text-xs text-slate-500">Try changing your search query or resource format filter.</p>
          </div>
        )}

      </div>

      {/* Resource Analyzer Detail Modal */}
      {selectedResource && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  {selectedResource.resourceType} Resource Analysis
                </span>
                <h3 className="text-lg font-bold text-white mt-1">{selectedResource.title}</h3>
              </div>
              <button onClick={() => setSelectedResource(null)} className="text-slate-400 hover:text-white font-bold">✕</button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="font-bold text-slate-300">Resource Description & Topics:</div>
                <p className="text-slate-400 leading-relaxed">{selectedResource.description || 'Detailed lecture material provided for undergraduate and postgraduate university students.'}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-slate-300">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div className="text-slate-500 text-[10px]">Subject Course</div>
                  <div className="font-bold text-white">{selectedResource.subject?.name}</div>
                  <div className="text-[10px] text-sky-400 font-mono">{selectedResource.subject?.code}</div>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div className="text-slate-500 text-[10px]">University & Author</div>
                  <div className="font-bold text-white">{selectedResource.teacher?.fullName}</div>
                  <div className="text-[10px] text-amber-400">{selectedResource.teacher?.university}</div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end space-x-3">
              <button
                onClick={() => setSelectedResource(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
              >
                Close
              </button>

              <a
                href={selectedResource.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 rounded-xl bg-amber-600 text-white text-xs font-bold hover:bg-amber-500 shadow-lg shadow-amber-900/30 flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Open / Download PDF</span>
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

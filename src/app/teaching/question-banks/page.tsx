'use client';

import React, { useState, useEffect } from 'react';
import { HelpCircle, Download, Eye, Search, Filter, X, Sparkles } from 'lucide-react';

interface ResourceItem {
  id: string;
  title: string;
  description?: string | null;
  fileUrl: string;
  uploadedAt: string;
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

export default function QuestionBanksPage() {
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [subjects, setSubjects] = useState<SubjectItem[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [previewPdfUrl, setPreviewPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/teaching/resources?type=QUESTION_BANK');
        const json = await res.json();
        if (json.success) {
          setResources(json.data.resources);
          setSubjects(json.data.subjects);
        }
      } catch (err) {
        console.error('Error loading question banks:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredResources = resources.filter((item) => {
    const matchesSubject = selectedSubject === 'ALL' || item.subject.code === selectedSubject;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.subject.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-b from-sky-50/70 via-white to-slate-50 py-12 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-wider mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Exam Preparation</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Question Banks & Answer Keys
          </h1>
          <p className="text-slate-600 mt-2 max-w-3xl font-medium">
            Previous year university question sets, model answer keys, unit test papers, and lab manuals.
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
              placeholder="Search question papers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
            />
          </div>

        </div>
      </div>

      {/* Question Bank Cards Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="text-center py-12 text-slate-500 font-medium">Loading question banks...</div>
        ) : filteredResources.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 space-y-2">
            <HelpCircle className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800">No Question Papers Found</h3>
            <p className="text-xs text-slate-500">Try selecting a different subject or search term.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((qb) => (
              <div
                key={qb.id}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-lg bg-sky-100 text-sky-800 font-extrabold text-xs">
                      {qb.subject.code}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400">
                      {new Date(qb.uploadedAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                    {qb.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {qb.description || 'Important questions, semester exam solutions, and lab manual exercises.'}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center space-x-2">
                  <button
                    onClick={() => setPreviewPdfUrl(qb.fileUrl)}
                    className="flex-1 inline-flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl bg-slate-100 text-slate-800 font-bold text-xs hover:bg-sky-50 hover:text-sky-700 transition-all"
                  >
                    <Eye className="w-4 h-4 text-sky-600" />
                    <span>Preview</span>
                  </button>

                  <a
                    href={qb.fileUrl}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl bg-sky-700 text-white font-bold text-xs hover:bg-sky-800 transition-all shadow-sm"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </a>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* PDF Viewer Modal */}
      {previewPdfUrl && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center space-x-2 font-bold text-sm">
                <Sparkles className="w-4 h-4 text-sky-400" />
                <span>Question Bank Viewer</span>
              </div>
              <button
                onClick={() => setPreviewPdfUrl(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <iframe
              src={previewPdfUrl}
              className="w-full flex-grow border-0"
              title="Question Bank Viewer"
            />
          </div>
        </div>
      )}

    </div>
  );
}

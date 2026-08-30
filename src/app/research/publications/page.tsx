'use client';

import React, { useState, useEffect } from 'react';
import { FileBadge, Download, ExternalLink, Search, Filter } from 'lucide-react';

interface PublicationItem {
  id: string;
  title: string;
  authors: string;
  journalOrConference: string;
  year: number;
  doi?: string | null;
  category: string;
  pdfUrl?: string | null;
  publisher?: string | null;
}

export default function PublicationsPage() {
  const [publications, setPublications] = useState<PublicationItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/research');
        const json = await res.json();
        if (json.success) {
          setPublications(json.data.publications);
        }
      } catch (err) {
        console.error('Error loading publications:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredPublications = publications.filter((paper) => {
    const matchesCategory = selectedCategory === 'ALL' || paper.category === selectedCategory;
    const matchesSearch =
      paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      paper.authors.toLowerCase().includes(searchQuery.toLowerCase()) ||
      paper.journalOrConference.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-b from-sky-50/70 via-white to-slate-50 py-12 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-bold uppercase tracking-wider mb-2">
            <FileBadge className="w-3.5 h-3.5" />
            <span>Scholarly Output</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Research Publications
          </h1>
          <p className="text-slate-600 mt-2 max-w-3xl font-medium">
            Peer-reviewed international journals, conference proceedings, and book chapters authored by Prof. Ashwini Sawant.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            <Filter className="w-4 h-4 text-indigo-600 flex-shrink-0" />
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex-shrink-0 ${
                selectedCategory === 'ALL'
                  ? 'bg-indigo-700 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All Publications
            </button>
            <button
              onClick={() => setSelectedCategory('JOURNAL_PUBLICATION')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex-shrink-0 ${
                selectedCategory === 'JOURNAL_PUBLICATION'
                  ? 'bg-indigo-700 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Journals
            </button>
            <button
              onClick={() => setSelectedCategory('CONFERENCE_PAPER')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex-shrink-0 ${
                selectedCategory === 'CONFERENCE_PAPER'
                  ? 'bg-indigo-700 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Conferences
            </button>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search paper by title or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            />
          </div>

        </div>
      </div>

      {/* Publications List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="text-center py-12 text-slate-500 font-medium">Loading research publications...</div>
        ) : filteredPublications.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 space-y-2">
            <FileBadge className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800">No Publications Found</h3>
            <p className="text-xs text-slate-500">Try adjusting your filter or search query.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPublications.map((paper) => (
              <div
                key={paper.id}
                className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              >
                <div className="space-y-2 flex-grow">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-indigo-100 text-indigo-800 font-extrabold text-[11px] uppercase tracking-wider">
                      {paper.category.replace('_', ' ')}
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      {paper.year}
                    </span>
                    {paper.publisher && (
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold border border-slate-200">
                        {paper.publisher}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 leading-snug">
                    {paper.title}
                  </h3>

                  <p className="text-xs font-semibold text-sky-700">
                    Authors: {paper.authors}
                  </p>

                  <p className="text-xs text-slate-500 italic">
                    {paper.journalOrConference}
                  </p>
                </div>

                <div className="flex items-center space-x-3 flex-shrink-0 self-end md:self-center">
                  {paper.doi && (
                    <a
                      href={`https://doi.org/${paper.doi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-100 text-slate-700 hover:text-indigo-700 hover:bg-indigo-50 font-bold text-xs transition-all"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-indigo-600" />
                      <span>DOI</span>
                    </a>
                  )}

                  {paper.pdfUrl && (
                    <a
                      href={paper.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-indigo-700 text-white hover:bg-indigo-800 font-bold text-xs shadow-sm transition-all"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download PDF</span>
                    </a>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

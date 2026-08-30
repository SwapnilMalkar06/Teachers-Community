import React from 'react';
import Link from 'next/link';
import { Award, ExternalLink, Download, ArrowRight, FileBadge } from 'lucide-react';

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

interface ResearchTeaserProps {
  publications: PublicationItem[];
}

export default function ResearchTeaser({ publications }: ResearchTeaserProps) {
  return (
    <section className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-slate-200 gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-bold uppercase tracking-wider mb-2">
              <Award className="w-3.5 h-3.5" />
              <span>Research & Publications</span>
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Featured Research & Papers
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Peer-reviewed articles, conference presentations, and PhD thesis work.
            </p>
          </div>

          <Link
            href="/research/publications"
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-indigo-700 font-bold text-sm shadow-2xs hover:bg-indigo-50 hover:border-indigo-300 transition-all self-start sm:self-auto"
          >
            <span>All Publications</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Publications List */}
        <div className="space-y-4">
          {publications.map((paper) => (
            <div
              key={paper.id}
              className="p-6 bg-slate-50/80 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
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
                    <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 text-[10px] font-bold">
                      {paper.publisher}
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-slate-900 leading-snug">
                  {paper.title}
                </h3>

                <p className="text-xs font-semibold text-sky-700">
                  {paper.authors}
                </p>

                <p className="text-xs text-slate-500 italic">
                  Published in: {paper.journalOrConference}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3 flex-shrink-0 self-end md:self-center">
                {paper.doi && (
                  <a
                    href={`https://doi.org/${paper.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 hover:text-indigo-700 hover:border-indigo-300 font-bold text-xs shadow-2xs transition-all"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-indigo-600" />
                    <span>DOI Link</span>
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

      </div>
    </section>
  );
}

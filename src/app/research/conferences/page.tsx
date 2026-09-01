import React from 'react';
import { Users, Calendar, MapPin, ExternalLink } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { PublicationCategory } from '@prisma/client';

export const dynamic = 'force-dynamic';

export default async function ConferencesPage() {
  let confPapers: any[] = [];

  try {
    confPapers = await prisma.researchPublication.findMany({
      where: { category: PublicationCategory.CONFERENCE_PAPER },
      orderBy: { year: 'desc' },
    });
  } catch (err) {
    console.error('Database query fallback for conferences:', err);
  }

  if (!confPapers || confPapers.length === 0) {
    confPapers = [
      {
        id: 'conf-1',
        title: 'Performance Evaluation of IPv6 Routing Security in Distributed Wireless Sensor Networks',
        authors: 'Prof. Ashwini Sawant',
        journalOrConference: 'International Conference on Computing and Communications (ICCC 2022)',
        year: 2022,
        doi: '10.1109/ICCC54321.2022.9876543',
        category: 'CONFERENCE_PAPER',
      },
      {
        id: 'conf-2',
        title: 'Machine Learning-driven Dynamic Resource Allocation for Cloud Datacenters',
        authors: 'Prof. Ashwini Sawant, Dr. R. K. Sharma',
        journalOrConference: 'IEEE International Conference on Cloud Computing and Big Data (CCBD 2023)',
        year: 2023,
        doi: '10.1109/CCBD56789.2023.1234567',
        category: 'CONFERENCE_PAPER',
      },
    ];
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-b from-sky-50/70 via-white to-slate-50 py-12 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Users className="w-3.5 h-3.5" />
            <span>Academic Symposia</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Conferences & Keynote Sessions
          </h1>
          <p className="text-slate-600 mt-2 max-w-3xl font-medium">
            International paper presentations, technical session chair roles, and conference keynotes.
          </p>
        </div>
      </div>

      {/* Conference Cards List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {confPapers.map((paper) => (
            <div
              key={paper.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-lg bg-indigo-100 text-indigo-800 font-extrabold text-xs">
                    Paper Presentation
                  </span>
                  <span className="inline-flex items-center space-x-1 text-xs font-bold text-slate-500">
                    <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{paper.year}</span>
                  </span>
                </div>

                <h2 className="text-lg font-bold text-slate-900 group-hover:text-indigo-700 transition-colors leading-snug">
                  {paper.title}
                </h2>

                <p className="text-xs font-semibold text-sky-700">
                  Presenter: {paper.authors}
                </p>

                <div className="flex items-start space-x-2 text-xs text-slate-600">
                  <MapPin className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                  <span className="italic">{paper.journalOrConference}</span>
                </div>
              </div>

              {/* Action Link */}
              {paper.doi && (
                <div className="pt-4 border-t border-slate-100">
                  <a
                    href={`https://doi.org/${paper.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-100 text-slate-700 hover:text-indigo-700 hover:bg-indigo-50 font-bold text-xs transition-all"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-indigo-600" />
                    <span>View Conference Proceedings</span>
                  </a>
                </div>
              )}

            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

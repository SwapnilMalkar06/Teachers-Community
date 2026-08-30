'use client';

import React, { useState, useEffect } from 'react';
import { Award, Calendar, MapPin, Download, Filter, Search } from 'lucide-react';

interface FdpItem {
  id: string;
  title: string;
  type: string;
  role: string;
  venue: string;
  startDate: string;
  endDate?: string | null;
  description?: string | null;
  certificateUrl?: string | null;
}

export default function FdpsWorkshopsPage() {
  const [fdps, setFdps] = useState<FdpItem[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/credentials');
        const json = await res.json();
        if (json.success) {
          setFdps(json.data.fdps);
        }
      } catch (err) {
        console.error('Error loading FDPs:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredFdps = fdps.filter((item) => {
    const matchesRole = selectedRole === 'ALL' || item.role === selectedRole;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesRole && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-b from-sky-50/70 via-white to-slate-50 py-12 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Award className="w-3.5 h-3.5" />
            <span>Professional Growth</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
            FDPs, STTPs & Workshops
          </h1>
          <p className="text-slate-600 mt-2 max-w-3xl font-medium">
            National Faculty Development Programs, Short Term Training Programs (STTP), and Workshops organized or attended.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            <Filter className="w-4 h-4 text-sky-600 flex-shrink-0" />
            <button
              onClick={() => setSelectedRole('ALL')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex-shrink-0 ${
                selectedRole === 'ALL'
                  ? 'bg-sky-700 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All Events
            </button>
            <button
              onClick={() => setSelectedRole('ATTENDED')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex-shrink-0 ${
                selectedRole === 'ATTENDED'
                  ? 'bg-sky-700 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Attended
            </button>
            <button
              onClick={() => setSelectedRole('ORGANIZED')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex-shrink-0 ${
                selectedRole === 'ORGANIZED'
                  ? 'bg-sky-700 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Organized
            </button>
            <button
              onClick={() => setSelectedRole('RESOURCE_PERSON')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex-shrink-0 ${
                selectedRole === 'RESOURCE_PERSON'
                  ? 'bg-sky-700 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Resource Person
            </button>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search FDPs or venue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
            />
          </div>

        </div>
      </div>

      {/* FDPs Cards List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="text-center py-12 text-slate-500 font-medium">Loading FDPs & workshops...</div>
        ) : filteredFdps.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 space-y-2">
            <Award className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800">No Events Found</h3>
            <p className="text-xs text-slate-500">Try selecting a different filter.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFdps.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              >
                <div className="space-y-2.5 flex-grow">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-sky-100 text-sky-800 font-extrabold text-[11px] uppercase tracking-wider">
                      {event.type}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900 font-extrabold text-[11px] uppercase tracking-wider">
                      Role: {event.role.replace('_', ' ')}
                    </span>
                    <span className="inline-flex items-center space-x-1 text-xs font-bold text-slate-500">
                      <Calendar className="w-3.5 h-3.5 text-sky-600" />
                      <span>
                        {new Date(event.startDate).toLocaleDateString()}
                        {event.endDate ? ` – ${new Date(event.endDate).toLocaleDateString()}` : ''}
                      </span>
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 leading-snug">
                    {event.title}
                  </h3>

                  <div className="flex items-center space-x-2 text-xs font-semibold text-slate-600">
                    <MapPin className="w-4 h-4 text-sky-600 flex-shrink-0" />
                    <span>Venue: {event.venue}</span>
                  </div>

                  {event.description && (
                    <p className="text-xs text-slate-600 leading-relaxed pt-1">
                      {event.description}
                    </p>
                  )}
                </div>

                {event.certificateUrl && (
                  <div className="flex items-center space-x-3 flex-shrink-0 self-end md:self-center">
                    <a
                      href={event.certificateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-sky-700 text-white font-bold text-xs hover:bg-sky-800 transition-all shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>View Certificate</span>
                    </a>
                  </div>
                )}

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

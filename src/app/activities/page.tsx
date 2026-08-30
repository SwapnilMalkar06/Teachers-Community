'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Users, Calendar, Filter, Search, Award } from 'lucide-react';

interface ActivityItem {
  id: string;
  title: string;
  category: string;
  eventDate: string;
  description?: string | null;
  imageUrl?: string | null;
}

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/activities');
        const json = await res.json();
        if (json.success) {
          setActivities(json.data.activities);
        }
      } catch (err) {
        console.error('Error loading activities:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredActivities = activities.filter((act) => {
    const matchesCategory = selectedCategory === 'ALL' || act.category === selectedCategory;
    const matchesSearch =
      act.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (act.description && act.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-b from-sky-50/70 via-white to-slate-50 py-12 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Users className="w-3.5 h-3.5" />
            <span>Institutional Leadership</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Academic & Extracurricular Activities
          </h1>
          <p className="text-slate-600 mt-2 max-w-3xl font-medium">
            Institutional committees, NAAC/NBA accreditation leadership, guest lectures delivered, and student mentoring.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            <Filter className="w-4 h-4 text-sky-600 flex-shrink-0" />
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex-shrink-0 ${
                selectedCategory === 'ALL'
                  ? 'bg-sky-700 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All Activities
            </button>
            <button
              onClick={() => setSelectedCategory('COMMITTEE')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex-shrink-0 ${
                selectedCategory === 'COMMITTEE'
                  ? 'bg-sky-700 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Committees
            </button>
            <button
              onClick={() => setSelectedCategory('ACADEMIC')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex-shrink-0 ${
                selectedCategory === 'ACADEMIC'
                  ? 'bg-sky-700 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-200'
              }`}
            >
              Academic Talks
            </button>
            <button
              onClick={() => setSelectedCategory('EXTRACURRICULAR')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex-shrink-0 ${
                selectedCategory === 'EXTRACURRICULAR'
                  ? 'bg-sky-700 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Student Events
            </button>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search activities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
            />
          </div>

        </div>
      </div>

      {/* Activities Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="text-center py-12 text-slate-500 font-medium">Loading activities...</div>
        ) : filteredActivities.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 space-y-2">
            <Award className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800">No Activities Found</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredActivities.map((act) => {
              const imgUrl = act.imageUrl || 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800';

              return (
                <div
                  key={act.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className="relative w-full h-48 bg-slate-100">
                      <Image
                        src={imgUrl}
                        alt={act.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-slate-900/90 text-white font-extrabold text-xs shadow-md uppercase tracking-wider">
                        {act.category}
                      </span>
                    </div>

                    <div className="p-6 pt-0 space-y-3">
                      <div className="flex items-center space-x-1 text-xs font-bold text-slate-400">
                        <Calendar className="w-3.5 h-3.5 text-sky-600" />
                        <span>{new Date(act.eventDate).toLocaleDateString()}</span>
                      </div>

                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-sky-700 transition-colors leading-snug">
                        {act.title}
                      </h3>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {act.description}
                      </p>
                    </div>
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

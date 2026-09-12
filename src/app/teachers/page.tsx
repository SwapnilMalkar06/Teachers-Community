'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Building, BookOpen, GraduationCap, Sparkles, Filter, ChevronRight, Mail, RefreshCw } from 'lucide-react';

interface TeacherItem {
  id: string;
  fullName: string;
  designation: string;
  department: string;
  university: string;
  expertise: string;
  profileImageUrl: string;
  contactEmail: string;
  bioText: string;
  _count: {
    subjects: number;
    resources: number;
    publications: number;
  };
}

export default function TeachersDirectoryPage() {
  const [teachers, setTeachers] = useState<TeacherItem[]>([]);
  const [universities, setUniversities] = useState<string[]>([]);
  const [expertises, setExpertises] = useState<string[]>([]);

  // Filter states
  const [selectedUniversity, setSelectedUniversity] = useState('ALL');
  const [selectedExpertise, setSelectedExpertise] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeachers();
  }, [selectedUniversity, selectedExpertise]);

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      let url = `/api/teachers?query=${encodeURIComponent(searchQuery)}`;
      if (selectedUniversity !== 'ALL') url += `&university=${encodeURIComponent(selectedUniversity)}`;
      if (selectedExpertise !== 'ALL') url += `&expertise=${encodeURIComponent(selectedExpertise)}`;

      const res = await fetch(url);
      const data = await res.json();

      if (data.success) {
        setTeachers(data.teachers);
        if (data.filters) {
          setUniversities(data.filters.universities || []);
          setExpertises(data.filters.expertises || []);
        }
      }
    } catch (err) {
      console.error('Error loading teachers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTeachers();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Banner */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold">
            <Building className="w-4 h-4" />
            <span>Multi-University Teacher Directory</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Find Teachers by <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400">University & Expertise</span>
          </h1>

          <p className="text-sm text-slate-400 leading-relaxed">
            Connect with professors across top universities, explore their domain expertise, and access their uploaded notes, PPTs, and question banks.
          </p>
        </div>

        {/* Filter Controls Box */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
          
          <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search teacher name, subject, or university..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-medium text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition-all shadow-lg shadow-sky-900/30 flex items-center justify-center space-x-2"
            >
              <Search className="w-4 h-4" />
              <span>Search Teachers</span>
            </button>
          </form>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800/80">
            {/* Filter by University */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1">
                <Building className="w-3.5 h-3.5 text-sky-400" />
                <span>Filter by University</span>
              </label>
              <select
                value={selectedUniversity}
                onChange={(e) => setSelectedUniversity(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-medium text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="ALL">All Universities</option>
                {universities.map((uni, idx) => (
                  <option key={idx} value={uni}>{uni}</option>
                ))}
              </select>
            </div>

            {/* Filter by Expertise */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Filter by Domain / Expertise</span>
              </label>
              <select
                value={selectedExpertise}
                onChange={(e) => setSelectedExpertise(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-medium text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="ALL">All Expertise Domains</option>
                {expertises.map((exp, idx) => (
                  <option key={idx} value={exp}>{exp}</option>
                ))}
              </select>
            </div>
          </div>

        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between px-2 text-xs text-slate-400">
          <span>Showing <strong className="text-white">{teachers.length}</strong> university teachers</span>
          {(selectedUniversity !== 'ALL' || selectedExpertise !== 'ALL' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedUniversity('ALL');
                setSelectedExpertise('ALL');
                setSearchQuery('');
              }}
              className="text-sky-400 hover:underline font-semibold"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Teachers Grid */}
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <RefreshCw className="w-8 h-8 animate-spin text-sky-400 mx-auto" />
            <p className="text-xs text-slate-400">Searching teacher profiles...</p>
          </div>
        ) : teachers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teachers.map((teacher) => (
              <div
                key={teacher.id}
                className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between hover:border-sky-500/50 transition-all group shadow-xl"
              >
                <div className="space-y-4">
                  
                  {/* Top Avatar & University Badge */}
                  <div className="flex items-start justify-between">
                    <div className="w-16 h-16 rounded-2xl bg-slate-800 overflow-hidden border-2 border-slate-700 group-hover:border-sky-500 transition-colors">
                      <img
                        src={teacher.profileImageUrl || '/images/profile.jpg'}
                        alt={teacher.fullName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>

                    <span className="px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 text-[11px] font-bold">
                      {teacher.university}
                    </span>
                  </div>

                  {/* Teacher Info */}
                  <div>
                    <h3 className="text-lg font-extrabold text-white group-hover:text-sky-300 transition-colors">
                      {teacher.fullName}
                    </h3>
                    <p className="text-xs font-semibold text-slate-400">{teacher.designation}</p>
                    <p className="text-[11px] text-slate-500">{teacher.department}</p>
                  </div>

                  {/* Expertise Chips */}
                  <div className="space-y-1.5">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Expertise</div>
                    <div className="flex flex-wrap gap-1.5">
                      {teacher.expertise.split(',').map((exp, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 border border-slate-700/60 text-[11px] font-medium"
                        >
                          {exp.trim()}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Stats snippet */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-[11px]">
                    <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                      <div className="text-slate-400">Resources</div>
                      <div className="text-sm font-extrabold text-white">{teacher._count.resources} Files</div>
                    </div>

                    <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                      <div className="text-slate-400">Subjects</div>
                      <div className="text-sm font-extrabold text-white">{teacher._count.subjects} Courses</div>
                    </div>
                  </div>

                </div>

                {/* Footer Button */}
                <div className="pt-6">
                  <Link
                    href={`/teachers/${teacher.id}`}
                    className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-sky-600 text-slate-200 hover:text-white font-bold text-xs transition-all flex items-center justify-center space-x-2 border border-slate-700 hover:border-sky-500"
                  >
                    <span>View Profile & Resources</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-16 text-center space-y-4">
            <Building className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-slate-300">No Teachers Found Matching Criteria</h3>
            <p className="text-xs text-slate-500">Try adjusting your university or expertise filter selection.</p>
          </div>
        )}

      </div>
    </div>
  );
}

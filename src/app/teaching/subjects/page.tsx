import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { BookOpen, FileText, Presentation, Video, HelpCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function SubjectsPage() {
  let subjects: any[] = [];

  try {
    subjects = await prisma.subject.findMany({
      include: {
        _count: {
          select: {
            resources: true,
            videos: true,
          },
        },
      },
      orderBy: { code: 'asc' },
    });
  } catch (err) {
    console.error('Database query fallback for subjects:', err);
  }

  if (!subjects || subjects.length === 0) {
    subjects = [
      {
        id: 'subj-1',
        code: 'CSC501',
        name: 'Computer Networks',
        department: 'Computer Engineering',
        semester: 'Semester 5',
        description: 'OSI & TCP/IP models, routing algorithms, socket programming, transport layer protocols, and wireless network security.',
        _count: { resources: 8, videos: 5 },
      },
      {
        id: 'subj-2',
        code: 'CSC302',
        name: 'Data Structures & Algorithms',
        department: 'Computer Engineering',
        semester: 'Semester 3',
        description: 'Linear & non-linear data structures, trees, graphs, sorting, searching, time complexity, and dynamic programming.',
        _count: { resources: 12, videos: 8 },
      },
      {
        id: 'subj-3',
        code: 'CSC701',
        name: 'Distributed Computing',
        department: 'Computer Engineering',
        semester: 'Semester 7',
        description: 'RPC, RMI, distributed consensus, clock synchronization, MapReduce, and cloud virtualization frameworks.',
        _count: { resources: 6, videos: 4 },
      },
      {
        id: 'subj-4',
        code: 'CSC404',
        name: 'Operating Systems',
        department: 'Computer Engineering',
        semester: 'Semester 4',
        description: 'Process scheduling, deadlocks, memory management, virtual memory, paging, and Linux kernel internals.',
        _count: { resources: 9, videos: 6 },
      },
    ];
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      
      {/* Page Header Banner */}
      <div className="bg-gradient-to-b from-sky-50/70 via-white to-slate-50 py-12 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-wider mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Course Catalog</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Subjects Handled
          </h1>
          <p className="text-slate-600 mt-2 max-w-3xl font-medium">
            Explore subjects taught by Prof. Ashwini Sawant, featuring unit-wise lecture notes, PPT slides, video lectures, and question banks.
          </p>
        </div>
      </div>

      {/* Subjects Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {subjects.map((subject) => (
            <div
              key={subject.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-6 group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1.5 rounded-xl bg-sky-100 text-sky-800 font-extrabold text-xs tracking-wide">
                    {subject.code}
                  </span>
                  <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-lg">
                    {subject.semester}
                  </span>
                </div>

                <h2 className="text-2xl font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                  {subject.name}
                </h2>

                <p className="text-xs font-semibold text-sky-700">
                  {subject.department}
                </p>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {subject.description || 'Comprehensive computer engineering course covering theoretical foundation, practical lab assignments, and industry case studies.'}
                </p>
              </div>

              {/* Resource Counter Badges & Action Links */}
              <div className="pt-6 border-t border-slate-100 space-y-4">
                <div className="flex items-center space-x-4 text-xs font-bold text-slate-500">
                  <div className="flex items-center space-x-1">
                    <FileText className="w-4 h-4 text-sky-600" />
                    <span>{subject._count?.resources || 0} PDF Resources</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Video className="w-4 h-4 text-sky-600" />
                    <span>{subject._count?.videos || 0} Video Lectures</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <Link
                    href={`/teaching/notes?subjectId=${subject.id}`}
                    className="inline-flex items-center justify-center space-x-1 py-2 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 hover:bg-sky-50 hover:text-sky-700 hover:border-sky-300 transition-all"
                  >
                    <FileText className="w-3.5 h-3.5 text-sky-600" />
                    <span>Notes</span>
                  </Link>

                  <Link
                    href={`/teaching/ppts?subjectId=${subject.id}`}
                    className="inline-flex items-center justify-center space-x-1 py-2 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 hover:bg-sky-50 hover:text-sky-700 hover:border-sky-300 transition-all"
                  >
                    <Presentation className="w-3.5 h-3.5 text-sky-600" />
                    <span>PPTs</span>
                  </Link>

                  <Link
                    href={`/teaching/videos?subjectId=${subject.id}`}
                    className="inline-flex items-center justify-center space-x-1 py-2 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 hover:bg-sky-50 hover:text-sky-700 hover:border-sky-300 transition-all"
                  >
                    <Video className="w-3.5 h-3.5 text-sky-600" />
                    <span>Videos</span>
                  </Link>

                  <Link
                    href={`/teaching/question-banks?subjectId=${subject.id}`}
                    className="inline-flex items-center justify-center space-x-1 py-2 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 hover:bg-sky-50 hover:text-sky-700 hover:border-sky-300 transition-all"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-sky-600" />
                    <span>Q-Banks</span>
                  </Link>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

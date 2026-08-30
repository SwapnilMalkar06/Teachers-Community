import React from 'react';
import Link from 'next/link';
import { BookOpen, FileText, Presentation, Video, ArrowRight, HelpCircle } from 'lucide-react';

interface SubjectItem {
  id: string;
  code: string;
  name: string;
  department: string;
  semester: string;
  description?: string | null;
  _count?: {
    resources: number;
    videos: number;
  };
}

interface TeachingTeaserProps {
  subjects: SubjectItem[];
}

export default function TeachingTeaser({ subjects }: TeachingTeaserProps) {
  return (
    <section className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-slate-200 gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-wider mb-2">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Teaching Portal</span>
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Subjects & Academic Resources
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Access unit-wise PDF lecture notes, presentation slides, video lectures, and question banks.
            </p>
          </div>

          <Link
            href="/teaching/subjects"
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-sky-700 font-bold text-sm shadow-2xs hover:bg-sky-50 hover:border-sky-300 transition-all self-start sm:self-auto"
          >
            <span>View All Subjects</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject) => (
            <div
              key={subject.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-lg bg-sky-100 text-sky-800 font-extrabold text-xs">
                    {subject.code}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    {subject.semester}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                  {subject.name}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {subject.description || 'Core computer engineering curriculum subject covering fundamental principles and practical implementations.'}
                </p>
              </div>

              <div className="pt-6 mt-4 border-t border-slate-100 space-y-3">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Quick Resource Links:
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href={`/teaching/notes?subject=${subject.id}`}
                    className="inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-sky-50 hover:text-sky-700 hover:border-sky-300 transition-all"
                  >
                    <FileText className="w-3.5 h-3.5 text-sky-600" />
                    <span>Notes</span>
                  </Link>

                  <Link
                    href={`/teaching/ppts?subject=${subject.id}`}
                    className="inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-sky-50 hover:text-sky-700 hover:border-sky-300 transition-all"
                  >
                    <Presentation className="w-3.5 h-3.5 text-sky-600" />
                    <span>PPTs</span>
                  </Link>

                  <Link
                    href={`/teaching/videos?subject=${subject.id}`}
                    className="inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-sky-50 hover:text-sky-700 hover:border-sky-300 transition-all"
                  >
                    <Video className="w-3.5 h-3.5 text-sky-600" />
                    <span>Videos</span>
                  </Link>

                  <Link
                    href={`/teaching/question-banks?subject=${subject.id}`}
                    className="inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-sky-50 hover:text-sky-700 hover:border-sky-300 transition-all"
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
    </section>
  );
}

import React from 'react';
import { GraduationCap, Calendar, Building } from 'lucide-react';

interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  year: string;
  description: string;
}

interface EducationProps {
  educationList: EducationItem[];
}

export default function EducationTimeline({ educationList }: EducationProps) {
  return (
    <section className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-12 text-left">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-wider mb-2">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Academic Qualifications</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Education & Academic Degrees
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Degrees earned from recognized universities and technical institutes.
          </p>
        </div>

        {/* Vertical Timeline */}
        <div className="relative pl-6 sm:pl-8 border-l-2 border-sky-200 space-y-10">
          {educationList.map((edu, index) => (
            <div key={edu.id || index} className="relative group">
              
              {/* Timeline Node Badge */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-8 h-8 rounded-full bg-white border-4 border-sky-600 group-hover:bg-sky-600 transition-colors flex items-center justify-center shadow-xs">
                <div className="w-2 h-2 rounded-full bg-sky-600 group-hover:bg-white transition-colors" />
              </div>

              {/* Education Card */}
              <div className="bg-slate-50/80 rounded-2xl p-6 border border-slate-200 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                    {edu.degree}
                  </h3>
                  <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-sky-100 text-sky-800 font-extrabold text-xs">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{edu.year}</span>
                  </span>
                </div>

                <div className="flex items-center space-x-2 text-sm font-semibold text-slate-700">
                  <Building className="w-4 h-4 text-sky-600 flex-shrink-0" />
                  <span>{edu.institution}</span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed pt-1">
                  {edu.description}
                </p>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

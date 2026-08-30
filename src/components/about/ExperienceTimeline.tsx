import React from 'react';
import { Briefcase, Calendar, Building2, CheckCircle } from 'lucide-react';

interface ExperienceItem {
  id: string;
  role: string;
  organization: string;
  period: string;
  description: string;
}

interface ExperienceProps {
  experienceList: ExperienceItem[];
}

export default function ExperienceTimeline({ experienceList }: ExperienceProps) {
  return (
    <section className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-12 text-left">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Career History</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Academic & Work Experience
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Over 12+ years of dedicated teaching, research guidance, and institutional leadership.
          </p>
        </div>

        {/* Vertical Timeline */}
        <div className="relative pl-6 sm:pl-8 border-l-2 border-indigo-200 space-y-10">
          {experienceList.map((exp, index) => (
            <div key={exp.id || index} className="relative group">
              
              {/* Timeline Node Badge */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-8 h-8 rounded-full bg-white border-4 border-indigo-600 group-hover:bg-indigo-600 transition-colors flex items-center justify-center shadow-xs">
                <div className="w-2 h-2 rounded-full bg-indigo-600 group-hover:bg-white transition-colors" />
              </div>

              {/* Experience Card */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs hover:shadow-md transition-all space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">
                    {exp.role}
                  </h3>
                  <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-indigo-100 text-indigo-800 font-extrabold text-xs">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{exp.period}</span>
                  </span>
                </div>

                <div className="flex items-center space-x-2 text-sm font-semibold text-slate-700">
                  <Building2 className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                  <span>{exp.organization}</span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed pt-1">
                  {exp.description}
                </p>

                <div className="pt-3 border-t border-slate-100 flex items-center space-x-2 text-xs font-semibold text-slate-500">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Supervised 50+ UG Capstone Projects & Student Mentorship</span>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

import React from 'react';
import { Layers, Sparkles, Code2, ShieldCheck } from 'lucide-react';

interface CategoryItem {
  title: string;
  skills: string[];
}

interface ExpertiseProps {
  categories: CategoryItem[];
}

export default function ExpertiseGrid({ categories }: ExpertiseProps) {
  const categoryIcons = [Layers, Sparkles, Code2, ShieldCheck];
  const categoryColors = [
    'text-sky-700 bg-sky-100 border-sky-200',
    'text-indigo-700 bg-indigo-100 border-indigo-200',
    'text-emerald-700 bg-emerald-100 border-emerald-200',
    'text-amber-700 bg-amber-100 border-amber-200',
  ];

  return (
    <section className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-12 text-left">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Core Domain & Skills</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Subject Expertise & Skills
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Technical competencies, core curriculum areas, research domains, and academic responsibilities.
          </p>
        </div>

        {/* 4 Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((cat, idx) => {
            const Icon = categoryIcons[idx % categoryIcons.length];
            const colorClass = categoryColors[idx % categoryColors.length];

            return (
              <div
                key={idx}
                className="p-6 bg-slate-50/80 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-all space-y-4"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center font-bold ${colorClass}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {cat.title}
                  </h3>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {cat.skills.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 shadow-2xs hover:bg-sky-50 hover:text-sky-700 hover:border-sky-300 transition-all"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

import React from 'react';
import { Briefcase, BookMarked, Layers, Users } from 'lucide-react';

interface StatsProps {
  stats: {
    yearsExperience: number;
    publicationsCount: number;
    subjectsCount: number;
    studentsMentored: number;
  };
}

export default function StatsCounter({ stats }: StatsProps) {
  const statItems = [
    {
      label: 'Teaching Experience',
      value: `${stats.yearsExperience}+ Yrs`,
      description: 'Computer Engineering',
      icon: Briefcase,
      color: 'text-sky-600 bg-sky-50 border-sky-200',
    },
    {
      label: 'Research Papers',
      value: `${stats.publicationsCount > 0 ? stats.publicationsCount : 25}+`,
      description: 'Journals & Conferences',
      icon: BookMarked,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
    },
    {
      label: 'Subjects Handled',
      value: `${stats.subjectsCount > 0 ? stats.subjectsCount : 5}+`,
      description: 'UG & PG Courses',
      icon: Layers,
      color: 'text-amber-600 bg-amber-50 border-amber-200',
    },
    {
      label: 'Students Mentored',
      value: `${stats.studentsMentored}+`,
      description: 'Projects & Guidance',
      icon: Users,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    },
  ];

  return (
    <section className="py-12 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {statItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="p-6 rounded-2xl bg-slate-50/80 border border-slate-200/80 shadow-xs hover:shadow-md transition-all hover:border-slate-300 group"
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-xl border flex items-center justify-center font-bold shadow-xs ${item.color} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                      {item.value}
                    </div>
                    <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      {item.label}
                    </div>
                    <div className="text-[11px] font-medium text-slate-500 mt-0.5">
                      {item.description}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

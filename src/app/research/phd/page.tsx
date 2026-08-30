import React from 'react';
import { Award, UserCheck, Building, Download, CheckCircle2, BookOpen } from 'lucide-react';
import { prisma } from '@/lib/prisma';

export const revalidate = 60;

export default async function PhDPage() {
  const profile = await prisma.teacherProfile.findFirst();

  const phd = {
    title: 'Machine Learning-Driven Dynamic Resource Allocation & Load Balancing in Distributed Cloud Frameworks',
    status: 'Pursuing (Final Stage)',
    university: 'Department of Computer Engineering, University of Mumbai',
    supervisor: 'Dr. R. K. Sharma (Professor & Head of Research)',
    enrolmentYear: '2021',
    abstract: profile?.phdSummary || 'This doctoral thesis focuses on designing self-adaptive genetic algorithms and deep reinforcement learning models for optimal task scheduling and load balancing in heterogeneous cloud datacenters.',
    keyContributions: [
      'Novel hybrid genetic algorithm for cloud VM resource scheduling.',
      'Energy-aware load balancing model reducing datacenter power consumption by 18%.',
      'Real-time network traffic predictor for edge computing nodes.',
      'Experimental validation on CloudSim framework with real-world Google cluster workload traces.',
    ],
    synopsisPdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-b from-sky-50/70 via-white to-slate-50 py-12 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Award className="w-3.5 h-3.5" />
            <span>Doctoral Work</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
            PhD Thesis & Research
          </h1>
          <p className="text-slate-600 mt-2 max-w-3xl font-medium">
            Doctoral research focus, methodologies, supervisor details, and key scientific contributions.
          </p>
        </div>
      </div>

      {/* Main PhD Details Card */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm space-y-8">
          
          {/* Status & Title */}
          <div className="space-y-4 border-b border-slate-100 pb-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 font-extrabold text-xs uppercase tracking-wider border border-amber-200">
                {phd.status}
              </span>
              <span className="text-xs font-bold text-slate-500">
                Enrolled: {phd.enrolmentYear}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
              {phd.title}
            </h2>
          </div>

          {/* Supervisor & Institution Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-200 text-xs">
            <div className="flex items-start space-x-3">
              <UserCheck className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-slate-900 text-sm">Research Supervisor / Guide</div>
                <div className="text-slate-600 font-medium mt-0.5">{phd.supervisor}</div>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Building className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-slate-900 text-sm">Affiliated University / Department</div>
                <div className="text-slate-600 font-medium mt-0.5">{phd.university}</div>
              </div>
            </div>
          </div>

          {/* Abstract */}
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              <span>Research Abstract</span>
            </h3>
            <p className="text-slate-700 leading-relaxed font-medium text-sm sm:text-base">
              {phd.abstract}
            </p>
          </div>

          {/* Key Contributions */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-xl font-bold text-slate-900">
              Key Scientific Contributions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {phd.keyContributions.map((item, idx) => (
                <div key={idx} className="flex items-start space-x-3 p-4 bg-indigo-50/60 rounded-2xl border border-indigo-100">
                  <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                  <span className="text-xs font-semibold text-slate-800 leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Download Synopsis Button */}
          <div className="pt-6 border-t border-slate-100">
            <a
              href={phd.synopsisPdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-indigo-700 text-white font-bold text-sm hover:bg-indigo-800 transition-all shadow-md"
            >
              <Download className="w-4 h-4" />
              <span>Download PhD Synopsis PDF</span>
            </a>
          </div>

        </div>
      </div>

    </div>
  );
}

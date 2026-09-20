'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Building, BookOpen, GraduationCap, FileText, Presentation, FileQuestion, Mail, Phone, ExternalLink, ArrowLeft, RefreshCw, FileBadge } from 'lucide-react';

interface TeacherDetail {
  id: string;
  fullName: string;
  designation: string;
  department: string;
  university: string;
  expertise: string;
  profileImageUrl: string;
  bioText: string;
  heroTitle: string;
  heroSubtitle: string;
  contactEmail: string;
  contactPhone: string;
  officeAddress: string;
  googleScholarUrl?: string;
  linkedInUrl?: string;
  subjects: Array<{
    id: string;
    code: string;
    name: string;
    semester: string;
    description: string;
  }>;
  resources: Array<{
    id: string;
    title: string;
    description: string;
    resourceType: 'NOTES' | 'PPT' | 'QUESTION_BANK';
    fileUrl: string;
    uploadedAt: string;
    subject: { name: string; code: string };
  }>;
  publications: Array<{
    id: string;
    title: string;
    authors: string;
    journalOrConference: string;
    year: number;
    category?: string;
    pdfUrl?: string;
    publisher?: string;
  }>;
  education?: Array<{
    id: string;
    degree: string;
    institution: string;
    year: string;
    description?: string | null;
  }>;
  experience?: Array<{
    id: string;
    role: string;
    organization: string;
    period: string;
    description?: string | null;
  }>;
}

export default function TeacherProfileViewPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [teacher, setTeacher] = useState<TeacherDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'RESOURCES' | 'PUBLICATIONS' | 'ABOUT'>('RESOURCES');

  useEffect(() => {
    if (id) fetchTeacherDetail();
  }, [id]);

  const fetchTeacherDetail = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/teachers`);
      const data = await res.json();
      if (data.success) {
        const found = data.teachers.find((t: any) => t.id === id);
        if (found) {
          // Fetch complete detail
          const resDetail = await fetch(`/api/resources?teacherId=${id}`);
          const resJson = await resDetail.json();
          setTeacher({
            ...found,
            resources: resJson.resources || [],
          });
        }
      }
    } catch (err) {
      console.error('Error loading teacher profile:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center space-x-3">
        <RefreshCw className="w-6 h-6 animate-spin text-sky-400" />
        <span className="font-semibold text-sm">Loading Teacher Profile...</span>
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl text-center space-y-4 max-w-md">
          <Building className="w-12 h-12 text-slate-600 mx-auto" />
          <h2 className="text-xl font-bold">Teacher Profile Not Found</h2>
          <Link href="/teachers" className="inline-block px-6 py-2.5 rounded-xl bg-sky-600 text-white font-bold text-xs">
            Back to Teachers Directory
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Back Link */}
        <Link href="/teachers" className="inline-flex items-center space-x-2 text-xs font-semibold text-sky-400 hover:underline">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Teachers Directory</span>
        </Link>

        {/* Hero Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl bg-slate-800 border-2 border-sky-500 overflow-hidden shrink-0 shadow-lg">
              <img
                src={teacher.profileImageUrl || '/images/profile.jpg'}
                alt={teacher.fullName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>

            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 text-xs font-bold">
                  {teacher.university}
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-medium">
                  {teacher.department}
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-white">{teacher.fullName}</h1>
              <p className="text-sm font-bold text-sky-400">{teacher.designation}</p>

              {/* Expertise chips */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {teacher.expertise.split(',').map((exp, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-800/80 text-slate-300 border border-slate-700/60 text-[11px] font-semibold">
                    {exp.trim()}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2 shrink-0 w-full sm:w-auto">
              <a
                href={`mailto:${teacher.contactEmail}`}
                className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs transition-all flex items-center justify-center space-x-2 shadow-lg shadow-sky-900/30"
              >
                <Mail className="w-4 h-4" />
                <span>Contact Teacher</span>
              </a>
            </div>

          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-2 border-b border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab('RESOURCES')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
              activeTab === 'RESOURCES'
                ? 'bg-sky-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Notes, PPTs & Question Banks ({teacher.resources?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('PUBLICATIONS')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
              activeTab === 'PUBLICATIONS'
                ? 'bg-sky-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FileBadge className="w-4 h-4" />
            <span>Research Publications ({teacher.publications?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('ABOUT')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
              activeTab === 'ABOUT'
                ? 'bg-sky-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Biography & Info</span>
          </button>
        </div>

        {/* Resources Tab */}
        {activeTab === 'RESOURCES' && (
          <div className="space-y-6">
            {teacher.resources && teacher.resources.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {teacher.resources.map((res) => (
                  <div key={res.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 hover:border-sky-500/40 transition-all flex flex-col justify-between shadow-lg">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                          res.resourceType === 'NOTES' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                          res.resourceType === 'PPT' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                          'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                        }`}>
                          {res.resourceType === 'NOTES' ? 'Notes' : res.resourceType === 'PPT' ? 'PPT Presentation' : 'Question Bank'}
                        </span>
                        <span className="text-[11px] text-slate-500 font-mono">
                          {new Date(res.uploadedAt).toLocaleDateString()}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-white line-clamp-2">{res.title}</h3>
                      <p className="text-xs text-slate-400 line-clamp-2">{res.description}</p>
                      
                      <div className="text-[11px] text-sky-400 font-semibold">
                        Subject: {res.subject?.name} ({res.subject?.code})
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-800">
                      <a
                        href={res.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-sky-600 text-slate-200 hover:text-white font-bold text-xs transition-all flex items-center justify-center space-x-2"
                      >
                        <FileText className="w-4 h-4" />
                        <span>Download Resource</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-400">
                No teaching resources published by this teacher yet.
              </div>
            )}
          </div>
        )}

        {/* Publications Tab */}
        {activeTab === 'PUBLICATIONS' && (
          <div className="space-y-6">
            {teacher.publications && teacher.publications.length > 0 ? (
              <div className="space-y-4">
                {teacher.publications.map((pub) => (
                  <div key={pub.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 hover:border-sky-500/40 transition-all shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                          pub.category === 'JOURNAL_PUBLICATION' ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20' :
                          pub.category === 'CONFERENCE_PAPER' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                          'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}>
                          {pub.category === 'JOURNAL_PUBLICATION' ? 'Journal' : pub.category === 'CONFERENCE_PAPER' ? 'Conference' : 'PhD Thesis'}
                        </span>
                        <span className="text-[11px] font-bold text-slate-400">{pub.year}</span>
                      </div>

                      <h3 className="text-base font-extrabold text-white">{pub.title}</h3>
                      <p className="text-xs text-sky-300 font-medium">Authors: {pub.authors}</p>
                      <p className="text-xs text-slate-400">{pub.journalOrConference}</p>
                    </div>

                    {pub.pdfUrl && (
                      <div className="shrink-0">
                        <a
                          href={pub.pdfUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-sky-600 text-slate-200 hover:text-white font-bold text-xs transition-all flex items-center space-x-2 border border-slate-700"
                        >
                          <FileText className="w-4 h-4" />
                          <span>View PDF</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-400">
                No research publications listed for this teacher yet.
              </div>
            )}
          </div>
        )}

        {/* About Tab */}
        {activeTab === 'ABOUT' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl max-w-3xl">
            <div>
              <h2 className="text-lg font-bold text-white mb-2">About {teacher.fullName}</h2>
              <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">{teacher.bioText || 'No biography text available.'}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800 text-xs">
              <div>
                <span className="text-slate-400">University:</span>
                <div className="font-bold text-white">{teacher.university}</div>
              </div>
              <div>
                <span className="text-slate-400">Department:</span>
                <div className="font-bold text-white">{teacher.department}</div>
              </div>
              <div>
                <span className="text-slate-400">Email:</span>
                <div className="font-bold text-sky-400">{teacher.contactEmail}</div>
              </div>
              <div>
                <span className="text-slate-400">Office:</span>
                <div className="font-bold text-white">{teacher.officeAddress || 'Main Department Block'}</div>
              </div>
            </div>

            {/* Education Timeline */}
            {teacher.education && teacher.education.length > 0 && (
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <GraduationCap className="w-4 h-4 text-sky-400" />
                  <span>Education Qualifications</span>
                </h3>
                <div className="space-y-3">
                  {teacher.education.map((edu) => (
                    <div key={edu.id} className="bg-slate-950 border border-slate-800/80 rounded-2xl p-4 space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">{edu.degree}</span>
                        <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 text-[10px] font-bold">{edu.year}</span>
                      </div>
                      <div className="text-slate-400 font-medium">{edu.institution}</div>
                      {edu.description && <div className="text-slate-500 text-[11px] pt-1">{edu.description}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Work Experience Timeline */}
            {teacher.experience && teacher.experience.length > 0 && (
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <Building className="w-4 h-4 text-amber-400" />
                  <span>Work & Career Experience</span>
                </h3>
                <div className="space-y-3">
                  {teacher.experience.map((exp) => (
                    <div key={exp.id} className="bg-slate-950 border border-slate-800/80 rounded-2xl p-4 space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">{exp.role}</span>
                        <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[10px] font-bold">{exp.period}</span>
                      </div>
                      <div className="text-slate-400 font-medium">{exp.organization}</div>
                      {exp.description && <div className="text-slate-500 text-[11px] pt-1">{exp.description}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

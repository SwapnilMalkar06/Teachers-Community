import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  BookOpen, 
  FileText, 
  Mail, 
  ExternalLink, 
  CheckCircle2,
  Building2,
  Award
} from 'lucide-react';

interface HeroProps {
  profile: {
    fullName: string;
    designation: string;
    department: string;
    institution: string;
    heroTitle: string;
    heroSubtitle: string;
    profileImageUrl: string;
    bioText: string;
    contactEmail: string;
    googleScholarUrl?: string | null;
    linkedInUrl?: string | null;
    researchGateUrl?: string | null;
    orcidUrl?: string | null;
  };
}

export default function HeroSection({ profile }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-sky-50/70 via-slate-50 to-white py-16 sm:py-20 border-b border-slate-200/80">
      
      {/* Background Decorative Rings */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-sky-200/30 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-indigo-200/30 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Text & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-sky-100/90 text-sky-800 border border-sky-200 text-xs font-bold shadow-sm">
              <Building2 className="w-3.5 h-3.5 text-sky-700" />
              <span>{profile.department}</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
                {profile.fullName}
              </h1>
              <p className="text-lg sm:text-xl font-bold text-sky-700 tracking-wide flex items-center space-x-2">
                <Award className="w-5 h-5 text-sky-600 inline-block" />
                <span>{profile.designation} & Research Guide</span>
              </p>
            </div>

            <p className="text-lg sm:text-xl text-slate-700 font-medium leading-relaxed">
              {profile.heroSubtitle}
            </p>

            <p className="text-sm text-slate-600 leading-relaxed bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-slate-200/80 shadow-sm">
              {profile.bioText}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/teaching/notes"
                className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-sky-700 text-white font-bold shadow-md hover:bg-sky-800 transition-all hover:shadow-sky-700/25 active:scale-95 text-sm"
              >
                <BookOpen className="w-4 h-4" />
                <span>Browse Lecture Notes</span>
              </Link>

              <Link
                href="/research/publications"
                className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-white text-slate-800 border border-slate-300 font-bold shadow-sm hover:bg-slate-50 transition-all hover:border-slate-400 text-sm"
              >
                <FileText className="w-4 h-4 text-sky-700" />
                <span>Research Publications</span>
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center space-x-2 px-4 py-3 rounded-xl bg-slate-900 text-white font-bold shadow-sm hover:bg-slate-800 transition-all text-sm"
              >
                <Mail className="w-4 h-4 text-sky-400" />
                <span>Contact Office</span>
              </Link>
            </div>

            {/* Academic Social Profiles Badges */}
            <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-600">
              <span className="text-slate-500 uppercase tracking-wider font-bold text-[11px]">Profiles:</span>
              
              {profile.googleScholarUrl && (
                <a
                  href={profile.googleScholarUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-sky-700 hover:border-sky-300 transition-all shadow-2xs"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-sky-600" />
                  <span>Google Scholar</span>
                </a>
              )}

              {profile.linkedInUrl && (
                <a
                  href={profile.linkedInUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-sky-700 hover:border-sky-300 transition-all shadow-2xs"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-sky-600" />
                  <span>LinkedIn</span>
                </a>
              )}

              {profile.researchGateUrl && (
                <a
                  href={profile.researchGateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-sky-700 hover:border-sky-300 transition-all shadow-2xs"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-sky-600" />
                  <span>ResearchGate</span>
                </a>
              )}

              {profile.orcidUrl && (
                <a
                  href={profile.orcidUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-sky-700 hover:border-sky-300 transition-all shadow-2xs"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-sky-600" />
                  <span>ORCID iD</span>
                </a>
              )}
            </div>

          </div>

          {/* Right Column: Profile Image & Floating Card */}
          <div className="lg:col-span-5 flex justify-center relative">
            <div className="relative w-72 h-72 sm:w-80 sm:h-80 lg:w-96 lg:h-96">
              
              {/* Outer Glow Ring */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-sky-600 to-indigo-600 rotate-3 scale-105 opacity-80 shadow-2xl" />
              
              {/* Image Frame */}
              <div className="relative w-full h-full rounded-3xl overflow-hidden border-4 border-white shadow-xl bg-slate-200">
                <Image
                  src={profile.profileImageUrl}
                  alt={profile.fullName}
                  fill
                  className="object-cover object-top hover:scale-105 transition-transform duration-500"
                  priority
                  sizes="(max-width: 768px) 280px, 384px"
                />
              </div>

              {/* Floating Pill: Available for Guidance */}
              <div className="absolute -bottom-4 -left-4 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-slate-200 shadow-xl flex items-center space-x-2 z-20">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                <div>
                  <div className="text-xs font-bold text-slate-900 leading-tight">Student Mentorship</div>
                  <div className="text-[11px] font-medium text-slate-500">Available for Guidance</div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

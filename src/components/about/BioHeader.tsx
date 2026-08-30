import React from 'react';
import Image from 'next/image';
import { GraduationCap, Award, MapPin, Mail, Phone, BookOpen, Lightbulb, CheckCircle2 } from 'lucide-react';

interface BioProps {
  profile: {
    fullName: string;
    designation: string;
    department: string;
    institution: string;
    profileImageUrl: string;
    bioText: string;
    phdSummary?: string | null;
    officeAddress?: string | null;
    contactEmail: string;
    contactPhone?: string | null;
  };
}

export default function BioHeader({ profile }: BioProps) {
  return (
    <section className="bg-gradient-to-b from-sky-50/70 via-white to-slate-50 py-12 sm:py-16 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="mb-10 text-left">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-wider mb-2">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Faculty Profile</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
            About {profile.fullName}
          </h1>
          <p className="text-lg text-sky-700 font-semibold mt-1">
            {profile.designation} • {profile.department}
          </p>
        </div>

        {/* 2-Column Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Bio & Philosophy */}
          <div className="lg:col-span-8 space-y-6">
            
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center space-x-2">
                <BookOpen className="w-6 h-6 text-sky-600" />
                <span>Biography & Academic Background</span>
              </h2>
              <p className="text-slate-700 leading-relaxed font-medium">
                {profile.bioText}
              </p>
              <p className="text-slate-600 leading-relaxed text-sm">
                With a deep passion for teaching complex computer engineering concepts, Prof. Sawant emphasizes problem-solving skills, hands-on lab experiments, and continuous curriculum enhancement. She actively collaborates with industry professionals to provide students with real-world exposure.
              </p>
            </div>

            {/* PhD Research Focus Callout Box */}
            {profile.phdSummary && (
              <div className="bg-gradient-to-r from-sky-900 to-indigo-900 text-white p-6 rounded-2xl shadow-md space-y-2">
                <div className="flex items-center space-x-2 text-amber-300 font-bold text-xs uppercase tracking-wider">
                  <Award className="w-4 h-4" />
                  <span>PhD Research Domain</span>
                </div>
                <h3 className="text-xl font-bold text-white">
                  Advanced Cloud Computing & Algorithmic Optimization
                </h3>
                <p className="text-slate-200 text-sm leading-relaxed">
                  {profile.phdSummary}
                </p>
              </div>
            )}

            {/* Teaching Philosophy Box */}
            <div className="bg-amber-50/70 p-6 rounded-2xl border border-amber-200/80 space-y-3">
              <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <Lightbulb className="w-5 h-5 text-amber-600" />
                <span>Teaching Philosophy</span>
              </h3>
              <p className="text-slate-700 text-sm leading-relaxed italic">
                &ldquo;Education in engineering is not merely about memorizing algorithms, but about instilling structured analytical thinking. My goal is to transform complex technical concepts into intuitive knowledge that students can apply to build impactful technological solutions.&rdquo;
              </p>
            </div>

          </div>

          {/* Right Column: Factsheet Card */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
              
              {/* Profile Image */}
              <div className="relative w-full h-64 rounded-xl overflow-hidden border-2 border-slate-100 shadow-inner">
                <Image
                  src={profile.profileImageUrl}
                  alt={profile.fullName}
                  fill
                  className="object-cover object-top"
                />
              </div>

              {/* Quick Info List */}
              <div className="space-y-4 text-xs">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 text-[11px]">
                  Faculty Details
                </h4>

                <div className="flex items-start space-x-3">
                  <GraduationCap className="w-4 h-4 text-sky-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-slate-900">Designation</div>
                    <div className="text-slate-600">{profile.designation}</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <MapPin className="w-4 h-4 text-sky-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-slate-900">Office Location</div>
                    <div className="text-slate-600">{profile.officeAddress || 'Department Office'}</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Mail className="w-4 h-4 text-sky-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-slate-900">Official Email</div>
                    <div className="text-slate-600">{profile.contactEmail}</div>
                  </div>
                </div>

                {profile.contactPhone && (
                  <div className="flex items-start space-x-3">
                    <Phone className="w-4 h-4 text-sky-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-slate-900">Phone Contact</div>
                      <div className="text-slate-600">{profile.contactPhone}</div>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center space-x-2 text-xs font-semibold text-emerald-700 bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>NAAC & NBA Committee Member</span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

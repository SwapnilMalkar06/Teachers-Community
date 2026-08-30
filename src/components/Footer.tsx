import React from 'react';
import Link from 'next/link';
import { GraduationCap, Mail, MapPin, ExternalLink, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          
          {/* Column 1: Teacher Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-sky-600 text-white flex items-center justify-center font-bold">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">Prof. Ashwini Sawant</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Dedicated Educator & Researcher in Computer Engineering. Committed to fostering innovation, student learning, and cutting-edge academic research.
            </p>
            <div className="space-y-2 pt-2 text-xs text-slate-400">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-sky-400 flex-shrink-0" />
                <span>Department of Computer Engineering</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-sky-400 flex-shrink-0" />
                <span>ashwini.sawant@example.com</span>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-sky-500 pl-2">
              Teaching Resources
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/teaching/subjects" className="hover:text-sky-400 transition-colors">Subjects Handled</Link>
              </li>
              <li>
                <Link href="/teaching/notes" className="hover:text-sky-400 transition-colors">Lecture Notes (PDF)</Link>
              </li>
              <li>
                <Link href="/teaching/ppts" className="hover:text-sky-400 transition-colors">Presentation Slides</Link>
              </li>
              <li>
                <Link href="/teaching/videos" className="hover:text-sky-400 transition-colors">Video Lectures</Link>
              </li>
              <li>
                <Link href="/teaching/question-banks" className="hover:text-sky-400 transition-colors">Question Banks & Keys</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Research & Activities */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-sky-500 pl-2">
              Research & Portfolio
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/research/phd" className="hover:text-sky-400 transition-colors">PhD Thesis & Focus</Link>
              </li>
              <li>
                <Link href="/research/publications" className="hover:text-sky-400 transition-colors">Journal & Conference Papers</Link>
              </li>
              <li>
                <Link href="/fdps-workshops" className="hover:text-sky-400 transition-colors">FDPs & Workshops</Link>
              </li>
              <li>
                <Link href="/certificates" className="hover:text-sky-400 transition-colors">Certifications & Badges</Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-sky-400 transition-colors">Blog & Articles</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Academic Profiles & Admin */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-sky-500 pl-2">
              Academic Networks
            </h3>
            <div className="space-y-2 text-sm">
              <a href="https://scholar.google.com" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-slate-300 hover:text-sky-400 transition-colors">
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Google Scholar Profile</span>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-slate-300 hover:text-sky-400 transition-colors">
                <ExternalLink className="w-3.5 h-3.5" />
                <span>LinkedIn Profile</span>
              </a>
              <a href="https://researchgate.net" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-slate-300 hover:text-sky-400 transition-colors">
                <ExternalLink className="w-3.5 h-3.5" />
                <span>ResearchGate Profile</span>
              </a>
              <a href="https://orcid.org" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-slate-300 hover:text-sky-400 transition-colors">
                <ExternalLink className="w-3.5 h-3.5" />
                <span>ORCID iD</span>
              </a>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800">
              <Link href="/admin" className="inline-flex items-center space-x-2 text-xs font-semibold text-sky-400 hover:text-sky-300 transition-colors">
                <ShieldCheck className="w-4 h-4" />
                <span>Teacher Admin Dashboard Login</span>
              </Link>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Prof. Ashwini Sawant. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">Personal Academic Portfolio & Content Portal</p>
        </div>
      </div>
    </footer>
  );
}

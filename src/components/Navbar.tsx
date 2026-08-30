'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  GraduationCap, 
  ChevronDown, 
  Menu, 
  X, 
  BookOpen, 
  FileText, 
  Presentation, 
  Video, 
  HelpCircle, 
  Award, 
  FileBadge, 
  Users, 
  ShieldAlert 
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [teachingOpen, setTeachingOpen] = useState(false);
  const [researchOpen, setResearchOpen] = useState(false);

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/');

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Brand Logo & Name */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-11 h-11 rounded-xl bg-sky-700 text-white flex items-center justify-center shadow-md group-hover:bg-sky-800 transition-colors">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900 block leading-none">
                Prof. Ashwini Sawant
              </span>
              <span className="text-xs font-medium text-sky-700 block mt-1">
                Assistant Professor & Researcher
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            <Link
              href="/"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                pathname === '/'
                  ? 'text-sky-700 bg-sky-50'
                  : 'text-slate-700 hover:text-sky-700 hover:bg-slate-50'
              }`}
            >
              Home
            </Link>

            <Link
              href="/about"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isActive('/about')
                  ? 'text-sky-700 bg-sky-50'
                  : 'text-slate-700 hover:text-sky-700 hover:bg-slate-50'
              }`}
            >
              About Me
            </Link>

            {/* Teaching Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setTeachingOpen(true)}
              onMouseLeave={() => setTeachingOpen(false)}
            >
              <button
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  isActive('/teaching')
                    ? 'text-sky-700 bg-sky-50'
                    : 'text-slate-700 hover:text-sky-700 hover:bg-slate-50'
                }`}
              >
                <span>Teaching</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${teachingOpen ? 'rotate-180' : ''}`} />
              </button>

              {teachingOpen && (
                <div className="absolute left-0 mt-1 w-60 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <Link
                    href="/teaching/subjects"
                    className="flex items-center space-x-2.5 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-sky-50 hover:text-sky-700 transition-colors"
                  >
                    <BookOpen className="w-4 h-4 text-sky-600" />
                    <span>Subjects</span>
                  </Link>
                  <Link
                    href="/teaching/notes"
                    className="flex items-center space-x-2.5 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-sky-50 hover:text-sky-700 transition-colors"
                  >
                    <FileText className="w-4 h-4 text-sky-600" />
                    <span>Notes</span>
                  </Link>
                  <Link
                    href="/teaching/ppts"
                    className="flex items-center space-x-2.5 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-sky-50 hover:text-sky-700 transition-colors"
                  >
                    <Presentation className="w-4 h-4 text-sky-600" />
                    <span>PPTs</span>
                  </Link>
                  <Link
                    href="/teaching/videos"
                    className="flex items-center space-x-2.5 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-sky-50 hover:text-sky-700 transition-colors"
                  >
                    <Video className="w-4 h-4 text-sky-600" />
                    <span>Video Lectures</span>
                  </Link>
                  <Link
                    href="/teaching/question-banks"
                    className="flex items-center space-x-2.5 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-sky-50 hover:text-sky-700 transition-colors"
                  >
                    <HelpCircle className="w-4 h-4 text-sky-600" />
                    <span>Question Banks</span>
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/fdps-workshops"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isActive('/fdps-workshops')
                  ? 'text-sky-700 bg-sky-50'
                  : 'text-slate-700 hover:text-sky-700 hover:bg-slate-50'
              }`}
            >
              FDPs & Workshops
            </Link>

            <Link
              href="/certificates"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isActive('/certificates')
                  ? 'text-sky-700 bg-sky-50'
                  : 'text-slate-700 hover:text-sky-700 hover:bg-slate-50'
              }`}
            >
              Certificates
            </Link>

            {/* Research Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setResearchOpen(true)}
              onMouseLeave={() => setResearchOpen(false)}
            >
              <button
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  isActive('/research')
                    ? 'text-sky-700 bg-sky-50'
                    : 'text-slate-700 hover:text-sky-700 hover:bg-slate-50'
                }`}
              >
                <span>Research</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${researchOpen ? 'rotate-180' : ''}`} />
              </button>

              {researchOpen && (
                <div className="absolute left-0 mt-1 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <Link
                    href="/research/phd"
                    className="flex items-center space-x-2.5 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-sky-50 hover:text-sky-700 transition-colors"
                  >
                    <Award className="w-4 h-4 text-sky-600" />
                    <span>PhD Thesis</span>
                  </Link>
                  <Link
                    href="/research/publications"
                    className="flex items-center space-x-2.5 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-sky-50 hover:text-sky-700 transition-colors"
                  >
                    <FileBadge className="w-4 h-4 text-sky-600" />
                    <span>Publications</span>
                  </Link>
                  <Link
                    href="/research/conferences"
                    className="flex items-center space-x-2.5 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-sky-50 hover:text-sky-700 transition-colors"
                  >
                    <Users className="w-4 h-4 text-sky-600" />
                    <span>Conferences</span>
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/activities"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isActive('/activities')
                  ? 'text-sky-700 bg-sky-50'
                  : 'text-slate-700 hover:text-sky-700 hover:bg-slate-50'
              }`}
            >
              Activities
            </Link>

            <Link
              href="/gallery"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isActive('/gallery')
                  ? 'text-sky-700 bg-sky-50'
                  : 'text-slate-700 hover:text-sky-700 hover:bg-slate-50'
              }`}
            >
              Gallery
            </Link>

            <Link
              href="/blog"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isActive('/blog')
                  ? 'text-sky-700 bg-sky-50'
                  : 'text-slate-700 hover:text-sky-700 hover:bg-slate-50'
              }`}
            >
              Blog
            </Link>

            <Link
              href="/contact"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isActive('/contact')
                  ? 'text-sky-700 bg-sky-50'
                  : 'text-slate-700 hover:text-sky-700 hover:bg-slate-50'
              }`}
            >
              Contact
            </Link>

            {/* Admin Control Link */}
            <Link
              href="/admin"
              className="ml-2 inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-xs font-bold bg-slate-900 text-white hover:bg-sky-800 transition-colors shadow-sm"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-sky-400" />
              <span>Admin Portal</span>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-1 shadow-lg">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-semibold text-slate-800 hover:bg-sky-50"
          >
            Home
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-semibold text-slate-800 hover:bg-sky-50"
          >
            About Me
          </Link>
          <div className="pl-3 border-l-2 border-sky-600 my-2 space-y-1">
            <div className="text-xs font-bold uppercase tracking-wider text-sky-700 py-1">Teaching</div>
            <Link href="/teaching/subjects" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-sm text-slate-700 hover:text-sky-700">Subjects</Link>
            <Link href="/teaching/notes" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-sm text-slate-700 hover:text-sky-700">Notes</Link>
            <Link href="/teaching/ppts" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-sm text-slate-700 hover:text-sky-700">PPTs</Link>
            <Link href="/teaching/videos" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-sm text-slate-700 hover:text-sky-700">Video Lectures</Link>
            <Link href="/teaching/question-banks" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-sm text-slate-700 hover:text-sky-700">Question Banks</Link>
          </div>
          <Link href="/fdps-workshops" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-semibold text-slate-800 hover:bg-sky-50">FDPs & Workshops</Link>
          <Link href="/certificates" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-semibold text-slate-800 hover:bg-sky-50">Certificates</Link>
          <div className="pl-3 border-l-2 border-sky-600 my-2 space-y-1">
            <div className="text-xs font-bold uppercase tracking-wider text-sky-700 py-1">Research</div>
            <Link href="/research/phd" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-sm text-slate-700 hover:text-sky-700">PhD Thesis</Link>
            <Link href="/research/publications" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-sm text-slate-700 hover:text-sky-700">Publications</Link>
            <Link href="/research/conferences" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-sm text-slate-700 hover:text-sky-700">Conferences</Link>
          </div>
          <Link href="/activities" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-semibold text-slate-800 hover:bg-sky-50">Activities</Link>
          <Link href="/gallery" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-semibold text-slate-800 hover:bg-sky-50">Gallery</Link>
          <Link href="/blog" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-semibold text-slate-800 hover:bg-sky-50">Blog</Link>
          <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-semibold text-slate-800 hover:bg-sky-50">Contact</Link>
          <div className="pt-2">
            <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="block w-full text-center py-2.5 bg-slate-900 text-white rounded-lg text-sm font-bold">Admin Portal</Link>
          </div>
        </div>
      )}
    </header>
  );
}

import React from 'react';
import Link from 'next/link';
import { BookOpen, Building, ShieldCheck, UserCheck, GraduationCap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 text-slate-400 text-xs py-12 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        
        <div className="space-y-3 md:col-span-2">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold">
              <BookOpen className="w-4 h-4" />
            </div>
            <span className="text-lg font-black text-white">Teachers-Community</span>
          </div>
          <p className="text-slate-400 max-w-md leading-relaxed">
            Multi-Teacher Academic Network connecting students with university professors across departments and domains. Access lecture notes, PPT presentations, and exam question banks in one platform.
          </p>
        </div>

        <div className="space-y-2">
          <div className="font-bold text-white uppercase text-[11px] tracking-wider">Quick Navigation</div>
          <ul className="space-y-1.5">
            <li><Link href="/" className="hover:text-sky-400 transition-colors">Platform Home</Link></li>
            <li><Link href="/teachers" className="hover:text-sky-400 transition-colors">Teachers Directory</Link></li>
            <li><Link href="/resources" className="hover:text-sky-400 transition-colors">Notes, PPTs & Question Banks</Link></li>
          </ul>
        </div>

        <div className="space-y-2">
          <div className="font-bold text-white uppercase text-[11px] tracking-wider">User Level Logins</div>
          <ul className="space-y-1.5">
            <li><Link href="/login?role=admin" className="hover:text-rose-400 transition-colors flex items-center space-x-1"><ShieldCheck className="w-3.5 h-3.5" /><span>Level 1: Admin Login</span></Link></li>
            <li><Link href="/login?role=teacher" className="hover:text-sky-400 transition-colors flex items-center space-x-1"><UserCheck className="w-3.5 h-3.5" /><span>Level 2: Teacher Login</span></Link></li>
            <li><Link href="/login?role=student" className="hover:text-emerald-400 transition-colors flex items-center space-x-1"><GraduationCap className="w-3.5 h-3.5" /><span>Level 3: Student Login</span></Link></li>
          </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto pt-8 mt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px]">
        <div>© 2026 Teachers-Community Platform. All rights reserved.</div>
        <div className="text-slate-500">Empowering Multi-University Learning</div>
      </div>
    </footer>
  );
}

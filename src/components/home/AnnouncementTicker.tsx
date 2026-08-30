'use client';

import React, { useState } from 'react';
import { Bell, ArrowRight, X, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function AnnouncementTicker() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-sky-900 via-sky-800 to-indigo-900 text-white border-b border-sky-700/50 py-3 px-4 shadow-inner relative">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 text-xs sm:text-sm font-medium">
        
        <div className="flex items-center space-x-3 overflow-hidden">
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-amber-400 text-slate-950 font-bold uppercase tracking-wider text-[10px] shadow-sm flex-shrink-0 animate-pulse">
            <Bell className="w-3 h-3" />
            <span>Notice</span>
          </span>
          
          <div className="truncate flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-amber-300 hidden sm:inline-block flex-shrink-0" />
            <span className="truncate text-slate-100 font-semibold">
              New Lecture Notes & Question Bank uploaded for <strong className="text-amber-300 font-bold">Data Structures (CS301)</strong> Semester III.
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3 flex-shrink-0">
          <Link
            href="/teaching/notes"
            className="hidden sm:inline-flex items-center space-x-1 text-xs font-bold text-sky-200 hover:text-white underline decoration-sky-400 underline-offset-4 transition-colors"
          >
            <span>View Notes</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={() => setIsVisible(false)}
            className="p-1 rounded-md text-sky-200 hover:text-white hover:bg-sky-800/60 transition-colors"
            aria-label="Dismiss notice"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}

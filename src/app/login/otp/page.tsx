'use client';

import React, { useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft, RefreshCw } from 'lucide-react';

function OTPRedirectContent() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/login?role=teacher');
    }, 2000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl text-center">
      <div className="space-y-2 border-b border-slate-800 pb-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
          <ShieldCheck className="w-4 h-4" />
          <span>OTP Verification Disabled</span>
        </div>
        <h1 className="text-2xl font-black text-white">
          Direct Account Login
        </h1>
        <p className="text-xs text-slate-400">
          OTP verification has been completely removed. You can now log in directly using your email and password.
        </p>
      </div>

      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
        Redirecting you to Teacher Login...
      </div>

      <div className="pt-2 text-center text-xs text-slate-400 border-t border-slate-800">
        <Link href="/login?role=teacher" className="text-sky-400 hover:underline font-semibold flex items-center justify-center space-x-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Click here if not redirected automatically</span>
        </Link>
      </div>
    </div>
  );
}

export default function FirstTimeTeacherOTPPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 py-16 text-slate-100">
      <Suspense fallback={
        <div className="flex items-center space-x-2 text-slate-400 text-xs font-mono">
          <RefreshCw className="w-4 h-4 animate-spin text-sky-400" />
          <span>Loading...</span>
        </div>
      }>
        <OTPRedirectContent />
      </Suspense>
    </div>
  );
}

'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { KeyRound, ShieldCheck, Mail, Lock, CheckCircle, AlertCircle, ArrowLeft, ArrowRight, RefreshCw, Key, Sparkles } from 'lucide-react';

function OTPLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get('email') || '';

  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [teacherName, setTeacherName] = useState<string | null>(null);

  const [resending, setResending] = useState(false);

  const handleResendOTP = async () => {
    if (!email) {
      setError('Please enter your approved email address to send or resend OTP.');
      return;
    }
    setResending(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(`Fresh 6-digit OTP dispatched to mobile number ${data.phone}! (Provider: ${data.provider})`);
        if (data.otp) setOtp(data.otp);
      } else {
        setError(data.error || 'Failed to dispatch OTP.');
      }
    } catch (err) {
      setError('Network error while requesting OTP.');
    } finally {
      setResending(false);
    }
  };

  // Quick Demo fill helper
  const handleAutofillDemo = async () => {
    try {
      const res = await fetch('/api/teacher-requests');
      const data = await res.json();
      if (data.success && data.requests) {
        const approved = data.requests.find((r: any) => r.status === 'APPROVED' && r.otp);
        if (approved) {
          setEmail(approved.email);
          setOtp(approved.otp);
          setSuccess(`Autofilled approved demo teacher: ${approved.email} (OTP: ${approved.otp})`);
        } else {
          alert('No approved teacher request with OTP found yet. Please approve a request on /admin/dashboard first!');
        }
      }
    } catch (err) {
      console.error('Autofill demo error:', err);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (data.success) {
        setTeacherName(data.teacherName || 'Teacher');
        setSuccess('OTP verified successfully! Now set your account password.');
        setStep(2);
      } else {
        setError(data.error || 'Invalid OTP code.');
      }
    } catch (err) {
      console.error('OTP verify error:', err);
      setError('Network connection error.');
    } finally {
      setLoading(false);
    }
  };

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/set-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess('Password set successfully! Logging in to your Teacher Dashboard...');
        setTimeout(() => {
          router.push('/teacher/dashboard');
          router.refresh();
        }, 1000);
      } else {
        setError(data.error || 'Failed to set password.');
      }
    } catch (err) {
      console.error('Password set error:', err);
      setError('Network connection error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
      
      <div className="space-y-2 text-center border-b border-slate-800 pb-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-bold">
          <KeyRound className="w-4 h-4" />
          <span>Approved Teacher First-Time Setup</span>
        </div>
        <h1 className="text-2xl font-black text-white">
          {step === 1 ? 'Verify 6-Digit SMS OTP' : `Set Password for ${teacherName}`}
        </h1>
        <p className="text-xs text-slate-400">
          {step === 1
            ? 'Enter your academic email and the 6-digit OTP sent to your phone upon Admin approval.'
            : 'Create your new secure password to access your Teacher Dashboard.'}
        </p>
      </div>

      {/* Demo Autofill Banner */}
      {step === 1 && (
        <div className="bg-sky-500/10 border border-sky-500/20 p-3 rounded-2xl flex items-center justify-between text-xs text-sky-300">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-sky-400 shrink-0" />
            <span>Testing OTP verification?</span>
          </div>
          <button
            type="button"
            onClick={handleAutofillDemo}
            className="px-3 py-1 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-[11px] transition-all"
          >
            Autofill Approved OTP
          </button>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-medium flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {step === 1 ? (
        <form onSubmit={handleVerifyOTP} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Approved Teacher Email *</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="teacher@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-medium text-white focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-300">6-Digit SMS OTP Code *</label>
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={resending}
                className="text-[11px] font-semibold text-sky-400 hover:text-sky-300 underline disabled:opacity-50"
              >
                {resending ? 'Sending SMS...' : 'Resend OTP to Mobile'}
              </button>
            </div>
            <div className="relative">
              <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                maxLength={6}
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-base tracking-widest font-mono text-white placeholder-slate-600 focus:ring-2 focus:ring-sky-500 text-center"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Check the 6-digit OTP code sent via SMS to your mobile phone.</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-6 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs transition-all shadow-lg shadow-sky-900/30 flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <span>{loading ? 'Verifying OTP...' : 'Verify OTP & Continue'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      ) : (
        <form onSubmit={handleSetPassword} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">New Account Password *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="Minimum 6 characters..."
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-medium text-white focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Confirm New Password *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="Re-enter password..."
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-medium text-white focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-lg shadow-emerald-900/30 flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <span>{loading ? 'Setting Password...' : 'Save Password & Go to Dashboard'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      )}

      <div className="pt-2 text-center text-xs text-slate-400 border-t border-slate-800">
        <Link href="/login?role=teacher" className="text-sky-400 hover:underline font-semibold flex items-center justify-center space-x-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Standard Teacher Login</span>
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
          <span>Loading OTP Verification Portal...</span>
        </div>
      }>
        <OTPLoginContent />
      </Suspense>
    </div>
  );
}

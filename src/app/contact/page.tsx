'use client';

import React, { useState } from 'react';
import { Mail, MapPin, Phone, Clock, Send, ExternalLink, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (json.success) {
        setSuccessMsg(json.message);
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setErrorMsg(json.error || 'Failed to send message.');
      }
    } catch (err) {
      console.error('Contact submission error:', err);
      setErrorMsg('Network error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-b from-sky-50/70 via-white to-slate-50 py-12 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Mail className="w-3.5 h-3.5" />
            <span>Get in Touch</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Contact & Consultation
          </h1>
          <p className="text-slate-600 mt-2 max-w-3xl font-medium">
            Reach out to Prof. Ashwini Sawant for academic guidance, student project mentoring, or research collaboration.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Office Details & Social Badges */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-sky-600" />
                <span>Office Information</span>
              </h2>

              <div className="space-y-5 text-xs sm:text-sm">
                
                <div className="flex items-start space-x-3.5">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 text-sky-700 flex items-center justify-center flex-shrink-0 font-bold">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-sm">Department Location</div>
                    <div className="text-slate-600 mt-0.5 leading-relaxed">
                      Room 402, Academic Block A, Department of Computer Engineering
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 text-sky-700 flex items-center justify-center flex-shrink-0 font-bold">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-sm">Official Email</div>
                    <a href="mailto:ashwini.sawant@example.com" className="text-sky-700 font-semibold hover:underline mt-0.5 block">
                      ashwini.sawant@example.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 text-sky-700 flex items-center justify-center flex-shrink-0 font-bold">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-sm">Phone Contact</div>
                    <div className="text-slate-600 mt-0.5">+91 98765 43210</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 flex items-center justify-center flex-shrink-0 font-bold">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-sm">Student Office Hours</div>
                    <div className="text-slate-600 mt-0.5">
                      Monday – Friday: 3:00 PM – 5:00 PM
                    </div>
                  </div>
                </div>

              </div>

              {/* Academic Social Profiles */}
              <div className="pt-6 border-t border-slate-100 space-y-3">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Academic Networks:
                </h3>
                <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                  <a
                    href="https://scholar.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 hover:text-sky-700 hover:bg-sky-50 hover:border-sky-300 transition-all"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-sky-600" />
                    <span>Google Scholar</span>
                  </a>

                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 hover:text-sky-700 hover:bg-sky-50 hover:border-sky-300 transition-all"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-sky-600" />
                    <span>LinkedIn</span>
                  </a>

                  <a
                    href="https://researchgate.net"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 hover:text-sky-700 hover:bg-sky-50 hover:border-sky-300 transition-all"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-sky-600" />
                    <span>ResearchGate</span>
                  </a>

                  <a
                    href="https://orcid.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 hover:text-sky-700 hover:bg-sky-50 hover:border-sky-300 transition-all"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-sky-600" />
                    <span>ORCID iD</span>
                  </a>
                </div>
              </div>

            </div>

          </div>

          {/* Right Column: Interactive Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Send an Inquiry Message
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Fill out the form below to send a message directly to Prof. Sawant.
                </p>
              </div>

              {/* Success Alert */}
              {successMsg && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Error Alert */}
              {errorMsg && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block font-bold text-slate-700">Your Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block font-bold text-slate-700">Your Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="rahul@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block font-bold text-slate-700">Subject / Purpose *</label>
                  <input
                    type="text"
                    name="subject"
                    required
                    placeholder="e.g. Guidance for Capstone Project / Data Structures Notes"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block font-bold text-slate-700">Message Content *</label>
                  <textarea
                    name="message"
                    rows={5}
                    required
                    placeholder="Write your inquiry or question here..."
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center space-x-2 py-3.5 px-6 rounded-xl bg-sky-700 text-white font-bold text-sm hover:bg-sky-800 transition-all shadow-md disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? 'Submitting Message...' : 'Send Message'}</span>
                </button>
              </form>

            </div>
          </div>

        </div>
      </div>

    </div>
  );
}

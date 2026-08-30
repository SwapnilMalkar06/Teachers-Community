'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Award, ExternalLink, Eye, X, Calendar, ShieldCheck, Sparkles } from 'lucide-react';

interface CertificateItem {
  id: string;
  title: string;
  issuingOrganization: string;
  issueDate: string;
  credentialId?: string | null;
  credentialUrl?: string | null;
  imageUrl?: string | null;
}

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<CertificateItem[]>([]);
  const [activeImageModal, setActiveImageModal] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/credentials');
        const json = await res.json();
        if (json.success) {
          setCertificates(json.data.certificates);
        }
      } catch (err) {
        console.error('Error loading certificates:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-b from-sky-50/70 via-white to-slate-50 py-12 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Award className="w-3.5 h-3.5" />
            <span>Verified Credentials</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Professional Certifications & Badges
          </h1>
          <p className="text-slate-600 mt-2 max-w-3xl font-medium">
            Industry & academic certifications earned from NPTEL, AWS, Coursera, AICTE, and professional bodies.
          </p>
        </div>
      </div>

      {/* Certificates Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {loading ? (
          <div className="text-center py-12 text-slate-500 font-medium">Loading certificates...</div>
        ) : certificates.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 space-y-2">
            <Award className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800">No Certificates Found</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((cert) => {
              const imgUrl = cert.imageUrl || 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?auto=format&fit=crop&q=80&w=800';

              return (
                <div
                  key={cert.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    {/* Certificate Preview Image */}
                    <div className="relative w-full h-48 bg-slate-100 group">
                      <Image
                        src={imgUrl}
                        alt={cert.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <button
                        onClick={() => setActiveImageModal(imgUrl)}
                        className="absolute inset-0 flex items-center justify-center bg-slate-950/30 opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Preview Certificate Image"
                      >
                        <div className="w-10 h-10 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-lg">
                          <Eye className="w-5 h-5" />
                        </div>
                      </button>
                    </div>

                    {/* Certificate Details */}
                    <div className="p-6 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 font-extrabold text-[11px] uppercase tracking-wider flex items-center space-x-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Verified</span>
                        </span>
                        <span className="inline-flex items-center space-x-1 text-xs font-bold text-slate-400">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{new Date(cert.issueDate).toLocaleDateString()}</span>
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug">
                        {cert.title}
                      </h3>

                      <p className="text-xs font-bold text-sky-700">
                        Issuer: {cert.issuingOrganization}
                      </p>

                      {cert.credentialId && (
                        <p className="text-[11px] font-mono text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100">
                          ID: {cert.credentialId}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-6 pt-0 flex items-center space-x-2">
                    <button
                      onClick={() => setActiveImageModal(imgUrl)}
                      className="flex-1 inline-flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl bg-slate-100 text-slate-800 font-bold text-xs hover:bg-emerald-50 hover:text-emerald-700 transition-all"
                    >
                      <Eye className="w-4 h-4 text-emerald-600" />
                      <span>View</span>
                    </button>

                    {cert.credentialUrl && (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl bg-emerald-700 text-white font-bold text-xs hover:bg-emerald-800 transition-all shadow-sm"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Verify</span>
                      </a>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Certificate Image Lightbox Modal */}
      {activeImageModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden border border-slate-800 flex flex-col">
            <div className="p-4 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center space-x-2 font-bold text-sm">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Certificate Lightbox Viewer</span>
              </div>
              <button
                onClick={() => setActiveImageModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="relative w-full h-[70vh] bg-slate-950">
              <Image
                src={activeImageModal}
                alt="Certificate Full View"
                fill
                className="object-contain p-4"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

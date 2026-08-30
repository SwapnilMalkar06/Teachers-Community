'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Camera, Eye, X, Filter, Sparkles, Calendar } from 'lucide-react';

interface GalleryItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  eventDate: string;
}

export default function GalleryPage() {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activeImage, setActiveImage] = useState<GalleryItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/activities');
        const json = await res.json();
        if (json.success) {
          setGallery(json.data.gallery);
        }
      } catch (err) {
        console.error('Error loading gallery:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const categories = Array.from(new Set(gallery.map((item) => item.category)));

  const filteredGallery = gallery.filter((item) => {
    return selectedCategory === 'ALL' || item.category === selectedCategory;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-b from-sky-50/70 via-white to-slate-50 py-12 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Camera className="w-3.5 h-3.5" />
            <span>Event Moments</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Photo & Media Gallery
          </h1>
          <p className="text-slate-600 mt-2 max-w-3xl font-medium">
            Highlights from academic conferences, workshops, award ceremonies, and department events.
          </p>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-2 overflow-x-auto">
          <Filter className="w-4 h-4 text-sky-600 flex-shrink-0" />
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex-shrink-0 ${
              selectedCategory === 'ALL'
                ? 'bg-sky-700 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Media ({gallery.length})
          </button>

          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex-shrink-0 ${
                selectedCategory === cat
                  ? 'bg-sky-700 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Photo Gallery Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="text-center py-12 text-slate-500 font-medium">Loading media gallery...</div>
        ) : filteredGallery.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 space-y-2">
            <Camera className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800">No Photos Found</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGallery.map((item) => (
              <div
                key={item.id}
                onClick={() => setActiveImage(item)}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden cursor-pointer group flex flex-col justify-between"
              >
                <div className="relative w-full h-64 bg-slate-900">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-slate-950/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-xl">
                      <Eye className="w-6 h-6" />
                    </div>
                  </div>
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-sky-900/90 text-white font-extrabold text-xs shadow-md">
                    {item.category}
                  </span>
                </div>

                <div className="p-4 bg-white border-t border-slate-100 space-y-1">
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-sky-700 transition-colors line-clamp-1">
                    {item.title}
                  </h3>
                  <div className="flex items-center space-x-1 text-[11px] font-semibold text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(item.eventDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Zoom Modal */}
      {activeImage && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden border border-slate-800 flex flex-col">
            <div className="p-4 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center space-x-2 font-bold text-sm">
                <Sparkles className="w-4 h-4 text-sky-400" />
                <span>{activeImage.title}</span>
              </div>
              <button
                onClick={() => setActiveImage(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="relative w-full h-[75vh] bg-slate-950">
              <Image
                src={activeImage.imageUrl}
                alt={activeImage.title}
                fill
                className="object-contain p-2"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

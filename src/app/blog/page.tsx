import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { BookOpen, Calendar, Eye, Clock, ArrowRight, Sparkles } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function BlogListingPage() {
  let posts: any[] = [];
  try {
    posts = await prisma.blogPost.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: 'desc' },
    });
  } catch (err) {
    console.error("Database error during blog fetch:", err);
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-b from-sky-50/70 via-white to-slate-50 py-12 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-wider mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Academic Insights</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Blog & Articles
          </h1>
          <p className="text-slate-600 mt-2 max-w-3xl font-medium">
            Articles on Computer Engineering, exam preparation strategies, research trends, and student mentorship guides.
          </p>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {posts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 space-y-2">
            <BookOpen className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800">No Published Articles Yet</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => {
              const coverImg = post.coverImage || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800';

              return (
                <div
                  key={post.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    {/* Cover Image Container */}
                    <div className="relative w-full h-52 bg-slate-100 overflow-hidden">
                      <Image
                        src={coverImg}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 flex items-center space-x-2">
                        <span className="px-2.5 py-1 rounded-lg bg-slate-900/90 text-white font-extrabold text-[11px] shadow-md flex items-center space-x-1">
                          <Clock className="w-3 h-3 text-sky-400" />
                          <span>{post.estimatedReadingMinutes} min read</span>
                        </span>
                      </div>
                      <div className="absolute top-3 right-3">
                        <span className="px-2.5 py-1 rounded-lg bg-sky-900/90 text-white font-extrabold text-[11px] shadow-md flex items-center space-x-1">
                          <Eye className="w-3 h-3 text-sky-300" />
                          <span>{post.viewCount} reads</span>
                        </span>
                      </div>
                    </div>

                    {/* Article Content */}
                    <div className="p-6 pt-0 space-y-3">
                      <div className="flex items-center space-x-2 text-xs font-bold text-slate-400">
                        <Calendar className="w-3.5 h-3.5 text-sky-600" />
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                      </div>

                      <h2 className="text-xl font-bold text-slate-900 group-hover:text-sky-700 transition-colors leading-snug">
                        {post.title}
                      </h2>

                      <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                        {post.summary}
                      </p>
                    </div>
                  </div>

                  {/* Read Article Action */}
                  <div className="p-6 pt-0">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center space-x-2 text-xs font-bold text-sky-700 group-hover:text-sky-800 underline decoration-sky-300 underline-offset-4 transition-colors"
                    >
                      <span>Read Article</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import EngagementTracker from '@/components/blog/EngagementTracker';
import { Calendar, Eye, Clock, ArrowLeft, BookOpen, User } from 'lucide-react';

export const revalidate = 60;

export default async function BlogDetailPage({ params }: { params: { slug: string } }) {
  let post = null;
  try {
    post = await prisma.blogPost.findUnique({
      where: { slug: params.slug },
    });
  } catch (err) {
    console.error("Database error during post fetch:", err);
  }

  if (!post || !post.isPublished) {
    notFound();
  }

  const coverImg = post.coverImage || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      
      {/* Invisible Engagement Analytics Tracker */}
      <EngagementTracker postId={post.id} />

      {/* Article Header */}
      <div className="bg-gradient-to-b from-sky-50/70 via-white to-slate-50 py-12 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-left">
          
          <Link
            href="/blog"
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-sky-700 hover:text-sky-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Articles</span>
          </Link>

          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500">
            <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-sky-100 text-sky-800 font-extrabold">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Computer Engineering</span>
            </span>

            <span className="inline-flex items-center space-x-1">
              <Calendar className="w-3.5 h-3.5 text-sky-600" />
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            </span>

            <span className="inline-flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-sky-600" />
              <span>⏱️ {post.estimatedReadingMinutes} min read</span>
            </span>

            <span className="inline-flex items-center space-x-1">
              <Eye className="w-3.5 h-3.5 text-sky-600" />
              <span>👁️ {post.viewCount + 1} views</span>
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center space-x-3 pt-2">
            <div className="w-10 h-10 rounded-full bg-sky-700 text-white flex items-center justify-center font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-slate-900">Prof. Ashwini Sawant</div>
              <div className="text-xs text-slate-500 font-medium">Assistant Professor & Author</div>
            </div>
          </div>

        </div>
      </div>

      {/* Cover Image & Article Body */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-10">
        
        {/* Cover Image */}
        <div className="relative w-full h-80 sm:h-96 rounded-3xl overflow-hidden shadow-lg border border-slate-200 bg-slate-100">
          <Image
            src={coverImg}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Article Summary Box */}
        <div className="p-6 bg-amber-50/70 border border-amber-200 rounded-2xl text-slate-800 text-sm font-medium leading-relaxed italic">
          <strong>Summary:</strong> {post.summary}
        </div>

        {/* Content Body */}
        <article className="prose prose-slate max-w-none bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-sm leading-relaxed space-y-6 text-slate-800 font-normal">
          <div className="whitespace-pre-wrap font-sans text-base">
            {post.content}
          </div>
        </article>

        {/* Back Link */}
        <div className="pt-6 border-t border-slate-200">
          <Link
            href="/blog"
            className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-sky-800 transition-all shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Blog Listing</span>
          </Link>
        </div>

      </div>

    </div>
  );
}

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import EngagementTracker from '@/components/blog/EngagementTracker';
import { Calendar, Eye, Clock, ArrowLeft, BookOpen } from 'lucide-react';

export const dynamic = 'force-dynamic';

function getValidImageUrl(src: string | null | undefined): string {
  const defaultFallback = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800';
  if (!src) return defaultFallback;
  const trimmed = src.trim();
  if (!trimmed) return defaultFallback;
  if (trimmed.startsWith('/') || trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:image/')) {
    return trimmed;
  }
  return defaultFallback;
}

export default async function BlogDetailPage({ params }: { params: { slug: string } }) {
  let post = null;
  try {
    post = await prisma.blogPost.findUnique({
      where: { slug: params.slug },
      include: {
        teacher: true,
      },
    });
  } catch (err) {
    console.error("Database error during post fetch:", err);
  }

  if (!post || !post.isPublished) {
    notFound();
  }

  const coverImg = getValidImageUrl(post.coverImage);
  const author = post.teacher;
  const authorName = author?.fullName || 'Prof. Ashwini Sawant';
  const authorTitle = author?.designation || 'Assistant Professor';
  const authorDept = author?.department || 'Computer Engineering';
  const authorUni = author?.university || 'Mumbai University';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      
      {/* Invisible Engagement Analytics Tracker */}
      <EngagementTracker postId={post.id} />

      {/* Article Header */}
      <div className="bg-gradient-to-b from-sky-900 via-slate-900 to-slate-950 text-white py-14 border-b border-slate-800 shadow-md">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-left">
          
          <Link
            href="/blog"
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-sky-400 hover:text-sky-300 transition-colors bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Articles</span>
          </Link>

          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-300">
            <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 font-extrabold">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{authorDept}</span>
            </span>

            <span className="inline-flex items-center space-x-1">
              <Calendar className="w-3.5 h-3.5 text-sky-400" />
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            </span>

            <span className="inline-flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-sky-400" />
              <span>{post.estimatedReadingMinutes} min read</span>
            </span>

            <span className="inline-flex items-center space-x-1">
              <Eye className="w-3.5 h-3.5 text-sky-400" />
              <span>{post.viewCount + 1} views</span>
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            {post.title}
          </h1>

          {/* Teacher Author Info Header */}
          <div className="flex items-center space-x-3.5 pt-2 border-t border-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/20 border border-sky-400/30 text-sky-300 flex items-center justify-center font-extrabold text-lg">
              {authorName.charAt(0)}
            </div>
            <div>
              <div className="font-bold text-sm text-white">{authorName}</div>
              <div className="text-xs text-slate-400 font-medium">
                {authorTitle} • <span className="text-sky-300">{authorUni}</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Cover Image & Article Body */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-10">
        
        {/* Cover Image */}
        {coverImg && (
          <div className="relative w-full h-80 sm:h-96 rounded-3xl overflow-hidden shadow-lg border border-slate-200 bg-slate-100">
            <Image
              src={coverImg}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Article Summary Box */}
        {post.summary && (
          <div className="p-6 bg-sky-50/70 border border-sky-200 rounded-2xl text-slate-800 text-sm font-medium leading-relaxed italic">
            <strong className="text-sky-900 not-italic">Executive Summary:</strong> {post.summary}
          </div>
        )}

        {/* Content Body with HTML Rendering (Calibri / Times New Roman, Bold, Italic, Underline & Fitted Images) */}
        <article className="prose prose-slate max-w-none bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-sm leading-relaxed space-y-6 text-slate-900 font-normal">
          <div
            className="blog-content-body font-sans text-base leading-relaxed overflow-hidden"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>

        {/* Author Bio Footer Card */}
        <div className="bg-slate-900 text-white p-8 rounded-3xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-sky-600/30 border border-sky-500/40 text-sky-400 flex items-center justify-center font-black text-2xl flex-shrink-0">
            {authorName.charAt(0)}
          </div>
          <div className="space-y-1 flex-1">
            <div className="text-xs font-bold uppercase tracking-wider text-sky-400">Written By</div>
            <h4 className="text-lg font-bold text-white">{authorName}</h4>
            <p className="text-xs text-slate-300">
              {authorTitle} at {authorUni} ({authorDept}).
            </p>
          </div>
          <Link
            href="/blog"
            className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md transition-all self-stretch sm:self-auto text-center"
          >
            More Articles by Faculty
          </Link>
        </div>

        {/* Back Link */}
        <div className="pt-4">
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

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const defaultPosts = [
  {
    id: 'post-1',
    title: 'Effective Study Strategies for Data Structures & Algorithms Exams',
    slug: 'effective-study-strategies-for-data-structures-exam',
    summary: 'Essential tips for computer engineering students to master trees, graphs, and algorithmic problem-solving before university semester exams.',
    content: `
# Mastering Data Structures & Algorithms: A Guide for Students

Data Structures & Algorithms (DSA) form the core backbone of Computer Engineering and technical interviews. Here are key strategies to ace your semester exams and build long-term retention:

## 1. Focus on Visualizing Pointer Manipulations
Whether working with singly linked lists, doubly linked lists, or binary search trees, draw pointer diagrams on paper before attempting code implementation.

## 2. Master Standard Traversal Pseudocode
Ensure you can write BFS, DFS, Pre-order, In-order, and Post-order tree traversals without looking at references.

## 3. Practice Asymptotic Time Complexity Analysis
Always calculate Big-O time and space complexity for your loops, recursive calls, and hash map lookups.

Good luck with your preparation!
    `,
    coverImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800',
    isPublished: true,
    viewCount: 142,
    estimatedReadingMinutes: 3,
    totalEngagementSeconds: 2840,
    createdAt: new Date().toISOString(),
  },
];

export async function GET() {
  let posts = defaultPosts;

  try {
    const dbPosts = await prisma.blogPost.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: 'desc' },
    });
    if (dbPosts.length > 0) posts = dbPosts as any;
  } catch (error) {
    console.error('Error fetching blog posts (using default fallbacks):', error);
  }

  return NextResponse.json({
    success: true,
    data: posts,
  });
}

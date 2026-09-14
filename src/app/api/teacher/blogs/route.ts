import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyUserRole } from '@/lib/auth';

export const dynamic = 'force-dynamic';

function generateSlug(title: string): string {
  const cleanTitle = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `${cleanTitle}-${Math.floor(1000 + Math.random() * 9000)}`;
}

function estimateReadingTime(text: string): number {
  const words = text.replace(/<[^>]*>/g, '').trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

function sanitizeCoverImage(img: string | null | undefined): string | null {
  if (!img) return null;
  const trimmed = img.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith('/') || trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:image/')) {
    return trimmed;
  }
  return null;
}

// GET: Fetch blogs authored by the logged-in teacher
export async function GET() {
  try {
    const session = await verifyUserRole(['TEACHER', 'ADMIN']);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    let teacherId = session.teacherId;

    if (!teacherId) {
      const profile = await prisma.teacherProfile.findFirst({
        where: { userId: session.userId },
      });
      if (profile) teacherId = profile.id;
    }

    const blogs = await prisma.blogPost.findMany({
      where: teacherId ? { teacherId } : {},
      orderBy: { createdAt: 'desc' },
      include: {
        teacher: {
          select: {
            id: true,
            fullName: true,
            designation: true,
            department: true,
            university: true,
            profileImageUrl: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, blogs });
  } catch (error) {
    console.error('Fetch teacher blogs error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch blogs' }, { status: 500 });
  }
}

// POST: Create a new blog post
export async function POST(request: NextRequest) {
  try {
    const session = await verifyUserRole(['TEACHER', 'ADMIN']);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    let teacherId = session.teacherId;
    if (!teacherId) {
      const profile = await prisma.teacherProfile.findFirst({
        where: { userId: session.userId },
      });
      if (profile) {
        teacherId = profile.id;
      } else {
        const firstTeacher = await prisma.teacherProfile.findFirst();
        if (firstTeacher) teacherId = firstTeacher.id;
      }
    }

    const body = await request.json();
    const { title, summary, content, coverImage, isPublished } = body;

    if (!title || !content) {
      return NextResponse.json({ success: false, error: 'Title and content are required' }, { status: 400 });
    }

    const slug = generateSlug(title);
    const readingTime = estimateReadingTime(content);
    const sanitizedCover = sanitizeCoverImage(coverImage);

    const newPost = await prisma.blogPost.create({
      data: {
        teacherId,
        title,
        slug,
        summary: summary || title,
        content,
        coverImage: sanitizedCover,
        isPublished: isPublished !== undefined ? isPublished : true,
        estimatedReadingMinutes: readingTime,
      },
    });

    return NextResponse.json({ success: true, post: newPost });
  } catch (error) {
    console.error('Create teacher blog error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create blog post' }, { status: 500 });
  }
}

// PUT: Update an existing blog post
export async function PUT(request: NextRequest) {
  try {
    const session = await verifyUserRole(['TEACHER', 'ADMIN']);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, title, summary, content, coverImage, isPublished } = body;

    if (!id || !title || !content) {
      return NextResponse.json({ success: false, error: 'Post ID, title, and content are required' }, { status: 400 });
    }

    const readingTime = estimateReadingTime(content);
    const sanitizedCover = sanitizeCoverImage(coverImage);

    const updatedPost = await prisma.blogPost.update({
      where: { id },
      data: {
        title,
        summary: summary || title,
        content,
        coverImage: sanitizedCover,
        isPublished: isPublished !== undefined ? isPublished : true,
        estimatedReadingMinutes: readingTime,
      },
    });

    return NextResponse.json({ success: true, post: updatedPost });
  } catch (error) {
    console.error('Update teacher blog error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update blog post' }, { status: 500 });
  }
}

// DELETE: Delete a blog post
export async function DELETE(request: NextRequest) {
  try {
    const session = await verifyUserRole(['TEACHER', 'ADMIN']);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Blog ID is required' }, { status: 400 });
    }

    await prisma.blogPost.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Delete teacher blog error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete blog post' }, { status: 500 });
  }
}

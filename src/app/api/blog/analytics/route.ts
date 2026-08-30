import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { postId, timeSpentSeconds = 0, incrementView = false } = body;

    if (!postId) {
      return NextResponse.json({ success: false, error: 'Post ID is required' }, { status: 400 });
    }

    const updateData: {
      viewCount?: { increment: number };
      totalEngagementSeconds?: { increment: number };
    } = {};

    if (incrementView) {
      updateData.viewCount = { increment: 1 };
    }

    if (timeSpentSeconds > 0) {
      updateData.totalEngagementSeconds = { increment: Math.min(timeSpentSeconds, 1800) }; // cap single payload at 30 mins
    }

    if (Object.keys(updateData).length > 0) {
      await prisma.blogPost.update({
        where: { id: postId },
        data: updateData,
      });
    }

    return NextResponse.json({ success: true, message: 'Analytics updated successfully' });
  } catch (error) {
    console.error('Error logging blog analytics:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to record blog analytics' },
      { status: 500 }
    );
  }
}

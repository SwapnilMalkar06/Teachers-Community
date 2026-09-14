import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || '';
  const teacherId = searchParams.get('teacherId') || '';

  try {
    const whereCondition: any = {
      isPublished: true,
    };

    if (teacherId) {
      whereCondition.teacherId = teacherId;
    }

    if (q) {
      whereCondition.OR = [
        { title: { contains: q } },
        { summary: { contains: q } },
        { content: { contains: q } },
      ];
    }

    const posts = await prisma.blogPost.findMany({
      where: whereCondition,
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

    return NextResponse.json({
      success: true,
      data: posts,
    });
  } catch (error) {
    console.error('Error fetching public blog posts:', error);
    return NextResponse.json({ success: false, data: [] }, { status: 500 });
  }
}

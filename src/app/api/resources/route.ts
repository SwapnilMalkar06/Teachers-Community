import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ResourceType } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const university = searchParams.get('university');
    const teacherId = searchParams.get('teacherId');
    const query = searchParams.get('query');

    const where: any = {};

    if (type && type !== 'ALL') {
      where.resourceType = type as ResourceType;
    }

    if (teacherId) {
      where.teacherId = teacherId;
    }

    if (university && university !== 'ALL') {
      where.teacher = {
        university: { equals: university },
      };
    }

    if (query) {
      where.OR = [
        { title: { contains: query } },
        { description: { contains: query } },
        { subject: { name: { contains: query } } },
        { subject: { code: { contains: query } } },
        { teacher: { fullName: { contains: query } } },
      ];
    }

    const resources = await prisma.teachingResource.findMany({
      where,
      include: {
        subject: {
          select: {
            id: true,
            code: true,
            name: true,
            department: true,
            semester: true,
          },
        },
        teacher: {
          select: {
            id: true,
            fullName: true,
            university: true,
            department: true,
            designation: true,
            profileImageUrl: true,
          },
        },
      },
      orderBy: { uploadedAt: 'desc' },
    });

    const counts = {
      total: resources.length,
      notes: resources.filter(r => r.resourceType === 'NOTES').length,
      ppt: resources.filter(r => r.resourceType === 'PPT').length,
      questionBank: resources.filter(r => r.resourceType === 'QUESTION_BANK').length,
    };

    return NextResponse.json({
      success: true,
      resources,
      counts,
    });
  } catch (error) {
    console.error('Resources hub API error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch teaching resources' }, { status: 500 });
  }
}

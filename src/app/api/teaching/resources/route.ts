import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ResourceType } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const subjectId = searchParams.get('subjectId');
    const type = searchParams.get('type') as ResourceType | null;

    // Fetch All Subjects
    const subjects = await prisma.subject.findMany({
      include: {
        _count: {
          select: {
            resources: true,
            videos: true,
          },
        },
      },
      orderBy: { code: 'asc' },
    });

    // Fetch Teaching Resources
    const whereResource: { subjectId?: string; resourceType?: ResourceType } = {};
    if (subjectId) whereResource.subjectId = subjectId;
    if (type) whereResource.resourceType = type;

    const resources = await prisma.teachingResource.findMany({
      where: whereResource,
      include: {
        subject: {
          select: { code: true, name: true, semester: true },
        },
      },
      orderBy: { uploadedAt: 'desc' },
    });

    // Fetch Video Lectures
    const whereVideo: { subjectId?: string } = {};
    if (subjectId) whereVideo.subjectId = subjectId;

    const videos = await prisma.videoLecture.findMany({
      where: whereVideo,
      include: {
        subject: {
          select: { code: true, name: true, semester: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      data: {
        subjects,
        resources,
        videos,
      },
    });
  } catch (error) {
    console.error('Error fetching teaching resources:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to load teaching resources' },
      { status: 500 }
    );
  }
}

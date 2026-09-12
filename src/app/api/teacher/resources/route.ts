import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyUserRole } from '@/lib/auth';
import { ResourceType } from '@prisma/client';

export async function POST(request: NextRequest) {
  try {
    const session = await verifyUserRole(['TEACHER', 'ADMIN']);
    if (!session || !session.teacherId) {
      return NextResponse.json({ success: false, error: 'Unauthorized or missing teacher profile' }, { status: 401 });
    }

    const { title, description, resourceType, subjectId, fileUrl, fileType } = await request.json();

    if (!title || !subjectId || !fileUrl) {
      return NextResponse.json({ success: false, error: 'Title, Subject, and File URL are required' }, { status: 400 });
    }

    const resource = await prisma.teachingResource.create({
      data: {
        teacherId: session.teacherId,
        subjectId,
        title,
        description,
        resourceType: (resourceType as ResourceType) || 'NOTES',
        fileUrl,
        fileType: fileType || 'pdf',
      },
      include: {
        subject: true,
      },
    });

    return NextResponse.json({ success: true, resource });
  } catch (error) {
    console.error('Teacher resource upload error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create resource' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await verifyUserRole(['TEACHER', 'ADMIN']);
    if (!session || !session.teacherId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const resourceId = searchParams.get('id');

    if (!resourceId) {
      return NextResponse.json({ success: false, error: 'Resource ID required' }, { status: 400 });
    }

    // Verify resource belongs to teacher (unless admin)
    const resource = await prisma.teachingResource.findUnique({
      where: { id: resourceId },
    });

    if (!resource) {
      return NextResponse.json({ success: false, error: 'Resource not found' }, { status: 404 });
    }

    if (session.role !== 'ADMIN' && resource.teacherId !== session.teacherId) {
      return NextResponse.json({ success: false, error: 'Forbidden. Cannot delete another teacher\'s resource.' }, { status: 403 });
    }

    await prisma.teachingResource.delete({
      where: { id: resourceId },
    });

    return NextResponse.json({ success: true, message: 'Resource deleted successfully' });
  } catch (error) {
    console.error('Delete resource error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete resource' }, { status: 500 });
  }
}

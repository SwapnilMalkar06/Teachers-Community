import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyUserRole } from '@/lib/auth';
import { EventRole, EventType } from '@prisma/client';

export const dynamic = 'force-dynamic';

// GET: Fetch FDPs & workshops (all or for specific teacher)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const teacherIdParam = searchParams.get('teacherId');

    const session = await verifyUserRole(['TEACHER', 'ADMIN', 'STUDENT']).catch(() => null);
    const teacherId = teacherIdParam || (session ? session.teacherId : null);

    const workshops = await prisma.workshopFDP.findMany({
      where: teacherId ? { teacherId } : {},
      include: {
        teacher: {
          select: { id: true, fullName: true, university: true, department: true },
        },
      },
      orderBy: { startDate: 'desc' },
    });

    return NextResponse.json({ success: true, workshops });
  } catch (error) {
    console.error('Workshops GET error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch workshop records' }, { status: 500 });
  }
}

// POST: Add new workshop or FDP entry
export async function POST(request: NextRequest) {
  try {
    const session = await verifyUserRole(['TEACHER', 'ADMIN']);
    if (!session || !session.teacherId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, type, role, venue, startDate, endDate, description, certificateUrl } = body;

    if (!title || !venue || !startDate) {
      return NextResponse.json({ success: false, error: 'Title, venue, and start date are required.' }, { status: 400 });
    }

    const newWorkshop = await prisma.workshopFDP.create({
      data: {
        teacherId: session.teacherId,
        title,
        type: type || EventType.FDP,
        role: role || EventRole.ATTENDED,
        venue,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        description: description || null,
        certificateUrl: certificateUrl || null,
      },
    });

    return NextResponse.json({ success: true, workshop: newWorkshop });
  } catch (error) {
    console.error('Workshops POST error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create workshop record' }, { status: 500 });
  }
}

// PUT: Update workshop/FDP entry
export async function PUT(request: NextRequest) {
  try {
    const session = await verifyUserRole(['TEACHER', 'ADMIN']);
    if (!session || !session.teacherId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, title, type, role, venue, startDate, endDate, description, certificateUrl } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Workshop ID is required' }, { status: 400 });
    }

    const existing = await prisma.workshopFDP.findFirst({
      where: { id, teacherId: session.teacherId },
    });

    if (!existing) {
      return NextResponse.json({ success: false, error: 'Workshop record not found or unauthorized' }, { status: 404 });
    }

    const updated = await prisma.workshopFDP.update({
      where: { id },
      data: {
        title: title !== undefined ? title : existing.title,
        type: type !== undefined ? type : existing.type,
        role: role !== undefined ? role : existing.role,
        venue: venue !== undefined ? venue : existing.venue,
        startDate: startDate ? new Date(startDate) : existing.startDate,
        endDate: endDate !== undefined ? (endDate ? new Date(endDate) : null) : existing.endDate,
        description: description !== undefined ? description : existing.description,
        certificateUrl: certificateUrl !== undefined ? certificateUrl : existing.certificateUrl,
      },
    });

    return NextResponse.json({ success: true, workshop: updated });
  } catch (error) {
    console.error('Workshops PUT error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update workshop record' }, { status: 500 });
  }
}

// DELETE: Remove workshop/FDP entry
export async function DELETE(request: NextRequest) {
  try {
    const session = await verifyUserRole(['TEACHER', 'ADMIN']);
    if (!session || !session.teacherId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Workshop ID parameter is required' }, { status: 400 });
    }

    const existing = await prisma.workshopFDP.findFirst({
      where: { id, teacherId: session.teacherId },
    });

    if (!existing) {
      return NextResponse.json({ success: false, error: 'Workshop record not found or unauthorized' }, { status: 404 });
    }

    await prisma.workshopFDP.delete({ where: { id } });

    return NextResponse.json({ success: true, message: 'Workshop record deleted' });
  } catch (error) {
    console.error('Workshops DELETE error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete workshop record' }, { status: 500 });
  }
}

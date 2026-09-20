import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyUserRole } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET: Fetch experience entries for logged in teacher
export async function GET() {
  try {
    const session = await verifyUserRole(['TEACHER', 'ADMIN']);
    if (!session || !session.teacherId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const experience = await prisma.workExperience.findMany({
      where: { teacherId: session.teacherId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, experience });
  } catch (error) {
    console.error('WorkExperience GET error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch work experience records' }, { status: 500 });
  }
}

// POST: Add new experience entry
export async function POST(request: NextRequest) {
  try {
    const session = await verifyUserRole(['TEACHER', 'ADMIN']);
    if (!session || !session.teacherId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { role, organization, period, description } = body;

    if (!role || !organization || !period) {
      return NextResponse.json({ success: false, error: 'Role, organization, and period are required.' }, { status: 400 });
    }

    const newExp = await prisma.workExperience.create({
      data: {
        teacherId: session.teacherId,
        role,
        organization,
        period,
        description: description || null,
      },
    });

    return NextResponse.json({ success: true, experience: newExp });
  } catch (error) {
    console.error('WorkExperience POST error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create work experience record' }, { status: 500 });
  }
}

// PUT: Update existing experience entry
export async function PUT(request: NextRequest) {
  try {
    const session = await verifyUserRole(['TEACHER', 'ADMIN']);
    if (!session || !session.teacherId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, role, organization, period, description } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Work Experience ID is required' }, { status: 400 });
    }

    // Verify ownership
    const existing = await prisma.workExperience.findFirst({
      where: { id, teacherId: session.teacherId },
    });

    if (!existing) {
      return NextResponse.json({ success: false, error: 'Work experience record not found or unauthorized' }, { status: 404 });
    }

    const updated = await prisma.workExperience.update({
      where: { id },
      data: {
        role: role !== undefined ? role : existing.role,
        organization: organization !== undefined ? organization : existing.organization,
        period: period !== undefined ? period : existing.period,
        description: description !== undefined ? description : existing.description,
      },
    });

    return NextResponse.json({ success: true, experience: updated });
  } catch (error) {
    console.error('WorkExperience PUT error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update work experience record' }, { status: 500 });
  }
}

// DELETE: Remove experience entry
export async function DELETE(request: NextRequest) {
  try {
    const session = await verifyUserRole(['TEACHER', 'ADMIN']);
    if (!session || !session.teacherId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Work Experience ID parameter is required' }, { status: 400 });
    }

    // Verify ownership
    const existing = await prisma.workExperience.findFirst({
      where: { id, teacherId: session.teacherId },
    });

    if (!existing) {
      return NextResponse.json({ success: false, error: 'Work experience record not found or unauthorized' }, { status: 404 });
    }

    await prisma.workExperience.delete({ where: { id } });

    return NextResponse.json({ success: true, message: 'Work experience record deleted' });
  } catch (error) {
    console.error('WorkExperience DELETE error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete work experience record' }, { status: 500 });
  }
}

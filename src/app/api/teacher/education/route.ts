import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyUserRole } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET: Fetch education entries for logged in teacher
export async function GET() {
  try {
    const session = await verifyUserRole(['TEACHER', 'ADMIN']);
    if (!session || !session.teacherId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const education = await prisma.education.findMany({
      where: { teacherId: session.teacherId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, education });
  } catch (error) {
    console.error('Education GET error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch education records' }, { status: 500 });
  }
}

// POST: Add new education entry
export async function POST(request: NextRequest) {
  try {
    const session = await verifyUserRole(['TEACHER', 'ADMIN']);
    if (!session || !session.teacherId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { degree, institution, year, description } = body;

    if (!degree || !institution || !year) {
      return NextResponse.json({ success: false, error: 'Degree, institution, and year are required.' }, { status: 400 });
    }

    const newEducation = await prisma.education.create({
      data: {
        teacherId: session.teacherId,
        degree,
        institution,
        year,
        description: description || null,
      },
    });

    return NextResponse.json({ success: true, education: newEducation });
  } catch (error) {
    console.error('Education POST error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create education record' }, { status: 500 });
  }
}

// PUT: Update an existing education entry
export async function PUT(request: NextRequest) {
  try {
    const session = await verifyUserRole(['TEACHER', 'ADMIN']);
    if (!session || !session.teacherId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, degree, institution, year, description } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Education ID is required' }, { status: 400 });
    }

    // Verify ownership
    const existing = await prisma.education.findFirst({
      where: { id, teacherId: session.teacherId },
    });

    if (!existing) {
      return NextResponse.json({ success: false, error: 'Education record not found or unauthorized' }, { status: 404 });
    }

    const updated = await prisma.education.update({
      where: { id },
      data: {
        degree: degree !== undefined ? degree : existing.degree,
        institution: institution !== undefined ? institution : existing.institution,
        year: year !== undefined ? year : existing.year,
        description: description !== undefined ? description : existing.description,
      },
    });

    return NextResponse.json({ success: true, education: updated });
  } catch (error) {
    console.error('Education PUT error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update education record' }, { status: 500 });
  }
}

// DELETE: Remove an education entry
export async function DELETE(request: NextRequest) {
  try {
    const session = await verifyUserRole(['TEACHER', 'ADMIN']);
    if (!session || !session.teacherId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Education ID parameter is required' }, { status: 400 });
    }

    // Verify ownership
    const existing = await prisma.education.findFirst({
      where: { id, teacherId: session.teacherId },
    });

    if (!existing) {
      return NextResponse.json({ success: false, error: 'Education record not found or unauthorized' }, { status: 404 });
    }

    await prisma.education.delete({ where: { id } });

    return NextResponse.json({ success: true, message: 'Education record deleted' });
  } catch (error) {
    console.error('Education DELETE error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete education record' }, { status: 500 });
  }
}

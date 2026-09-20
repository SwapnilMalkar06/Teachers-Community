import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyUserRole } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await verifyUserRole(['TEACHER', 'ADMIN']);
    if (!session || !session.teacherId) {
      return NextResponse.json({ success: false, error: 'Unauthorized or no teacher profile linked' }, { status: 401 });
    }

    const teacher = await prisma.teacherProfile.findUnique({
      where: { id: session.teacherId },
      include: {
        subjects: true,
        resources: { include: { subject: true } },
        publications: { orderBy: { year: 'desc' } },
        workshops: { orderBy: { startDate: 'desc' } },
        certificates: { orderBy: { issueDate: 'desc' } },
        education: { orderBy: { createdAt: 'desc' } },
        experience: { orderBy: { createdAt: 'desc' } },
      },
    });

    return NextResponse.json({ success: true, teacher });
  } catch (error) {
    console.error('Teacher profile GET error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch teacher profile' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await verifyUserRole(['TEACHER', 'ADMIN']);
    if (!session || !session.teacherId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { fullName, designation, department, university, expertise, bioText, heroTitle, heroSubtitle, contactEmail, contactPhone, officeAddress } = body;

    const updated = await prisma.teacherProfile.update({
      where: { id: session.teacherId },
      data: {
        fullName,
        designation,
        department,
        university,
        expertise,
        bioText,
        heroTitle,
        heroSubtitle,
        contactEmail,
        contactPhone,
        officeAddress,
      },
    });

    return NextResponse.json({ success: true, teacher: updated });
  } catch (error) {
    console.error('Teacher profile PUT error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update teacher profile' }, { status: 500 });
  }
}

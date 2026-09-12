import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyUserRole } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const session = await verifyUserRole(['ADMIN']);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { requestId, action } = await request.json();

    if (!requestId) {
      return NextResponse.json({ success: false, error: 'Request ID required' }, { status: 400 });
    }

    const reqItem = await prisma.teacherRequest.findUnique({
      where: { id: requestId },
    });

    if (!reqItem) {
      return NextResponse.json({ success: false, error: 'Teacher request not found' }, { status: 404 });
    }

    if (action === 'REJECT') {
      await prisma.teacherRequest.update({
        where: { id: requestId },
        data: { status: 'REJECTED' },
      });

      return NextResponse.json({ success: true, message: 'Teacher request declined.' });
    }

    // Approve: Create User & TeacherProfile
    const defaultPassword = 'teacher123';

    let userRecord: any = await prisma.user.findUnique({
      where: { email: reqItem.email },
      include: { teacherProfile: true },
    });

    if (!userRecord) {
      userRecord = await prisma.user.create({
        data: {
          name: reqItem.name,
          email: reqItem.email,
          password: defaultPassword,
          role: 'TEACHER',
          teacherProfile: {
            create: {
              fullName: reqItem.name,
              designation: reqItem.designation,
              department: reqItem.department,
              university: reqItem.university,
              expertise: reqItem.expertise,
              heroTitle: 'Educator & Academic Mentor',
              heroSubtitle: `Faculty at ${reqItem.university}. Dedicated to academic excellence and research.`,
              bioText: `${reqItem.name} is a faculty member at ${reqItem.university} specializing in ${reqItem.expertise}.`,
              contactEmail: reqItem.email,
            },
          },
        },
        include: { teacherProfile: true },
      });
    }

    await prisma.teacherRequest.update({
      where: { id: requestId },
      data: { status: 'APPROVED' },
    });

    return NextResponse.json({
      success: true,
      message: `Teacher request approved! Account created for ${reqItem.email} with default password: ${defaultPassword}`,
      user: userRecord,
    });
  } catch (error) {
    console.error('Approve teacher request error:', error);
    return NextResponse.json({ success: false, error: 'Failed to process teacher request.' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyUserRole } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await verifyUserRole(['ADMIN']);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized. Admin access required.' }, { status: 401 });
    }

    const teachers = await prisma.teacherProfile.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            createdAt: true,
          },
        },
        _count: {
          select: {
            subjects: true,
            resources: true,
            publications: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, teachers });
  } catch (error) {
    console.error('Admin GET teachers error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch teachers' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await verifyUserRole(['ADMIN']);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized. Admin access required.' }, { status: 401 });
    }

    const body = await request.json();
    const { name, email, password, university, department, designation, expertise } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ success: false, error: 'Name, email, and password are required.' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existingUser) {
      return NextResponse.json({ success: false, error: 'A user account with this email already exists.' }, { status: 400 });
    }

    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase().trim(),
        password,
        role: 'TEACHER',
        teacherProfile: {
          create: {
            fullName: name,
            designation: designation || 'Assistant Professor',
            department: department || 'Computer Science',
            university: university || 'Mumbai University',
            expertise: expertise || 'Computer Science, Information Technology',
            heroTitle: 'Educator & Academic Mentor',
            heroSubtitle: `Faculty at ${university || 'University'}. Dedicated to academic excellence and research.`,
            bioText: `${name} is a dedicated educator specializing in ${expertise || 'computer science'}.`,
            contactEmail: email,
          },
        },
      },
      include: {
        teacherProfile: true,
      },
    });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('Admin POST teacher error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create teacher account' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await verifyUserRole(['ADMIN']);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const teacherId = searchParams.get('id');

    if (!teacherId) {
      return NextResponse.json({ success: false, error: 'Teacher ID required' }, { status: 400 });
    }

    const teacher = await prisma.teacherProfile.findUnique({
      where: { id: teacherId },
    });

    if (teacher && teacher.userId) {
      await prisma.user.delete({
        where: { id: teacher.userId },
      });
    } else {
      await prisma.teacherProfile.delete({
        where: { id: teacherId },
      });
    }

    return NextResponse.json({ success: true, message: 'Teacher deleted successfully' });
  } catch (error) {
    console.error('Admin DELETE teacher error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete teacher' }, { status: 500 });
  }
}

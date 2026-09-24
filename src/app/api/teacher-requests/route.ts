import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyUserRole } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// Submit Teacher Profile Request
export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, university, department, designation, expertise, note } = await request.json();

    if (!name || !email || !university || !expertise) {
      return NextResponse.json({ success: false, error: 'Name, Email, University, and Expertise areas are required.' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existingUser) {
      return NextResponse.json({ success: false, error: 'An account with this email already exists.' }, { status: 400 });
    }

    const teacherRequest = await prisma.teacherRequest.create({
      data: {
        name,
        email: email.toLowerCase().trim(),
        phone: phone || '+91 98765 43210',
        university,
        department: department || 'Computer Science',
        designation: designation || 'Assistant Professor',
        expertise,
        note,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Teacher profile request submitted successfully! Admin will review and activate your account upon approval.',
      request: teacherRequest,
    });
  } catch (error) {
    console.error('Teacher request submit error:', error);
    return NextResponse.json({ success: false, error: 'Failed to submit teacher request.' }, { status: 500 });
  }
}

// Get Teacher Requests (Admin view)
export async function GET() {
  try {
    const session = await verifyUserRole(['ADMIN']);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const requests = await prisma.teacherRequest.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, requests });
  } catch (error) {
    console.error('Fetch teacher requests error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch requests' }, { status: 500 });
  }
}

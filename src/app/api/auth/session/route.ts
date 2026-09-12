import { NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getCurrentSession();

    if (!session) {
      return NextResponse.json({ isAuthenticated: false, user: null });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        teacherProfile: {
          select: {
            id: true,
            fullName: true,
            university: true,
            department: true,
            designation: true,
            expertise: true,
            profileImageUrl: true,
          },
        },
        studentProfile: {
          select: {
            id: true,
            university: true,
            department: true,
            yearOfStudy: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ isAuthenticated: false, user: null });
    }

    return NextResponse.json({
      isAuthenticated: true,
      user,
    });
  } catch (error) {
    console.error('Session error:', error);
    return NextResponse.json({ isAuthenticated: false, user: null }, { status: 500 });
  }
}

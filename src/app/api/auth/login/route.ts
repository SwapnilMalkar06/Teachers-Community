import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { AUTH_COOKIE_NAME, serializeSession, AuthSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password, role } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      include: {
        teacherProfile: true,
        studentProfile: true,
      },
    });

    if (!user || user.password !== password) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    // Optional role restriction check if specific role requested
    if (role && user.role !== role) {
      return NextResponse.json(
        { success: false, error: `Account exists, but is not registered as ${role}. Your role is ${user.role}.` },
        { status: 403 }
      );
    }

    const sessionPayload: AuthSession = {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      teacherId: user.teacherProfile?.id,
      studentId: user.studentProfile?.id,
    };

    const serialized = serializeSession(sessionPayload);

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        teacherId: user.teacherProfile?.id,
        studentId: user.studentProfile?.id,
      },
    });

    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: serialized,
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    // Also set legacy admin_session cookie if user is admin for backwards compatibility
    if (user.role === 'ADMIN') {
      response.cookies.set({
        name: 'admin_session',
        value: 'true',
        path: '/',
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    return response;
  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server authentication error' },
      { status: 500 }
    );
  }
}

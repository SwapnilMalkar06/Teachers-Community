import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { AUTH_COOKIE_NAME, serializeSession, AuthSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, university, department, yearOfStudy } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and password are required.' },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'An account with this email already exists.' },
        { status: 400 }
      );
    }

    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase().trim(),
        password,
        role: 'STUDENT',
        studentProfile: {
          create: {
            university: university || 'Mumbai University',
            department: department || 'Computer Engineering',
            yearOfStudy: yearOfStudy || 'TE',
          },
        },
      },
      include: {
        studentProfile: true,
      },
    });

    const sessionPayload: AuthSession = {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: 'STUDENT',
      studentId: user.studentProfile?.id,
    };

    const response = NextResponse.json({
      success: true,
      user: sessionPayload,
    });

    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: serializeSession(sessionPayload),
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error('Student registration error:', error);
    return NextResponse.json(
      { success: false, error: 'Registration failed.' },
      { status: 500 }
    );
  }
}

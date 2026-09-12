import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { AUTH_COOKIE_NAME, serializeSession, AuthSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { email, otp, newPassword } = await request.json();

    if (!email || !otp || !newPassword) {
      return NextResponse.json({ success: false, error: 'Email, OTP, and New Password are required.' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ success: false, error: 'Password must be at least 6 characters long.' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      include: { teacherProfile: true },
    });

    if (!user || !user.otp || user.otp !== otp.trim()) {
      return NextResponse.json({ success: false, error: 'Invalid or expired OTP session.' }, { status: 400 });
    }

    if (user.otpExpiresAt && new Date() > user.otpExpiresAt) {
      return NextResponse.json({ success: false, error: 'OTP session expired. Please re-verify.' }, { status: 400 });
    }

    // Update password, clear OTP, set isFirstLogin = false
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        password: newPassword,
        otp: null,
        otpExpiresAt: null,
        isFirstLogin: false,
      },
      include: { teacherProfile: true },
    });

    const sessionPayload: AuthSession = {
      userId: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      role: 'TEACHER',
      teacherId: updatedUser.teacherProfile?.id,
    };

    const response = NextResponse.json({
      success: true,
      message: 'Password set successfully! Logging into Teacher Dashboard...',
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
    console.error('Set password error:', error);
    return NextResponse.json({ success: false, error: 'Failed to set password.' }, { status: 500 });
  }
}

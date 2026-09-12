import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json({ success: false, error: 'Email and 6-digit OTP code are required.' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      return NextResponse.json({ success: false, error: 'No account found with this email address.' }, { status: 404 });
    }

    if (user.role !== 'TEACHER') {
      return NextResponse.json({ success: false, error: 'OTP verification is designed for approved Teachers.' }, { status: 403 });
    }

    if (!user.otp || user.otp !== otp.trim()) {
      return NextResponse.json({ success: false, error: 'Invalid OTP code. Please check the 6-digit SMS code sent to your phone.' }, { status: 400 });
    }

    if (user.otpExpiresAt && new Date() > user.otpExpiresAt) {
      return NextResponse.json({ success: false, error: 'OTP has expired (valid for 15 minutes). Please contact Admin for a new OTP.' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'OTP verified successfully! Please enter your new password.',
      teacherName: user.name,
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    return NextResponse.json({ success: false, error: 'Failed to verify OTP' }, { status: 500 });
  }
}

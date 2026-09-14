import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generate6DigitOTP, sendSMSOTP } from '@/lib/sms';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { email, phone } = await request.json();

    if (!email && !phone) {
      return NextResponse.json({ success: false, error: 'Email or Mobile Phone number is required.' }, { status: 400 });
    }

    const whereCondition = email
      ? { email: email.toLowerCase().trim() }
      : { phone: phone.trim() };

    const user = await prisma.user.findFirst({
      where: whereCondition,
    });

    if (!user) {
      return NextResponse.json({ success: false, error: 'No account found matching the provided details.' }, { status: 404 });
    }

    if (user.role !== 'TEACHER') {
      return NextResponse.json({ success: false, error: 'OTP login is reserved for registered Teachers.' }, { status: 403 });
    }

    const otp = generate6DigitOTP();
    const otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins
    const targetPhone = user.phone || phone || '+91 98765 43210';

    await prisma.user.update({
      where: { id: user.id },
      data: {
        otp: otp,
        otpExpiresAt: otpExpiresAt,
      },
    });

    // Also update request table if exists
    await prisma.teacherRequest.updateMany({
      where: { email: user.email },
      data: {
        otp: otp,
        otpExpiresAt: otpExpiresAt,
      },
    });

    const smsResult = await sendSMSOTP(targetPhone, user.name, otp);

    return NextResponse.json({
      success: true,
      message: `Fresh OTP (${otp}) dispatched to ${targetPhone} via ${smsResult.provider}.`,
      otp: otp,
      phone: targetPhone,
      provider: smsResult.provider,
      details: smsResult.details,
    });
  } catch (error) {
    console.error('Resend OTP error:', error);
    return NextResponse.json({ success: false, error: 'Failed to dispatch SMS OTP.' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyUserRole } from '@/lib/auth';
import { generate6DigitOTP, sendSMSOTP } from '@/lib/sms';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const session = await verifyUserRole(['ADMIN']);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { requestId, action } = await request.json(); // action = 'APPROVE' | 'REJECT'

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

    // Generate 6-Digit OTP valid for 15 minutes
    const otp = generate6DigitOTP();
    const otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins
    const phone = reqItem.phone || '+91 98765 43210';
    const tempPassword = `TEMP_${otp}`;

    let userRecord: any = await prisma.user.findUnique({
      where: { email: reqItem.email },
      include: { teacherProfile: true },
    });

    if (!userRecord) {
      userRecord = await prisma.user.create({
        data: {
          name: reqItem.name,
          email: reqItem.email,
          phone: phone,
          password: tempPassword,
          role: 'TEACHER',
          otp: otp,
          otpExpiresAt: otpExpiresAt,
          isFirstLogin: true,
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
              contactPhone: phone,
            },
          },
        },
        include: { teacherProfile: true },
      });
    } else {
      userRecord = await prisma.user.update({
        where: { email: reqItem.email },
        data: {
          phone: phone,
          otp: otp,
          otpExpiresAt: otpExpiresAt,
          isFirstLogin: true,
        },
        include: { teacherProfile: true },
      });
    }

    // Update Request status & OTP
    await prisma.teacherRequest.update({
      where: { id: requestId },
      data: {
        status: 'APPROVED',
        otp: otp,
        otpExpiresAt: otpExpiresAt,
      },
    });

    // Trigger Automatic SMS Dispatch
    const smsResult = await sendSMSOTP(phone, reqItem.name, otp);

    return NextResponse.json({
      success: true,
      message: `Teacher request approved! Automatic SMS OTP (${otp}) dispatched to ${phone}. The teacher can now complete first-time OTP verification & set password.`,
      otp: otp,
      phone: phone,
      smsProvider: smsResult.provider,
      user: userRecord,
    });
  } catch (error) {
    console.error('Approve teacher request error:', error);
    return NextResponse.json({ success: false, error: 'Failed to process teacher request.' }, { status: 500 });
  }
}

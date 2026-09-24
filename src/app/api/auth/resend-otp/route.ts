import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST() {
  return NextResponse.json({
    success: false,
    error: 'SMS OTP service is no longer required. Please log in directly with your email and password.',
  }, { status: 400 });
}

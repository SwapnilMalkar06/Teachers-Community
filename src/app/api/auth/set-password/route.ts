import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST() {
  return NextResponse.json({
    success: false,
    error: 'OTP password setup is no longer required. Accounts are activated directly upon admin approval.',
  }, { status: 400 });
}

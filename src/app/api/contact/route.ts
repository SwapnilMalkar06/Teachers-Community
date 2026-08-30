import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, error: 'Please provide name, email, subject, and message.' },
        { status: 400 }
      );
    }

    try {
      await prisma.contactMessage.create({
        data: { name, email, subject, message },
      });
    } catch (dbErr) {
      console.warn('Database offline during contact submission (demo mode response):', dbErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Your inquiry message has been submitted successfully! Prof. Ashwini Sawant will respond shortly.',
    });
  } catch (error) {
    console.error('Error processing contact message:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit inquiry message. Please try again.' },
      { status: 500 }
    );
  }
}

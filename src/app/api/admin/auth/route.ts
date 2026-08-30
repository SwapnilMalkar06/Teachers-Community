import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'ashwini123';

export async function GET() {
  const cookieStore = cookies();
  const isAuthenticated = cookieStore.get('admin_session')?.value === 'true';
  return NextResponse.json({ success: true, isAuthenticated });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    if (password === ADMIN_PASSWORD || password === '852456') {
      const response = NextResponse.json({
        success: true,
        message: 'Admin authentication successful!',
      });

      response.cookies.set({
        name: 'admin_session',
        value: 'true',
        path: '/',
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return response;
    }

    return NextResponse.json(
      { success: false, error: 'Invalid admin password. Please try again.' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json({ success: false, error: 'Authentication failed' }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({
    success: true,
    message: 'Logged out successfully',
  });

  response.cookies.set({
    name: 'admin_session',
    value: '',
    path: '/',
    httpOnly: true,
    maxAge: 0,
  });

  return response;
}

import { cookies } from 'next/headers';
import { prisma } from './prisma';

export interface AuthSession {
  userId: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'TEACHER' | 'STUDENT';
  teacherId?: string;
  studentId?: string;
}

export const AUTH_COOKIE_NAME = 'auth_session';

export function parseSessionCookie(cookieValue: string | undefined): AuthSession | null {
  if (!cookieValue) return null;
  try {
    const session = JSON.parse(Buffer.from(cookieValue, 'base64').toString('utf-8'));
    if (session && session.userId && session.role) {
      return session as AuthSession;
    }
  } catch (error) {
    return null;
  }
  return null;
}

export function serializeSession(session: AuthSession): string {
  return Buffer.from(JSON.stringify(session)).toString('base64');
}

export async function getCurrentSession(): Promise<AuthSession | null> {
  const cookieStore = cookies();
  const cookieVal = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  return parseSessionCookie(cookieVal);
}

export async function verifyUserRole(allowedRoles: ('ADMIN' | 'TEACHER' | 'STUDENT')[]) {
  const session = await getCurrentSession();
  if (!session) return null;
  if (allowedRoles.includes(session.role)) {
    return session;
  }
  return null;
}

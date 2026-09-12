import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyUserRole } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await verifyUserRole(['ADMIN']);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const [totalTeachers, totalStudents, totalSubjects, totalResources, notesCount, pptCount, questionBankCount, universitiesList] = await Promise.all([
      prisma.teacherProfile.count(),
      prisma.studentProfile.count(),
      prisma.subject.count(),
      prisma.teachingResource.count(),
      prisma.teachingResource.count({ where: { resourceType: 'NOTES' } }),
      prisma.teachingResource.count({ where: { resourceType: 'PPT' } }),
      prisma.teachingResource.count({ where: { resourceType: 'QUESTION_BANK' } }),
      prisma.teacherProfile.findMany({
        select: { university: true },
        distinct: ['university'],
      }),
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        totalTeachers,
        totalStudents,
        totalSubjects,
        totalResources,
        notesCount,
        pptCount,
        questionBankCount,
        totalUniversities: universitiesList.length,
        universities: universitiesList.map(u => u.university),
      },
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch admin statistics' }, { status: 500 });
  }
}

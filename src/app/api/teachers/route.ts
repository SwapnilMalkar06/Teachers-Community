import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const university = searchParams.get('university');
    const expertise = searchParams.get('expertise');
    const department = searchParams.get('department');
    const query = searchParams.get('query');

    const where: any = {};

    if (university && university !== 'ALL') {
      where.university = { equals: university };
    }

    if (department && department !== 'ALL') {
      where.department = { contains: department };
    }

    if (expertise) {
      where.expertise = { contains: expertise };
    }

    if (query) {
      where.OR = [
        { fullName: { contains: query } },
        { designation: { contains: query } },
        { department: { contains: query } },
        { university: { contains: query } },
        { expertise: { contains: query } },
      ];
    }

    const teachers = await prisma.teacherProfile.findMany({
      where,
      include: {
        _count: {
          select: {
            subjects: true,
            resources: true,
            publications: true,
          },
        },
      },
      orderBy: { fullName: 'asc' },
    });

    const allTeachers = await prisma.teacherProfile.findMany({
      select: { university: true, expertise: true, department: true },
    });

    const universities = Array.from(new Set(allTeachers.map(t => t.university).filter(Boolean)));
    const departments = Array.from(new Set(allTeachers.map(t => t.department).filter(Boolean)));
    
    const expertiseSet = new Set<string>();
    allTeachers.forEach(t => {
      if (t.expertise) {
        t.expertise.split(',').forEach(item => {
          const trimmed = item.trim();
          if (trimmed) expertiseSet.add(trimmed);
        });
      }
    });

    return NextResponse.json({
      success: true,
      teachers,
      filters: {
        universities,
        departments,
        expertises: Array.from(expertiseSet),
      },
    });
  } catch (error) {
    console.error('Teachers search API error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch teachers directory' }, { status: 500 });
  }
}

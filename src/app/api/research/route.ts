import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { PublicationCategory } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') as PublicationCategory | null;

    // Fetch Teacher Profile for PhD Summary
    const profile = await prisma.teacherProfile.findFirst({
      select: {
        fullName: true,
        phdSummary: true,
      },
    });

    // Fetch Publications
    const wherePub: { category?: PublicationCategory } = {};
    if (category) wherePub.category = category;

    const publications = await prisma.researchPublication.findMany({
      where: wherePub,
      orderBy: { year: 'desc' },
    });

    // PhD Thesis Details
    const phdDetails = {
      title: 'Machine Learning-Driven Dynamic Resource Allocation & Load Balancing in Distributed Cloud Frameworks',
      status: 'Pursuing (Final Stage)',
      university: 'Department of Computer Engineering, University of Mumbai',
      supervisor: 'Dr. R. K. Sharma (Professor & Head of Research)',
      enrolmentYear: '2021',
      abstract: profile?.phdSummary || 'This doctoral thesis focuses on designing self-adaptive genetic algorithms and deep reinforcement learning models for optimal task scheduling and load balancing in heterogeneous cloud datacenters.',
      keyContributions: [
        'Novel hybrid genetic algorithm for cloud VM resource scheduling.',
        'Energy-aware load balancing model reducing datacenter power consumption by 18%.',
        'Real-time network traffic predictor for edge computing nodes.',
      ],
      synopsisPdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    };

    // Conference Presentations List
    const conferences = publications.filter(p => p.category === PublicationCategory.CONFERENCE_PAPER);

    return NextResponse.json({
      success: true,
      data: {
        phdDetails,
        publications,
        conferences,
      },
    });
  } catch (error) {
    console.error('Error fetching research data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to load research data' },
      { status: 500 }
    );
  }
}

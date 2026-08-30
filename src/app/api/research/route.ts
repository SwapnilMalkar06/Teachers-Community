import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { PublicationCategory } from '@prisma/client';

export const dynamic = 'force-dynamic';

const defaultPublications = [
  {
    id: 'pub-1',
    title: 'An Adaptive Deep Reinforcement Learning Framework for Cloud Task Scheduling',
    authors: 'Prof. Ashwini Sawant, Dr. R. K. Sharma',
    journalOrConference: 'IEEE Transactions on Cloud Computing',
    year: 2024,
    doi: '10.1109/TCC.2024.3389102',
    category: 'JOURNAL_PUBLICATION',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    publisher: 'IEEE',
  },
  {
    id: 'pub-2',
    title: 'Energy-Aware VM Placement in Heterogeneous Edge Datacenters Using Hybrid Genetic Optimization',
    authors: 'Prof. Ashwini Sawant, Prof. S. Mehta',
    journalOrConference: 'Journal of Systems and Software (Elsevier)',
    year: 2023,
    doi: '10.1016/j.jss.2023.111654',
    category: 'JOURNAL_PUBLICATION',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    publisher: 'Elsevier',
  },
  {
    id: 'pub-3',
    title: 'Performance Evaluation of IPv6 Routing Security in Distributed Wireless Sensor Networks',
    authors: 'Prof. Ashwini Sawant',
    journalOrConference: 'International Conference on Computing and Communications (ICCC 2022)',
    year: 2022,
    doi: '10.1109/ICCC54321.2022.9876543',
    category: 'CONFERENCE_PAPER',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    publisher: 'IEEE Explorer',
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') as PublicationCategory | null;

  let publications = defaultPublications;
  let phdSummaryText = null;

  try {
    const profile = await prisma.teacherProfile.findFirst({
      select: { phdSummary: true },
    });
    if (profile?.phdSummary) phdSummaryText = profile.phdSummary;

    const wherePub: { category?: PublicationCategory } = {};
    if (category) wherePub.category = category;

    const dbPubs = await prisma.researchPublication.findMany({
      where: wherePub,
      orderBy: { year: 'desc' },
    });
    if (dbPubs.length > 0) publications = dbPubs as any;
  } catch (error) {
    console.error('Error fetching research data (using default fallbacks):', error);
  }

  const phdDetails = {
    title: 'Machine Learning-Driven Dynamic Resource Allocation & Load Balancing in Distributed Cloud Frameworks',
    status: 'Pursuing (Final Stage)',
    university: 'Department of Computer Engineering, University of Mumbai',
    supervisor: 'Dr. R. K. Sharma (Professor & Head of Research)',
    enrolmentYear: '2021',
    abstract: phdSummaryText || 'This doctoral thesis focuses on designing self-adaptive genetic algorithms and deep reinforcement learning models for optimal task scheduling and load balancing in heterogeneous cloud datacenters.',
    keyContributions: [
      'Novel hybrid genetic algorithm for cloud VM resource scheduling.',
      'Energy-aware load balancing model reducing datacenter power consumption by 18%.',
      'Real-time network traffic predictor for edge computing nodes.',
    ],
    synopsisPdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  };

  if (category) {
    publications = publications.filter((p: any) => p.category === category);
  }

  const conferences = publications.filter((p: any) => p.category === 'CONFERENCE_PAPER');

  return NextResponse.json({
    success: true,
    data: {
      phdDetails,
      publications,
      conferences,
    },
  });
}

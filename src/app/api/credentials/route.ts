import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { EventRole } from '@prisma/client';

export const dynamic = 'force-dynamic';

const defaultFdps = [
  {
    id: 'fdp-1',
    title: 'National FDP on Artificial Intelligence & Machine Learning in Systems Engineering',
    type: 'FDP',
    role: 'ATTENDED',
    venue: 'IIT Bombay / Online',
    startDate: '2023-12-04T00:00:00.000Z',
    endDate: '2023-12-08T00:00:00.000Z',
    description: '1-week intensive FDP covering neural networks, deep learning architectures, and model deployment on cloud infrastructure.',
    certificateUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  },
  {
    id: 'fdp-2',
    title: 'STTP on High-Performance Computer Networks & Network Simulation (NS2/NS3)',
    type: 'STTP',
    role: 'ORGANIZED',
    venue: 'Department of Computer Engineering',
    startDate: '2023-06-15T00:00:00.000Z',
    endDate: '2023-06-20T00:00:00.000Z',
    description: 'Organized STTP for faculty members and postgraduate students with hands-on labs on Cisco Packet Tracer and NS3.',
    certificateUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  },
  {
    id: 'fdp-3',
    title: 'State-Level Workshop on Algorithmic Optimization and Data Structures in C++',
    type: 'WORKSHOP',
    role: 'RESOURCE_PERSON',
    venue: 'Saraswati College of Engineering',
    startDate: '2022-09-10T00:00:00.000Z',
    endDate: '2022-09-11T00:00:00.000Z',
    description: 'Delivered expert keynote session on time complexity, recursion trees, and dynamic programming algorithms.',
    certificateUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  },
];

const defaultCertificates = [
  {
    id: 'cert-1',
    title: 'NPTEL Online Certification: Data Structures & Algorithms using Java',
    issuingOrganization: 'IIT Kharagpur / NPTEL (Elite + Gold Badge)',
    issueDate: new Date('2023-04-15').toISOString(),
    credentialId: 'NPTEL23CS45S129',
    credentialUrl: 'https://nptel.ac.in',
    imageUrl: 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?auto=format&fit=crop&q=80&w=800',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cert-2',
    title: 'AWS Certified Cloud Practitioner',
    issuingOrganization: 'Amazon Web Services (AWS)',
    issueDate: new Date('2022-11-10').toISOString(),
    credentialId: 'AWS-CCP-987214',
    credentialUrl: 'https://aws.amazon.com/verification',
    imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cert-3',
    title: 'Deep Learning Specialization Certification',
    issuingOrganization: 'Coursera / DeepLearning.AI',
    issueDate: new Date('2023-08-20').toISOString(),
    credentialId: 'COURSERA-DL-54321',
    credentialUrl: 'https://coursera.org/verify',
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800',
    createdAt: new Date().toISOString(),
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const role = searchParams.get('role') as EventRole | null;

  let fdps = defaultFdps;
  let certificates = defaultCertificates;

  try {
    const whereFdp: { role?: EventRole } = {};
    if (role) whereFdp.role = role;

    const dbFdps = await prisma.workshopFDP.findMany({
      where: whereFdp,
      orderBy: { startDate: 'desc' },
    });
    if (dbFdps.length > 0) fdps = dbFdps as any;

    const dbCertificates = await prisma.certificate.findMany({
      orderBy: { issueDate: 'desc' },
    });
    if (dbCertificates.length > 0) certificates = dbCertificates as any;
  } catch (error) {
    console.error('Error fetching credentials data (using default fallbacks):', error);
  }

  if (role) {
    fdps = fdps.filter((f: any) => f.role === role);
  }

  return NextResponse.json({
    success: true,
    data: {
      fdps,
      certificates,
    },
  });
}

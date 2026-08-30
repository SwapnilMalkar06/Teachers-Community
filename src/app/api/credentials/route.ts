import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { EventRole } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role') as EventRole | null;

    // Fetch FDPs & Workshops
    const whereFdp: { role?: EventRole } = {};
    if (role) whereFdp.role = role;

    const fdps = await prisma.workshopFDP.findMany({
      where: whereFdp,
      orderBy: { startDate: 'desc' },
    });

    // Default Certificates Data if empty
    let certificates = await prisma.certificate.findMany({
      orderBy: { issueDate: 'desc' },
    });

    if (certificates.length === 0) {
      certificates = [
        {
          id: 'cert-1',
          title: 'NPTEL Online Certification: Data Structures & Algorithms using Java',
          issuingOrganization: 'IIT Kharagpur / NPTEL (Elite + Gold Badge)',
          issueDate: new Date('2023-04-15'),
          credentialId: 'NPTEL23CS45S129',
          credentialUrl: 'https://nptel.ac.in',
          imageUrl: 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?auto=format&fit=crop&q=80&w=800',
          createdAt: new Date(),
        },
        {
          id: 'cert-2',
          title: 'AWS Certified Cloud Practitioner',
          issuingOrganization: 'Amazon Web Services (AWS)',
          issueDate: new Date('2022-11-10'),
          credentialId: 'AWS-CCP-987214',
          credentialUrl: 'https://aws.amazon.com/verification',
          imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800',
          createdAt: new Date(),
        },
        {
          id: 'cert-3',
          title: 'Deep Learning Specialization Certification',
          issuingOrganization: 'Coursera / DeepLearning.AI',
          issueDate: new Date('2023-08-20'),
          credentialId: 'COURSERA-DL-54321',
          credentialUrl: 'https://coursera.org/verify',
          imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800',
          createdAt: new Date(),
        },
      ];
    }

    return NextResponse.json({
      success: true,
      data: {
        fdps,
        certificates,
      },
    });
  } catch (error) {
    console.error('Error fetching credentials data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to load credentials data' },
      { status: 500 }
    );
  }
}

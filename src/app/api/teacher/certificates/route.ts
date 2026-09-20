import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyUserRole } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET: Fetch certificates (all or for specific teacher)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const teacherIdParam = searchParams.get('teacherId');

    const session = await verifyUserRole(['TEACHER', 'ADMIN', 'STUDENT']).catch(() => null);
    const teacherId = teacherIdParam || (session ? session.teacherId : null);

    const certificates = await prisma.certificate.findMany({
      where: teacherId ? { teacherId } : {},
      include: {
        teacher: {
          select: { id: true, fullName: true, university: true, department: true },
        },
      },
      orderBy: { issueDate: 'desc' },
    });

    return NextResponse.json({ success: true, certificates });
  } catch (error) {
    console.error('Certificates GET error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch certificate records' }, { status: 500 });
  }
}

// POST: Add new certificate entry
export async function POST(request: NextRequest) {
  try {
    const session = await verifyUserRole(['TEACHER', 'ADMIN']);
    if (!session || !session.teacherId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, issuingOrganization, issueDate, credentialId, credentialUrl, imageUrl } = body;

    if (!title || !issuingOrganization || !issueDate) {
      return NextResponse.json({ success: false, error: 'Title, issuing organization, and issue date are required.' }, { status: 400 });
    }

    const newCertificate = await prisma.certificate.create({
      data: {
        teacherId: session.teacherId,
        title,
        issuingOrganization,
        issueDate: new Date(issueDate),
        credentialId: credentialId || null,
        credentialUrl: credentialUrl || null,
        imageUrl: imageUrl || null,
      },
    });

    return NextResponse.json({ success: true, certificate: newCertificate });
  } catch (error) {
    console.error('Certificates POST error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create certificate record' }, { status: 500 });
  }
}

// PUT: Update certificate entry
export async function PUT(request: NextRequest) {
  try {
    const session = await verifyUserRole(['TEACHER', 'ADMIN']);
    if (!session || !session.teacherId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, title, issuingOrganization, issueDate, credentialId, credentialUrl, imageUrl } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Certificate ID is required' }, { status: 400 });
    }

    const existing = await prisma.certificate.findFirst({
      where: { id, teacherId: session.teacherId },
    });

    if (!existing) {
      return NextResponse.json({ success: false, error: 'Certificate record not found or unauthorized' }, { status: 404 });
    }

    const updated = await prisma.certificate.update({
      where: { id },
      data: {
        title: title !== undefined ? title : existing.title,
        issuingOrganization: issuingOrganization !== undefined ? issuingOrganization : existing.issuingOrganization,
        issueDate: issueDate ? new Date(issueDate) : existing.issueDate,
        credentialId: credentialId !== undefined ? credentialId : existing.credentialId,
        credentialUrl: credentialUrl !== undefined ? credentialUrl : existing.credentialUrl,
        imageUrl: imageUrl !== undefined ? imageUrl : existing.imageUrl,
      },
    });

    return NextResponse.json({ success: true, certificate: updated });
  } catch (error) {
    console.error('Certificates PUT error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update certificate record' }, { status: 500 });
  }
}

// DELETE: Remove certificate entry
export async function DELETE(request: NextRequest) {
  try {
    const session = await verifyUserRole(['TEACHER', 'ADMIN']);
    if (!session || !session.teacherId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Certificate ID parameter is required' }, { status: 400 });
    }

    const existing = await prisma.certificate.findFirst({
      where: { id, teacherId: session.teacherId },
    });

    if (!existing) {
      return NextResponse.json({ success: false, error: 'Certificate record not found or unauthorized' }, { status: 404 });
    }

    await prisma.certificate.delete({ where: { id } });

    return NextResponse.json({ success: true, message: 'Certificate record deleted' });
  } catch (error) {
    console.error('Certificates DELETE error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete certificate record' }, { status: 500 });
  }
}

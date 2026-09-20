import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyUserRole } from '@/lib/auth';
import { PublicationCategory } from '@prisma/client';

export const dynamic = 'force-dynamic';

// GET: Fetch publications for logged in teacher
export async function GET() {
  try {
    const session = await verifyUserRole(['TEACHER', 'ADMIN']);
    if (!session || !session.teacherId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const publications = await prisma.researchPublication.findMany({
      where: { teacherId: session.teacherId },
      orderBy: { year: 'desc' },
    });

    return NextResponse.json({ success: true, publications });
  } catch (error) {
    console.error('Publications GET error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch publication records' }, { status: 500 });
  }
}

// POST: Add new research publication
export async function POST(request: NextRequest) {
  try {
    const session = await verifyUserRole(['TEACHER', 'ADMIN']);
    if (!session || !session.teacherId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, authors, journalOrConference, year, doi, category, pdfUrl, publisher } = body;

    if (!title || !authors || !journalOrConference || !year) {
      return NextResponse.json({ success: false, error: 'Title, authors, journal/conference, and year are required.' }, { status: 400 });
    }

    const newPub = await prisma.researchPublication.create({
      data: {
        teacherId: session.teacherId,
        title,
        authors,
        journalOrConference,
        year: Number(year),
        doi: doi || null,
        category: category || PublicationCategory.JOURNAL_PUBLICATION,
        pdfUrl: pdfUrl || null,
        publisher: publisher || null,
      },
    });

    return NextResponse.json({ success: true, publication: newPub });
  } catch (error) {
    console.error('Publications POST error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create publication record' }, { status: 500 });
  }
}

// PUT: Update research publication
export async function PUT(request: NextRequest) {
  try {
    const session = await verifyUserRole(['TEACHER', 'ADMIN']);
    if (!session || !session.teacherId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, title, authors, journalOrConference, year, doi, category, pdfUrl, publisher } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Publication ID is required' }, { status: 400 });
    }

    const existing = await prisma.researchPublication.findFirst({
      where: { id, teacherId: session.teacherId },
    });

    if (!existing) {
      return NextResponse.json({ success: false, error: 'Publication not found or unauthorized' }, { status: 404 });
    }

    const updated = await prisma.researchPublication.update({
      where: { id },
      data: {
        title: title !== undefined ? title : existing.title,
        authors: authors !== undefined ? authors : existing.authors,
        journalOrConference: journalOrConference !== undefined ? journalOrConference : existing.journalOrConference,
        year: year !== undefined ? Number(year) : existing.year,
        doi: doi !== undefined ? doi : existing.doi,
        category: category !== undefined ? category : existing.category,
        pdfUrl: pdfUrl !== undefined ? pdfUrl : existing.pdfUrl,
        publisher: publisher !== undefined ? publisher : existing.publisher,
      },
    });

    return NextResponse.json({ success: true, publication: updated });
  } catch (error) {
    console.error('Publications PUT error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update publication record' }, { status: 500 });
  }
}

// DELETE: Remove publication
export async function DELETE(request: NextRequest) {
  try {
    const session = await verifyUserRole(['TEACHER', 'ADMIN']);
    if (!session || !session.teacherId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Publication ID parameter is required' }, { status: 400 });
    }

    const existing = await prisma.researchPublication.findFirst({
      where: { id, teacherId: session.teacherId },
    });

    if (!existing) {
      return NextResponse.json({ success: false, error: 'Publication record not found or unauthorized' }, { status: 404 });
    }

    await prisma.researchPublication.delete({ where: { id } });

    return NextResponse.json({ success: true, message: 'Publication record deleted' });
  } catch (error) {
    console.error('Publications DELETE error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete publication record' }, { status: 500 });
  }
}

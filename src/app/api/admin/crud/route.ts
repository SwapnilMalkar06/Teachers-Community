import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { entity, data } = body;

    if (!entity || !data) {
      return NextResponse.json({ success: false, error: 'Entity and data are required' }, { status: 400 });
    }

    let createdRecord;

    switch (entity) {
      case 'subject':
        createdRecord = await prisma.subject.create({
          data: {
            code: data.code,
            name: data.name,
            department: data.department || 'Computer Engineering',
            semester: data.semester || 'Semester III',
            description: data.description,
          },
        });
        break;

      case 'resource':
        createdRecord = await prisma.teachingResource.create({
          data: {
            subjectId: data.subjectId,
            title: data.title,
            description: data.description,
            resourceType: data.resourceType || 'NOTES',
            fileUrl: data.fileUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          },
        });
        break;

      case 'video':
        const youtubeId = data.youtubeUrl ? data.youtubeUrl.split('v=')[1]?.split('&')[0] || 'RBSGKlAvoiM' : 'RBSGKlAvoiM';
        createdRecord = await prisma.videoLecture.create({
          data: {
            subjectId: data.subjectId,
            title: data.title,
            youtubeUrl: data.youtubeUrl,
            youtubeId: youtubeId,
            description: data.description,
          },
        });
        break;

      case 'publication':
        createdRecord = await prisma.researchPublication.create({
          data: {
            title: data.title,
            authors: data.authors,
            journalOrConference: data.journalOrConference,
            year: parseInt(data.year) || new Date().getFullYear(),
            doi: data.doi,
            category: data.category || 'JOURNAL_PUBLICATION',
            pdfUrl: data.pdfUrl,
            publisher: data.publisher,
          },
        });
        break;

      case 'fdp':
        createdRecord = await prisma.workshopFDP.create({
          data: {
            title: data.title,
            type: data.type || 'FDP',
            role: data.role || 'ATTENDED',
            venue: data.venue,
            startDate: new Date(data.startDate || new Date()),
            endDate: data.endDate ? new Date(data.endDate) : null,
            description: data.description,
            certificateUrl: data.certificateUrl,
          },
        });
        break;

      case 'certificate':
        createdRecord = await prisma.certificate.create({
          data: {
            title: data.title,
            issuingOrganization: data.issuingOrganization,
            issueDate: new Date(data.issueDate || new Date()),
            credentialId: data.credentialId,
            credentialUrl: data.credentialUrl,
            imageUrl: data.imageUrl,
          },
        });
        break;

      case 'blog':
        const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        createdRecord = await prisma.blogPost.create({
          data: {
            title: data.title,
            slug: slug || `post-${Date.now()}`,
            summary: data.summary,
            content: data.content,
            coverImage: data.coverImage,
            isPublished: data.isPublished !== undefined ? data.isPublished : true,
            estimatedReadingMinutes: parseInt(data.estimatedReadingMinutes) || 3,
          },
        });
        break;

      case 'gallery':
        createdRecord = await prisma.galleryItem.create({
          data: {
            title: data.title,
            category: data.category || 'Academic Events',
            imageUrl: data.imageUrl,
            eventDate: new Date(data.eventDate || new Date()),
          },
        });
        break;

      case 'profile':
        const existing = await prisma.teacherProfile.findFirst();
        if (existing) {
          createdRecord = await prisma.teacherProfile.update({
            where: { id: existing.id },
            data: { ...data },
          });
        } else {
          createdRecord = await prisma.teacherProfile.create({
            data: { ...data },
          });
        }
        break;

      default:
        return NextResponse.json({ success: false, error: 'Unknown entity type' }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: createdRecord });
  } catch (error) {
    console.error('Error creating admin record:', error);
    return NextResponse.json({ success: false, error: 'Failed to create record' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const entity = searchParams.get('entity');
    const id = searchParams.get('id');

    if (!entity || !id) {
      return NextResponse.json({ success: false, error: 'Entity and ID are required' }, { status: 400 });
    }

    switch (entity) {
      case 'subject':
        await prisma.subject.delete({ where: { id } });
        break;
      case 'resource':
        await prisma.teachingResource.delete({ where: { id } });
        break;
      case 'video':
        await prisma.videoLecture.delete({ where: { id } });
        break;
      case 'publication':
        await prisma.researchPublication.delete({ where: { id } });
        break;
      case 'fdp':
        await prisma.workshopFDP.delete({ where: { id } });
        break;
      case 'certificate':
        await prisma.certificate.delete({ where: { id } });
        break;
      case 'blog':
        await prisma.blogPost.delete({ where: { id } });
        break;
      case 'gallery':
        await prisma.galleryItem.delete({ where: { id } });
        break;
      case 'contact':
        await prisma.contactMessage.delete({ where: { id } });
        break;
      default:
        return NextResponse.json({ success: false, error: 'Unknown entity type' }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: 'Record deleted successfully' });
  } catch (error) {
    console.error('Error deleting admin record:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete record' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { entity, id, action } = body;

    if (entity === 'contact' && action === 'markRead') {
      await prisma.contactMessage.update({
        where: { id },
        data: { isRead: true },
      });
      return NextResponse.json({ success: true });
    }

    if (entity === 'blog' && action === 'togglePublish') {
      const post = await prisma.blogPost.findUnique({ where: { id } });
      if (post) {
        await prisma.blogPost.update({
          where: { id },
          data: { isPublished: !post.isPublished },
        });
      }
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error updating admin record:', error);
    return NextResponse.json({ success: false, error: 'Failed to update record' }, { status: 500 });
  }
}

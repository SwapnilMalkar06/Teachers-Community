import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // 1. Fetch Teacher Profile
    const profile = await prisma.teacherProfile.findFirst() || {
      fullName: 'Prof. Ashwini Sawant',
      designation: 'Assistant Professor',
      department: 'Department of Computer Engineering',
      institution: 'Engineering Institute',
      heroTitle: 'Educator, Researcher & Academic Mentor',
      heroSubtitle: 'Specializing in Computer Networks, Data Structures, Distributed Systems, and Machine Learning.',
      profileImageUrl: '/images/profile.png',
      bioText: 'Prof. Ashwini Sawant has over 12+ years of academic teaching experience in Computer Engineering.',
      phdSummary: 'Pursuing PhD research focused on Machine Learning-driven Dynamic Load Balancing in Distributed Cloud Frameworks.',
      officeAddress: 'Room 402, Academic Block A',
      contactEmail: 'ashwini.sawant@example.com',
      contactPhone: '+91 98765 43210',
      googleScholarUrl: 'https://scholar.google.com',
      linkedInUrl: 'https://linkedin.com',
      researchGateUrl: 'https://researchgate.net',
      orcidUrl: 'https://orcid.org',
    };

    // 2. Fetch Live Metrics Counts
    const subjectsCount = await prisma.subject.count();
    const resourcesCount = await prisma.teachingResource.count();
    const videoLecturesCount = await prisma.videoLecture.count();
    const publicationsCount = await prisma.researchPublication.count();
    const blogPostsCount = await prisma.blogPost.count();

    // 3. Fetch Featured Subjects with Resources
    const featuredSubjects = await prisma.subject.findMany({
      take: 3,
      include: {
        _count: {
          select: {
            resources: true,
            videos: true,
          },
        },
      },
    });

    // 4. Fetch Recent Publications
    const recentPublications = await prisma.researchPublication.findMany({
      take: 3,
      orderBy: {
        year: 'desc',
      },
    });

    // 5. Fetch Recent Blog Teasers
    const recentBlogs = await prisma.blogPost.findMany({
      where: { isPublished: true },
      take: 2,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        summary: true,
        coverImage: true,
        createdAt: true,
        estimatedReadingMinutes: true,
        viewCount: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        profile,
        stats: {
          subjectsCount,
          resourcesCount,
          videoLecturesCount,
          publicationsCount,
          blogPostsCount,
          yearsExperience: 12,
          studentsMentored: 500,
        },
        featuredSubjects,
        recentPublications,
        recentBlogs,
      },
    });
  } catch (error) {
    console.error('Error fetching home page data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to load home page data' },
      { status: 500 }
    );
  }
}

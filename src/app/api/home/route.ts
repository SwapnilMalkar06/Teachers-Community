import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  let profileRecord = null;
  let subjectsCount = 0;
  let resourcesCount = 0;
  let videoLecturesCount = 0;
  let publicationsCount = 0;
  let blogPostsCount = 0;
  let featuredSubjects: any[] = [];
  let recentPublications: any[] = [];
  let recentBlogs: any[] = [];

  try {
    profileRecord = await prisma.teacherProfile.findFirst();
    subjectsCount = await prisma.subject.count();
    resourcesCount = await prisma.teachingResource.count();
    videoLecturesCount = await prisma.videoLecture.count();
    publicationsCount = await prisma.researchPublication.count();
    blogPostsCount = await prisma.blogPost.count();

    featuredSubjects = await prisma.subject.findMany({
      take: 3,
      include: {
        _count: {
          select: { resources: true, videos: true },
        },
      },
    });

    recentPublications = await prisma.researchPublication.findMany({
      take: 3,
      orderBy: { year: 'desc' },
    });

    recentBlogs = await prisma.blogPost.findMany({
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
  } catch (err) {
    console.error('Database connection warning in API home:', err);
  }

  const profile = profileRecord || {
    fullName: 'Prof. Ashwini Sawant',
    designation: 'Assistant Professor',
    department: 'Department of Computer Engineering',
    university: 'Mumbai University',
    heroTitle: 'Educator, Researcher & Academic Mentor',
    heroSubtitle: 'Specializing in Computer Networks, Data Structures, Distributed Systems, and Machine Learning.',
    profileImageUrl: '/images/profile.jpg',
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

  return NextResponse.json({
    success: true,
    data: {
      profile,
      stats: {
        subjectsCount: subjectsCount || 5,
        resourcesCount: resourcesCount || 20,
        videoLecturesCount: videoLecturesCount || 12,
        publicationsCount: publicationsCount || 25,
        blogPostsCount: blogPostsCount || 8,
        yearsExperience: 12,
        studentsMentored: 500,
      },
      featuredSubjects,
      recentPublications,
      recentBlogs,
    },
  });
}

import React from 'react';
import { prisma } from '@/lib/prisma';
import AnnouncementTicker from '@/components/home/AnnouncementTicker';
import HeroSection from '@/components/home/HeroSection';
import StatsCounter from '@/components/home/StatsCounter';
import TeachingTeaser from '@/components/home/TeachingTeaser';
import ResearchTeaser from '@/components/home/ResearchTeaser';

export const revalidate = 60; // revalidate at most every 60 seconds

export default async function HomePage() {
  // 1. Fetch Teacher Profile from MySQL
  const profileRecord = await prisma.teacherProfile.findFirst();
  
  const profile = profileRecord || {
    fullName: 'Prof. Ashwini Sawant',
    designation: 'Assistant Professor',
    department: 'Department of Computer Engineering',
    institution: 'Engineering Institute',
    heroTitle: 'Educator, Researcher & Academic Mentor',
    heroSubtitle: 'Specializing in Computer Networks, Data Structures, Distributed Systems, and Machine Learning. Passionate about empowering students through interactive learning.',
    profileImageUrl: '/images/profile.png',
    bioText: 'Prof. Ashwini Sawant has over 12+ years of academic teaching experience in Computer Engineering. She has guided numerous undergraduate and postgraduate research projects and published papers in reputed international journals.',
    contactEmail: 'ashwini.sawant@example.com',
    googleScholarUrl: 'https://scholar.google.com',
    linkedInUrl: 'https://linkedin.com',
    researchGateUrl: 'https://researchgate.net',
    orcidUrl: 'https://orcid.org',
  };

  // 2. Fetch Stats Metrics
  const subjectsCount = await prisma.subject.count();
  const publicationsCount = await prisma.researchPublication.count();
  
  const stats = {
    yearsExperience: 12,
    publicationsCount: publicationsCount > 0 ? publicationsCount : 25,
    subjectsCount: subjectsCount > 0 ? subjectsCount : 5,
    studentsMentored: 500,
  };

  // 3. Fetch Featured Subjects
  const subjects = await prisma.subject.findMany({
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
  const publications = await prisma.researchPublication.findMany({
    take: 3,
    orderBy: {
      year: 'desc',
    },
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Announcement Notice Ticker */}
      <AnnouncementTicker />

      {/* Main Hero Section */}
      <HeroSection profile={profile} />

      {/* Dynamic Key Metrics Bar */}
      <StatsCounter stats={stats} />

      {/* Teaching Resources Teaser */}
      <TeachingTeaser subjects={subjects} />

      {/* Research & Publications Highlights */}
      <ResearchTeaser publications={publications} />
    </div>
  );
}

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ActivityCategory } from '@prisma/client';

export const dynamic = 'force-dynamic';

const defaultActivities = [
  {
    id: 'act-1',
    title: 'NAAC Criteria 3 (Research & Extension) Department Coordinator',
    category: ActivityCategory.COMMITTEE,
    eventDate: new Date('2023-01-10').toISOString(),
    description: 'Spearheaded department documentation, research publication verification, and peer team presentation for NAAC accreditation cycle.',
    imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'act-2',
    title: 'Guest Lecture Delivered on "Cloud Security & IPv6 Transition"',
    category: ActivityCategory.ACADEMIC,
    eventDate: new Date('2023-09-18').toISOString(),
    description: 'Invited speaker for final-year engineering students at SPIT Mumbai covering IPv6 subnetting and cloud firewall configurations.',
    imageUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=800',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'act-3',
    title: 'Chief Judge for Inter-Collegiate Student Project Competition',
    category: ActivityCategory.EXTRACURRICULAR,
    eventDate: new Date('2024-03-05').toISOString(),
    description: 'Evaluated 40+ innovative AI and Web development projects presented by engineering students.',
    imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800',
    createdAt: new Date().toISOString(),
  },
];

const defaultGallery = [
  {
    id: 'gal-1',
    title: 'National Conference on Recent Advances in Computing (NCRAC 2023)',
    category: 'Conferences',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800',
    eventDate: new Date('2023-11-20').toISOString(),
  },
  {
    id: 'gal-2',
    title: 'AWS & Cloud Infrastructure Hands-on Workshop Session',
    category: 'Workshops',
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800',
    eventDate: new Date('2024-02-22').toISOString(),
  },
  {
    id: 'gal-3',
    title: 'Excellence in Academic Mentorship Award Ceremony',
    category: 'Awards',
    imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800',
    eventDate: new Date('2023-09-05').toISOString(),
  },
  {
    id: 'gal-4',
    title: 'Student Capstone Project Poster Exhibition & Mentoring',
    category: 'Student Events',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800',
    eventDate: new Date('2024-04-12').toISOString(),
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') as ActivityCategory | null;

  let activities = defaultActivities;
  let gallery = defaultGallery;

  try {
    const whereActivity: { category?: ActivityCategory } = {};
    if (category) whereActivity.category = category;

    const dbActivities = await prisma.activity.findMany({
      where: whereActivity,
      orderBy: { eventDate: 'desc' },
    });
    if (dbActivities.length > 0) activities = dbActivities as any;

    const dbGallery = await prisma.galleryItem.findMany({
      orderBy: { eventDate: 'desc' },
    });
    if (dbGallery.length > 0) gallery = dbGallery as any;
  } catch (error) {
    console.error('Error fetching activities data (using default fallbacks):', error);
  }

  if (category) {
    activities = activities.filter((a: any) => a.category === category);
  }

  return NextResponse.json({
    success: true,
    data: {
      activities,
      gallery,
    },
  });
}

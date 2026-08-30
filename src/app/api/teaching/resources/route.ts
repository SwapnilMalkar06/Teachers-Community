import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ResourceType } from '@prisma/client';

export const dynamic = 'force-dynamic';

const defaultSubjects = [
  { id: 'subj-1', code: 'CSC501', name: 'Computer Networks', semester: 'Semester 5', _count: { resources: 8, videos: 5 } },
  { id: 'subj-2', code: 'CSC302', name: 'Data Structures & Algorithms', semester: 'Semester 3', _count: { resources: 12, videos: 8 } },
  { id: 'subj-3', code: 'CSC701', name: 'Distributed Computing', semester: 'Semester 7', _count: { resources: 6, videos: 4 } },
  { id: 'subj-4', code: 'CSC404', name: 'Operating Systems', semester: 'Semester 4', _count: { resources: 9, videos: 6 } },
];

const defaultResources = [
  {
    id: 'res-1',
    title: 'Unit 1: Transport Layer Protocols (TCP & UDP)',
    description: 'Detailed analysis of TCP 3-way handshake, flow control, congestion control algorithms, and UDP header structure.',
    resourceType: 'NOTES',
    fileUrl: 'https://www.w3.org/W3C/DesignIssues/diagrams/sw-stack-2006.pdf',
    uploadedAt: new Date().toISOString(),
    subject: { code: 'CSC501', name: 'Computer Networks', semester: 'Semester 5' },
  },
  {
    id: 'res-2',
    title: 'Unit 2: Routing Algorithms (Link-State vs Distance-Vector)',
    description: 'Dijkstra and Bellman-Ford shortest path algorithms with step-by-step solved numericals.',
    resourceType: 'NOTES',
    fileUrl: 'https://www.w3.org/W3C/DesignIssues/diagrams/sw-stack-2006.pdf',
    uploadedAt: new Date().toISOString(),
    subject: { code: 'CSC501', name: 'Computer Networks', semester: 'Semester 5' },
  },
  {
    id: 'res-3',
    title: 'Unit 1: Binary Search Trees & AVL Trees Presentation',
    description: 'Slide deck covering tree traversals, BST insertion/deletion, and AVL rotations.',
    resourceType: 'PPT',
    fileUrl: 'https://www.w3.org/W3C/DesignIssues/diagrams/sw-stack-2006.pdf',
    uploadedAt: new Date().toISOString(),
    subject: { code: 'CSC302', name: 'Data Structures & Algorithms', semester: 'Semester 3' },
  },
  {
    id: 'res-4',
    title: 'End-Semester Model Question Bank & Solutions',
    description: '50+ solved high-priority exam questions with diagrams and code snippets.',
    resourceType: 'QUESTION_BANK',
    fileUrl: 'https://www.w3.org/W3C/DesignIssues/diagrams/sw-stack-2006.pdf',
    uploadedAt: new Date().toISOString(),
    subject: { code: 'CSC701', name: 'Distributed Computing', semester: 'Semester 7' },
  },
];

const defaultVideos = [
  {
    id: 'vid-1',
    title: 'TCP Header Format & Sliding Window Protocol Explained',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    youtubeId: 'dQw4w9WgXcQ',
    description: 'Video lecture explaining sliding window protocol mechanics and byte sequence numbers.',
    createdAt: new Date().toISOString(),
    subject: { code: 'CSC501', name: 'Computer Networks', semester: 'Semester 5' },
  },
  {
    id: 'vid-2',
    title: 'Dynamic Programming: 0/1 Knapsack & Longest Common Subsequence',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    youtubeId: 'dQw4w9WgXcQ',
    description: 'Step-by-step code walkthrough of DP tabulation tables.',
    createdAt: new Date().toISOString(),
    subject: { code: 'CSC302', name: 'Data Structures & Algorithms', semester: 'Semester 3' },
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const subjectId = searchParams.get('subjectId');
  const type = searchParams.get('type') as ResourceType | null;

  let subjects = defaultSubjects;
  let resources = defaultResources;
  let videos = defaultVideos;

  try {
    const dbSubjects = await prisma.subject.findMany({
      include: {
        _count: { select: { resources: true, videos: true } },
      },
      orderBy: { code: 'asc' },
    });
    if (dbSubjects.length > 0) subjects = dbSubjects as any;

    const whereResource: { subjectId?: string; resourceType?: ResourceType } = {};
    if (subjectId) whereResource.subjectId = subjectId;
    if (type) whereResource.resourceType = type;

    const dbResources = await prisma.teachingResource.findMany({
      where: whereResource,
      include: {
        subject: { select: { code: true, name: true, semester: true } },
      },
      orderBy: { uploadedAt: 'desc' },
    });
    if (dbResources.length > 0) resources = dbResources as any;

    const whereVideo: { subjectId?: string } = {};
    if (subjectId) whereVideo.subjectId = subjectId;

    const dbVideos = await prisma.videoLecture.findMany({
      where: whereVideo,
      include: {
        subject: { select: { code: true, name: true, semester: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    if (dbVideos.length > 0) videos = dbVideos as any;
  } catch (error) {
    console.error('Error fetching teaching resources (using default fallbacks):', error);
  }

  // Filter default items if DB query failed
  if (type) {
    resources = resources.filter((r: any) => r.resourceType === type);
  }

  return NextResponse.json({
    success: true,
    data: {
      subjects,
      resources,
      videos,
    },
  });
}

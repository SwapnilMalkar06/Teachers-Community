import { PrismaClient, ResourceType, PublicationCategory, EventRole, EventType, ActivityCategory } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding MySQL database for Prof. Ashwini Sawant...');

  // 1. Create or Update Teacher Profile
  const profile = await prisma.teacherProfile.upsert({
    where: { id: 'prof-ashwini-sawant' },
    update: {},
    create: {
      id: 'prof-ashwini-sawant',
      fullName: 'Prof. Ashwini Sawant',
      designation: 'Assistant Professor',
      department: 'Department of Computer Engineering',
      institution: 'Saraswati College of Engineering / University Institute',
      heroTitle: 'Educator, Researcher & Academic Mentor',
      heroSubtitle: 'Specializing in Computer Networks, Data Structures, Distributed Systems, and Machine Learning. Passionate about empowering students through interactive learning and quality research.',
      profileImageUrl: '/images/profile.png',
      bioText: 'Prof. Ashwini Sawant has over 12+ years of academic teaching experience in Computer Engineering. She has guided numerous undergraduate and postgraduate research projects, published research papers in reputed international journals, and organized national-level FDPs and workshops. Her focus areas include Cloud Computing, Artificial Intelligence, and Algorithmic System Optimization.',
      phdSummary: 'Pursuing PhD research focused on Machine Learning-driven Dynamic Load Balancing in Distributed Cloud Frameworks.',
      officeAddress: 'Room 402, Academic Block A, Department of Computer Engineering',
      contactEmail: 'ashwini.sawant@engg.edu.in',
      contactPhone: '+91 98765 43210',
      googleScholarUrl: 'https://scholar.google.com',
      linkedInUrl: 'https://linkedin.com',
      researchGateUrl: 'https://researchgate.net',
      orcidUrl: 'https://orcid.org',
    },
  });

  // 2. Add Subjects
  const dsSubject = await prisma.subject.upsert({
    where: { code: 'CS301' },
    update: {},
    create: {
      code: 'CS301',
      name: 'Data Structures & Algorithms',
      department: 'Computer Engineering',
      semester: 'Semester III',
      description: 'Comprehensive study of arrays, linked lists, stacks, queues, trees, graphs, hashing, sorting techniques, and algorithmic complexity.',
    },
  });

  const cnSubject = await prisma.subject.upsert({
    where: { code: 'CS502' },
    update: {},
    create: {
      code: 'CS502',
      name: 'Computer Networks',
      department: 'Computer Engineering',
      semester: 'Semester V',
      description: 'Detailed analysis of OSI model, TCP/IP protocol suite, data link controls, routing algorithms, transport layer congestion control, and network security.',
    },
  });

  // 3. Add Teaching Resources (Notes, PPTs, Question Banks)
  await prisma.teachingResource.createMany({
    data: [
      {
        subjectId: dsSubject.id,
        title: 'Module 1: Stacks and Queues Implementation Notes',
        description: 'Complete PDF notes covering array and linked list implementation of Stacks, Queues, Circular Queues, and Priority Queues.',
        resourceType: ResourceType.NOTES,
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        fileType: 'pdf',
      },
      {
        subjectId: dsSubject.id,
        title: 'Module 3: Binary Search Trees & Graph Algorithms PPT Slides',
        description: 'Presentation slides on BST operations, AVL Trees, BFS, DFS, Dijkstra & Prim algorithms.',
        resourceType: ResourceType.PPT,
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        fileType: 'pdf',
      },
      {
        subjectId: dsSubject.id,
        title: 'Data Structures Question Bank & Previous Semester Keys',
        description: 'Selected 2-mark and 10-mark questions with model answer keys for End Semester Examinations.',
        resourceType: ResourceType.QUESTION_BANK,
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        fileType: 'pdf',
      },
      {
        subjectId: cnSubject.id,
        title: 'TCP/IP Protocol Suite & IPv4 vs IPv6 Subnetting Notes',
        description: 'Detailed lecture notes on IP Addressing, VLSM, CIDR notation, and IP packet format.',
        resourceType: ResourceType.NOTES,
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        fileType: 'pdf',
      },
    ],
    skipDuplicates: true,
  });

  // 4. Add Video Lectures
  await prisma.videoLecture.createMany({
    data: [
      {
        subjectId: dsSubject.id,
        title: 'Lecture 1: Introduction to Data Structures & Time Complexity Analysis',
        youtubeUrl: 'https://www.youtube.com/watch?v=RBSGKlAvoiM',
        youtubeId: 'RBSGKlAvoiM',
        description: 'Detailed lecture explaining Big-O notation, time-space tradeoffs, and fundamental abstract data types.',
      },
      {
        subjectId: cnSubject.id,
        title: 'Lecture 4: Subnetting Made Easy & IPv4 Addressing Explained',
        youtubeUrl: 'https://www.youtube.com/watch?v=vcrJzvh6i1U',
        youtubeId: 'vcrJzvh6i1U',
        description: 'Step-by-step tutorial on calculating netmask, broadcast address, and host ranges for classful & classless IPv4 addressing.',
      },
    ],
    skipDuplicates: true,
  });

  // 5. Add Research Publications
  await prisma.researchPublication.createMany({
    data: [
      {
        title: 'Optimization of Task Scheduling in Cloud Datacenters Using Hybrid Genetic Algorithm',
        authors: 'Prof. Ashwini Sawant, Dr. R. K. Sharma',
        journalOrConference: 'IEEE Transactions on Cloud Computing / International Journal of Computer Applications',
        year: 2023,
        doi: '10.1109/TCC.2023.1029384',
        category: PublicationCategory.JOURNAL_PUBLICATION,
        pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        publisher: 'IEEE',
      },
      {
        title: 'Security Enhancements in IoT Edge Architectures Using Lightweight Cryptography',
        authors: 'Prof. Ashwini Sawant, M. V. Patil',
        journalOrConference: 'International Conference on Smart Computing & Communication (ICSCC 2022)',
        year: 2022,
        doi: '10.1007/978-981-19-1234-5_12',
        category: PublicationCategory.CONFERENCE_PAPER,
        pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        publisher: 'Springer',
      },
    ],
    skipDuplicates: true,
  });

  // 6. Add FDPs & Workshops
  await prisma.workshopFDP.createMany({
    data: [
      {
        title: 'AICTE Training & Learning (ATAL) FDP on Machine Learning & Deep Learning Applications',
        type: EventType.FDP,
        role: EventRole.ATTENDED,
        venue: 'IIT Bombay (Virtual Mode)',
        startDate: new Date('2023-07-10'),
        endDate: new Date('2023-07-15'),
        description: 'One-week faculty development program covering Convolutional Neural Networks, Transformers, and PyTorch.',
        certificateUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      },
      {
        title: 'National Level Workshop on Hands-on Cloud Infrastructure with AWS & Docker',
        type: EventType.WORKSHOP,
        role: EventRole.ORGANIZED,
        venue: 'Department of Computer Engineering',
        startDate: new Date('2024-02-20'),
        endDate: new Date('2024-02-22'),
        description: 'Convenor and Lead Coordinator for 3-day student & faculty hands-on cloud workshop.',
        certificateUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      },
    ],
    skipDuplicates: true,
  });

  // 7. Add Blog Post
  await prisma.blogPost.upsert({
    where: { slug: 'effective-study-strategies-for-data-structures-exam' },
    update: {},
    create: {
      title: 'Effective Study Strategies for Data Structures & Algorithms Exams',
      slug: 'effective-study-strategies-for-data-structures-exam',
      summary: 'Essential tips for computer engineering students to master trees, graphs, and algorithmic problem-solving before university semester exams.',
      content: `
# Mastering Data Structures & Algorithms: A Guide for Students

Data Structures & Algorithms (DSA) form the core backbone of Computer Engineering and technical interviews. Here are key strategies to ace your semester exams and build long-term retention:

## 1. Focus on Visualizing Pointer Manipulations
Whether working with singly linked lists, doubly linked lists, or binary search trees, draw pointer diagrams on paper before attempting code implementation.

## 2. Master Standard Traversal Pseudocode
Ensure you can write BFS, DFS, Pre-order, In-order, and Post-order tree traversals without looking at references.

## 3. Practice Asymptotic Time Complexity Analysis
Always calculate Big-O time and space complexity for your loops, recursive calls, and hash map lookups.

Good luck with your preparation!
      `,
      coverImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800',
      isPublished: true,
      viewCount: 142,
      estimatedReadingMinutes: 3,
      totalEngagementSeconds: 2840,
    },
  });

  console.log('Database seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

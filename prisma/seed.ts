import { PrismaClient, Role, ResourceType, PublicationCategory, EventRole, EventType, ActivityCategory } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database for Teachers-Community multi-teacher platform...');

  // Clean existing data in order
  await prisma.teachingResource.deleteMany();
  await prisma.videoLecture.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.researchPublication.deleteMany();
  await prisma.workshopFDP.deleteMany();
  await prisma.certificate.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.galleryItem.deleteMany();
  await prisma.contactMessage.deleteMany();
  await prisma.studentProfile.deleteMany();
  await prisma.teacherProfile.deleteMany();
  await prisma.user.deleteMany();

  // 1. Create Admin Account
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@teacherscommunity.com',
      password: 'admin123',
      name: 'System Administrator',
      role: Role.ADMIN,
    },
  });
  console.log('Admin account created:', adminUser.email);

  // 2. Create Student Account
  const studentUser = await prisma.user.create({
    data: {
      email: 'student@teacherscommunity.com',
      password: 'student123',
      name: 'Rohan Sharma',
      role: Role.STUDENT,
      studentProfile: {
        create: {
          university: 'Mumbai University',
          department: 'Computer Engineering',
          yearOfStudy: 'TE',
        },
      },
    },
  });
  console.log('Student account created:', studentUser.email);

  // 3. Create Teacher 1: Prof. Ashwini Sawant (Mumbai University)
  const teacher1User = await prisma.user.create({
    data: {
      email: 'ashwini@teacherscommunity.com',
      password: 'teacher123',
      name: 'Prof. Ashwini Sawant',
      role: Role.TEACHER,
    },
  });

  const teacher1Profile = await prisma.teacherProfile.create({
    data: {
      userId: teacher1User.id,
      fullName: 'Prof. Ashwini Sawant',
      designation: 'Assistant Professor',
      department: 'Computer Engineering',
      university: 'Mumbai University',
      expertise: 'Web Technologies, Cloud Computing, Software Engineering',
      heroTitle: 'Educator, Researcher & Mentor',
      heroSubtitle: 'Specializing in Web Development, Computer Networks, and Cloud System Architecture. Empowering students with modern skills.',
      profileImageUrl: '/images/profile.jpg',
      bioText: 'Prof. Ashwini Sawant has over 12+ years of teaching experience at Mumbai University. She specializes in Web Technologies, Cloud Infrastructure, and Software Engineering methodologies.',
      phdSummary: 'Pursuing PhD research on Distributed Cloud Architectures and Load Balancing.',
      officeAddress: 'Room 402, Academic Block A, Mumbai University Campus',
      contactEmail: 'ashwini@teacherscommunity.com',
      contactPhone: '+91 98765 43210',
      googleScholarUrl: 'https://scholar.google.com',
      linkedInUrl: 'https://linkedin.com',
    },
  });

  // Teacher 1 Subjects & Resources
  const subject1_1 = await prisma.subject.create({
    data: {
      teacherId: teacher1Profile.id,
      code: 'MU-CS301',
      name: 'Data Structures & Algorithms',
      department: 'Computer Engineering',
      semester: 'Semester III',
      description: 'Covers arrays, linked lists, stacks, queues, trees, graphs, sorting, and algorithmic complexity.',
    },
  });

  const subject1_2 = await prisma.subject.create({
    data: {
      teacherId: teacher1Profile.id,
      code: 'MU-CS502',
      name: 'Web Engineering & Cloud Computing',
      department: 'Computer Engineering',
      semester: 'Semester V',
      description: 'Modern full-stack architecture, REST APIs, microservices, and cloud service deployment models.',
    },
  });

  await prisma.teachingResource.createMany({
    data: [
      {
        teacherId: teacher1Profile.id,
        subjectId: subject1_1.id,
        title: 'Data Structures Module 1: Stacks and Queues Notes',
        description: 'Complete PDF notes covering array and linked list implementation of Stacks, Queues, and Circular Queues.',
        resourceType: ResourceType.NOTES,
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        fileType: 'pdf',
      },
      {
        teacherId: teacher1Profile.id,
        subjectId: subject1_1.id,
        title: 'Binary Search Trees & Graph Algorithms PPT Presentation',
        description: 'Comprehensive slides on BST operations, AVL Trees, BFS, DFS, Dijkstra, and Prim algorithms.',
        resourceType: ResourceType.PPT,
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        fileType: 'pdf',
      },
      {
        teacherId: teacher1Profile.id,
        subjectId: subject1_1.id,
        title: 'DSA Question Bank & Previous Semester Papers with Keys',
        description: 'Curated list of 2-mark and 10-mark questions with detailed solution keys for Mumbai University End Sem exam.',
        resourceType: ResourceType.QUESTION_BANK,
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        fileType: 'pdf',
      },
      {
        teacherId: teacher1Profile.id,
        subjectId: subject1_2.id,
        title: 'Cloud Service Models (IaaS, PaaS, SaaS) & AWS Architecture PPT',
        description: 'Detailed slides explaining cloud deployment models, EC2, S3, and serverless compute.',
        resourceType: ResourceType.PPT,
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        fileType: 'pdf',
      },
      {
        teacherId: teacher1Profile.id,
        subjectId: subject1_2.id,
        title: 'Web Engineering Question Bank 2026',
        description: 'Important question bank covering Next.js, Node.js, REST API design, and Docker deployment.',
        resourceType: ResourceType.QUESTION_BANK,
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        fileType: 'pdf',
      },
    ],
  });

  // 4. Create Teacher 2: Dr. Rajesh Sharma (SPPU Pune)
  const teacher2User = await prisma.user.create({
    data: {
      email: 'rajesh@teacherscommunity.com',
      password: 'teacher123',
      name: 'Dr. Rajesh Sharma',
      role: Role.TEACHER,
    },
  });

  const teacher2Profile = await prisma.teacherProfile.create({
    data: {
      userId: teacher2User.id,
      fullName: 'Dr. Rajesh Sharma',
      designation: 'Associate Professor',
      department: 'Data Science & AI',
      university: 'SPPU Pune',
      expertise: 'Machine Learning, Artificial Intelligence, Python Programming',
      heroTitle: 'AI Researcher & Data Science Specialist',
      heroSubtitle: 'Passionate about Deep Learning, Natural Language Processing, and intelligent data systems.',
      profileImageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
      bioText: 'Dr. Rajesh Sharma holds a PhD in AI & Machine Learning from SPPU Pune. He has over 15 years of research experience and has published 25+ IEEE research papers.',
      phdSummary: 'PhD in Optimization Algorithms for Neural Network Hyperparameter Tuning.',
      officeAddress: 'Department of Computer Science, SPPU Pune',
      contactEmail: 'rajesh@teacherscommunity.com',
      contactPhone: '+91 98123 45678',
      googleScholarUrl: 'https://scholar.google.com',
      linkedInUrl: 'https://linkedin.com',
    },
  });

  const subject2_1 = await prisma.subject.create({
    data: {
      teacherId: teacher2Profile.id,
      code: 'SPPU-AI401',
      name: 'Machine Learning Foundations',
      department: 'Data Science & AI',
      semester: 'Semester IV',
      description: 'Supervised and unsupervised learning techniques, linear regression, decision trees, SVM, and clustering.',
    },
  });

  await prisma.teachingResource.createMany({
    data: [
      {
        teacherId: teacher2Profile.id,
        subjectId: subject2_1.id,
        title: 'Supervised Learning & Regression Algorithms Notes',
        description: 'In-depth notes on Linear Regression, Logistic Regression, Gradient Descent, and Loss functions.',
        resourceType: ResourceType.NOTES,
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        fileType: 'pdf',
      },
      {
        teacherId: teacher2Profile.id,
        subjectId: subject2_1.id,
        title: 'Neural Networks & Deep Learning Intro PPT Slides',
        description: 'Visual presentation slides introducing Artificial Neural Networks, Backpropagation, and Activation functions.',
        resourceType: ResourceType.PPT,
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        fileType: 'pdf',
      },
      {
        teacherId: teacher2Profile.id,
        subjectId: subject2_1.id,
        title: 'Machine Learning Mid-Term Question Bank & Solutions',
        description: 'Comprehensive problem sets and solution keys for SPPU Machine Learning semester exams.',
        resourceType: ResourceType.QUESTION_BANK,
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        fileType: 'pdf',
      },
    ],
  });

  // 5. Create Teacher 3: Prof. Sunita Verma (IIT Bombay)
  const teacher3User = await prisma.user.create({
    data: {
      email: 'sunita@teacherscommunity.com',
      password: 'teacher123',
      name: 'Prof. Sunita Verma',
      role: Role.TEACHER,
    },
  });

  const teacher3Profile = await prisma.teacherProfile.create({
    data: {
      userId: teacher3User.id,
      fullName: 'Prof. Sunita Verma',
      designation: 'Professor',
      department: 'Computer Science',
      university: 'IIT Bombay',
      expertise: 'Cybersecurity, Cryptography, Network Protocols',
      heroTitle: 'Cybersecurity Expert & Cryptography Professor',
      heroSubtitle: 'Teaching advanced network security, blockchain fundamentals, and threat analysis.',
      profileImageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
      bioText: 'Prof. Sunita Verma has been teaching Cybersecurity and Cryptography at IIT Bombay for 18 years. She leads national cyber-defense initiatives.',
      phdSummary: 'PhD in Post-Quantum Cryptographic Protocols.',
      officeAddress: 'Kresge Building, CSE Dept, IIT Bombay',
      contactEmail: 'sunita@teacherscommunity.com',
      contactPhone: '+91 97654 32109',
      googleScholarUrl: 'https://scholar.google.com',
      linkedInUrl: 'https://linkedin.com',
    },
  });

  const subject3_1 = await prisma.subject.create({
    data: {
      teacherId: teacher3Profile.id,
      code: 'IITB-CS601',
      name: 'Network Security & Cryptography',
      department: 'Computer Science',
      semester: 'Semester VI',
      description: 'Symmetric and asymmetric encryption, RSA, AES, digital signatures, SSL/TLS, and cyber attack vectors.',
    },
  });

  await prisma.teachingResource.createMany({
    data: [
      {
        teacherId: teacher3Profile.id,
        subjectId: subject3_1.id,
        title: 'Cryptography & Public Key Infrastructure Notes',
        description: 'Detailed mathematical background and algorithmic breakdown of RSA, Diffie-Hellman, and Elliptic Curve Cryptography.',
        resourceType: ResourceType.NOTES,
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        fileType: 'pdf',
      },
      {
        teacherId: teacher3Profile.id,
        subjectId: subject3_1.id,
        title: 'Cybersecurity Threats & Penetration Testing PPT',
        description: 'Slides covering OWASP Top 10 vulnerabilities, buffer overflows, SQL injection, and defensive coding.',
        resourceType: ResourceType.PPT,
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        fileType: 'pdf',
      },
      {
        teacherId: teacher3Profile.id,
        subjectId: subject3_1.id,
        title: 'Network Security End-Sem Exam Question Bank',
        description: 'Advanced numerical problem sets and theoretical question bank for Cryptography & Network Security.',
        resourceType: ResourceType.QUESTION_BANK,
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        fileType: 'pdf',
      },
    ],
  });

  // Seed Research Publications
  await prisma.researchPublication.createMany({
    data: [
      {
        teacherId: teacher1Profile.id,
        title: 'Optimization of Task Scheduling in Cloud Datacenters Using Hybrid Genetic Algorithm',
        authors: 'Prof. Ashwini Sawant, Dr. R. K. Sharma',
        journalOrConference: 'IEEE Transactions on Cloud Computing',
        year: 2023,
        doi: '10.1109/TCC.2023.1029384',
        category: PublicationCategory.JOURNAL_PUBLICATION,
        pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        publisher: 'IEEE',
      },
      {
        teacherId: teacher2Profile.id,
        title: 'Deep Learning for Automated Medical Imaging Diagnostics',
        authors: 'Dr. Rajesh Sharma, K. Patel',
        journalOrConference: 'International Journal of Artificial Intelligence',
        year: 2024,
        doi: '10.1016/j.artint.2024.103982',
        category: PublicationCategory.JOURNAL_PUBLICATION,
        pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        publisher: 'Elsevier',
      },
      {
        teacherId: teacher3Profile.id,
        title: 'Post-Quantum Lattice-Based Key Exchange Protocols for IoT',
        authors: 'Prof. Sunita Verma, A. Mehta',
        journalOrConference: 'ACM Symposium on Information, Computer and Communications Security',
        year: 2023,
        doi: '10.1145/3576915.3582301',
        category: PublicationCategory.CONFERENCE_PAPER,
        pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        publisher: 'ACM',
      },
    ],
  });

  // Seed Blog Posts
  await prisma.blogPost.createMany({
    data: [
      {
        teacherId: teacher1Profile.id,
        title: 'Effective Study Strategies for Data Structures & Algorithms Exams',
        slug: 'effective-study-strategies-for-data-structures-exam',
        summary: 'Essential tips for computer engineering students to master trees, graphs, and algorithmic problem-solving.',
        content: `
<h2>Mastering Data Structures & Algorithms: A Guide for Students</h2>
<p>Data Structures & Algorithms (DSA) form the core backbone of Computer Engineering and technical placement interviews. Here are key strategies to ace your semester exams:</p>

<h3>1. Focus on Visualizing Pointer Manipulations</h3>
<p>Draw pointer diagrams on paper before attempting code implementation for linked lists, binary trees, and dynamic arrays.</p>

<h3>2. Practice Asymptotic Time Complexity Analysis</h3>
<p>Always calculate Big-O time and space complexity for your algorithms. Focus on comparing worst-case, average-case, and best-case complexities.</p>

<h3>3. Solve Previous Years Question Papers</h3>
<p>Analyze previous university question papers to identify recurring patterns in 10-mark questions like AVL tree rotations, Dijkstra algorithm, and BFS/DFS graph traversals.</p>
        `,
        coverImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800',
        isPublished: true,
        viewCount: 250,
        estimatedReadingMinutes: 3,
        totalEngagementSeconds: 5000,
      },
      {
        teacherId: teacher2Profile.id,
        title: 'How Machine Learning is Transforming Academic Research in 2026',
        slug: 'how-machine-learning-is-transforming-academic-research-in-2026',
        summary: 'An exploration of modern AI tools, neural networks, and automated data processing techniques for engineering students.',
        content: `
<h2>The Evolution of Machine Learning in Higher Education</h2>
<p>Artificial Intelligence and Machine Learning are no longer futuristic concepts—they are active tools transforming how we conduct scientific research, process big data, and build intelligent applications.</p>

<h3>Key Areas of Research Acceleration</h3>
<ul>
  <li><strong>Automated Data Analysis:</strong> Neural networks can process massive datasets in seconds.</li>
  <li><strong>Natural Language Understanding:</strong> Summarizing research papers and extracting citations automatically.</li>
  <li><strong>Computer Vision:</strong> Automated medical diagnostics and satellite imagery mapping.</li>
</ul>

<p>For students interested in entering the field of AI, start by mastering Linear Algebra, Python, NumPy, and PyTorch fundamentals!</p>
        `,
        coverImage: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=800',
        isPublished: true,
        viewCount: 420,
        estimatedReadingMinutes: 4,
        totalEngagementSeconds: 8400,
      },
      {
        teacherId: teacher3Profile.id,
        title: 'Cybersecurity 101: Essential Security Habits for Engineering Students',
        slug: 'cybersecurity-101-essential-security-habits',
        summary: 'Learn about encryption, secure coding practices, API security, and protection against common web vulnerabilities.',
        content: `
<h2>Why Every Engineer Needs Security Awareness</h2>
<p>In today's interconnected digital ecosystem, cybersecurity is not just the responsibility of security engineers—every software developer must write secure code by default.</p>

<h3>Top Security Best Practices</h3>
<ol>
  <li><strong>Never Hardcode API Keys or Passwords:</strong> Use environment variables and secrets managers.</li>
  <li><strong>Sanitize User Inputs:</strong> Protect your web applications against SQL Injection and Cross-Site Scripting (XSS).</li>
  <li><strong>Enforce HTTPS & Strong Cryptography:</strong> Always use TLS encryption and salted password hashing (e.g., Argon2 or bcrypt).</li>
</ol>
        `,
        coverImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800',
        isPublished: true,
        viewCount: 310,
        estimatedReadingMinutes: 5,
        totalEngagementSeconds: 6200,
      }
    ]
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

import { PrismaClient, Role, EventType, EventRole, PublicationCategory, ResourceType } from '@prisma/client';

const prisma = new PrismaClient();

const TEACHERS_DATA = [
  {
    name: 'Dr. Ashwini Sawant',
    email: 'ashwini@teacherscommunity.com',
    phone: '+91 98765 43210',
    university: 'Mumbai University',
    department: 'Computer Engineering',
    designation: 'Associate Professor',
    expertise: 'Web Technologies, Cloud Computing, Distributed Systems',
    subjectCode: 'CS-101',
    subjectName: 'Advanced Web Engineering & Cloud',
  },
  {
    name: 'Dr. Rajesh Sharma',
    email: 'rajesh.sharma@teacherscommunity.com',
    phone: '+91 98230 11223',
    university: 'SPPU Pune',
    department: 'Computer Science & Engineering',
    designation: 'Professor & HOD',
    expertise: 'Machine Learning, Artificial Intelligence, Deep Learning',
    subjectCode: 'AI-201',
    subjectName: 'Deep Learning & Neural Networks',
  },
  {
    name: 'Prof. Sunita Patil',
    email: 'sunita.patil@teacherscommunity.com',
    phone: '+91 94221 44556',
    university: 'Shivaji University Kolhapur',
    department: 'Information Technology',
    designation: 'Associate Professor',
    expertise: 'Cybersecurity, Cryptography, Blockchain Technology',
    subjectCode: 'CYBER-702',
    subjectName: 'Applied Cryptography & Network Security',
  },
  {
    name: 'Dr. Vikramaditya Deshmukh',
    email: 'vikram.deshmukh@teacherscommunity.com',
    phone: '+91 97654 33221',
    university: 'COEP Technological University',
    department: 'Data Science & AI',
    designation: 'Professor',
    expertise: 'Data Science, Big Data Analytics, Neural Networks',
    subjectCode: 'BD-102',
    subjectName: 'Big Data Frameworks & Analytics',
  },
  {
    name: 'Prof. Ananya Kulkarni',
    email: 'ananya.kulkarni@teacherscommunity.com',
    phone: '+91 98901 22334',
    university: 'VJTI Mumbai',
    department: 'Computer Applications (MCA)',
    designation: 'Assistant Professor',
    expertise: 'Database Management Systems, Software Engineering, DevOps',
    subjectCode: 'DBMS-603',
    subjectName: 'Advanced Database Systems & NoSQL',
  },
  {
    name: 'Dr. Ramesh Iyer',
    email: 'ramesh.iyer@teacherscommunity.com',
    phone: '+91 98112 33445',
    university: 'IIT Bombay',
    department: 'Electronics & Telecommunication',
    designation: 'Professor',
    expertise: 'Embedded Systems, Internet of Things (IoT), VLSI Design',
    subjectCode: 'IOT-202',
    subjectName: 'Industrial IoT Architecture & Protocols',
  },
  {
    name: 'Dr. Meenakshi Sundaram',
    email: 'meenakshi.sundaram@teacherscommunity.com',
    phone: '+91 94432 11009',
    university: 'Anna University Chennai',
    department: 'Computer Engineering',
    designation: 'Associate Professor',
    expertise: 'Computer Networks, Mobile Computing, Wireless Sensor Networks',
    subjectCode: 'NET-501',
    subjectName: 'Wireless Sensor Networks & Ad-Hoc Systems',
  },
  {
    name: 'Prof. Arvind Joshi',
    email: 'arvind.joshi@teacherscommunity.com',
    phone: '+91 97400 99887',
    university: 'VTU Belagavi',
    department: 'Artificial Intelligence & Data Science',
    designation: 'Assistant Professor',
    expertise: 'Computer Vision, Image Processing, Pattern Recognition',
    subjectCode: 'CV-301',
    subjectName: 'Computer Vision & Image Analytics',
  },
  {
    name: 'Dr. Preeti Verma',
    email: 'preeti.verma@teacherscommunity.com',
    phone: '+91 96543 22110',
    university: 'DBATU Lonere',
    department: 'Information Technology',
    designation: 'Associate Professor',
    expertise: 'Natural Language Processing, Computational Linguistics, Python',
    subjectCode: 'NLP-901',
    subjectName: 'Natural Language Processing & LLMs',
  },
  {
    name: 'Prof. Nitin Gadgil',
    email: 'nitin.gadgil@teacherscommunity.com',
    phone: '+91 99887 66554',
    university: 'BITS Pilani',
    department: 'Computer Science',
    designation: 'Assistant Professor',
    expertise: 'Operating Systems, System Programming, Linux Kernel Development',
    subjectCode: 'OS-703',
    subjectName: 'Advanced Operating Systems Internals',
  },
  {
    name: 'Dr. Kavita Rao',
    email: 'kavita.rao@teacherscommunity.com',
    phone: '+91 98711 22334',
    university: 'MIT-WPU Pune',
    department: 'Software Engineering',
    designation: 'Associate Professor',
    expertise: 'Software Architecture, Microservices, Agile Methodologies',
    subjectCode: 'SE-301',
    subjectName: 'Software Architecture & Design Patterns',
  },
  {
    name: 'Prof. Deepak Mehta',
    email: 'deepak.mehta@teacherscommunity.com',
    phone: '+91 98220 44332',
    university: 'Sardar Patel Institute of Technology (SPIT) Mumbai',
    department: 'Computer Engineering',
    designation: 'Assistant Professor',
    expertise: 'High Performance Computing, Parallel Processing, GPU Architectures',
    subjectCode: 'HPC-602',
    subjectName: 'High Performance Computing & CUDA',
  },
  {
    name: 'Dr. Smita Bannerjee',
    email: 'smita.bannerjee@teacherscommunity.com',
    phone: '+91 97112 88990',
    university: 'Symbiosis International University Pune',
    department: 'Data Science',
    designation: 'Associate Professor',
    expertise: 'Predictive Analytics, Time Series Analysis, R Programming',
    subjectCode: 'PA-401',
    subjectName: 'Predictive Modeling & Statistical Computing',
  },
  {
    name: 'Prof. Suresh Nambiar',
    email: 'suresh.nambiar@teacherscommunity.com',
    phone: '+91 94801 77665',
    university: 'Christ University Bengaluru',
    department: 'Cybersecurity & Digital Forensics',
    designation: 'Assistant Professor',
    expertise: 'Ethical Hacking, Network Security, Malware Analysis',
    subjectCode: 'FOR-801',
    subjectName: 'Digital Forensics & Incident Response',
  },
  {
    name: 'Dr. Pooja Hegde',
    email: 'pooja.hegde@teacherscommunity.com',
    phone: '+91 98450 33221',
    university: 'Manipal Academy of Higher Education',
    department: 'Computer Applications',
    designation: 'Associate Professor',
    expertise: 'Object Oriented Programming, Java Enterprise Edition, Cloud Native',
    subjectCode: 'JAVA-203',
    subjectName: 'Enterprise Java & Spring Boot Architecture',
  },
  {
    name: 'Prof. Alok Pandey',
    email: 'alok.pandey@teacherscommunity.com',
    phone: '+91 94150 66778',
    university: 'NIT Surathkal',
    department: 'Information Technology',
    designation: 'Assistant Professor',
    expertise: 'Edge Computing, Fog Networks, Distributed Systems',
    subjectCode: 'EDGE-502',
    subjectName: 'Edge Computing & Distributed Systems',
  },
  {
    name: 'Dr. Rekha Chaudhary',
    email: 'rekha.chaudhary@teacherscommunity.com',
    phone: '+91 94230 88776',
    university: 'Walchand College of Engineering Sangli',
    department: 'Computer Engineering',
    designation: 'Associate Professor',
    expertise: 'Compiler Design, Automata Theory, Formal Languages',
    subjectCode: 'COMP-303',
    subjectName: 'Compiler Design & Theory of Computation',
  },
  {
    name: 'Prof. Mahesh Bapat',
    email: 'mahesh.bapat@teacherscommunity.com',
    phone: '+91 98900 11223',
    university: 'PICT Pune',
    department: 'Computer Science',
    designation: 'Assistant Professor',
    expertise: 'Mobile Application Development, Flutter, React Native, UI/UX Engineering',
    subjectCode: 'MOB-402',
    subjectName: 'Cross-Platform Mobile App Engineering',
  },
  {
    name: 'Dr. Swati Korde',
    email: 'swati.korde@teacherscommunity.com',
    phone: '+91 98201 44556',
    university: 'K. J. Somaiya College of Engineering Mumbai',
    department: 'Artificial Intelligence',
    designation: 'Associate Professor',
    expertise: 'Reinforcement Learning, Robotics, Autonomous Systems',
    subjectCode: 'ROBOT-802',
    subjectName: 'Reinforcement Learning & Autonomous Robotics',
  },
  {
    name: 'Prof. Rahul Tandon',
    email: 'rahul.tandon@teacherscommunity.com',
    phone: '+91 98400 55667',
    university: 'SRM Institute of Science and Technology',
    department: 'Information Technology',
    designation: 'Assistant Professor',
    expertise: 'Full Stack Web Development, MERN Stack, GraphQL API Design',
    subjectCode: 'MERN-103',
    subjectName: 'Full-Stack JavaScript & Modern Web APIs',
  },
  {
    name: 'Dr. Neha Agarwal',
    email: 'neha.agarwal@teacherscommunity.com',
    phone: '+91 98140 22334',
    university: 'Thapar Institute of Engineering & Technology',
    department: 'Computer Engineering',
    designation: 'Associate Professor',
    expertise: 'Data Mining, Knowledge Graphs, Semantic Web',
    subjectCode: 'DM-104',
    subjectName: 'Data Mining & Knowledge Graph Engineering',
  },
  {
    name: 'Prof. Santosh Shinde',
    email: 'santosh.shinde@teacherscommunity.com',
    phone: '+91 98224 77889',
    university: 'Bharati Vidyapeeth Pune',
    department: 'Computer Applications',
    designation: 'Assistant Professor',
    expertise: 'Information Retrieval, Web Search Engines, Data Warehousing',
    subjectCode: 'IR-604',
    subjectName: 'Information Retrieval & Web Search Algorithms',
  },
  {
    name: 'Dr. Aparna Vengurlekar',
    email: 'aparna.vengurlekar@teacherscommunity.com',
    phone: '+91 94220 33445',
    university: 'Government College of Engineering Karad',
    department: 'Data Science & AI',
    designation: 'Associate Professor',
    expertise: 'Bio-Informatics, Computational Biology, Machine Learning in Healthcare',
    subjectCode: 'BIO-503',
    subjectName: 'Computational Biology & Healthcare Analytics',
  },
  {
    name: 'Prof. Harish Nair',
    email: 'harish.nair@teacherscommunity.com',
    phone: '+91 94470 11223',
    university: 'Amrita Vishwa Vidyapeetham',
    department: 'Computer Engineering',
    designation: 'Assistant Professor',
    expertise: 'Quantum Computing, Quantum Cryptography, Discrete Mathematics',
    subjectCode: 'QUANT-902',
    subjectName: 'Introduction to Quantum Computing Algorithms',
  },
  {
    name: 'Dr. Vaishali Kale',
    email: 'vaishali.kale@teacherscommunity.com',
    phone: '+91 98231 66778',
    university: 'Cummins College of Engineering Pune',
    department: 'Information Technology',
    designation: 'Associate Professor',
    expertise: 'Cloud Security, Identity & Access Management, Serverless Computing',
    subjectCode: 'CC-601',
    subjectName: 'Cloud Security Architecture & Serverless Systems',
  },
];

async function main() {
  console.log('Starting comprehensive data seeding for Teachers-Community...');

  // Clean existing data in proper dependency order
  console.log('Cleaning existing records...');
  await prisma.teachingResource.deleteMany();
  await prisma.videoLecture.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.researchPublication.deleteMany();
  await prisma.workshopFDP.deleteMany();
  await prisma.certificate.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.education.deleteMany();
  await prisma.workExperience.deleteMany();
  await prisma.galleryItem.deleteMany();
  await prisma.contactMessage.deleteMany();
  await prisma.studentProfile.deleteMany();
  await prisma.teacherProfile.deleteMany();
  await prisma.teacherRequest.deleteMany();
  await prisma.user.deleteMany();

  // 1. Create Admin Account
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@teacherscommunity.com',
      password: 'admin123',
      name: 'System Administrator',
      role: Role.ADMIN,
      isFirstLogin: false,
    },
  });
  console.log('✅ Admin Account created:', adminUser.email);

  // 2. Create Student Account
  const studentUser = await prisma.user.create({
    data: {
      email: 'student@teacherscommunity.com',
      password: 'student123',
      name: 'Rohan Sharma',
      role: Role.STUDENT,
      isFirstLogin: false,
      studentProfile: {
        create: {
          university: 'Mumbai University',
          department: 'Computer Engineering',
          yearOfStudy: 'TE',
        },
      },
    },
  });
  console.log('✅ Student Account created:', studentUser.email);

  // 3. Create 25 Teachers with all relations
  let totalBlogsCount = 0;
  let totalCertificatesCount = 0;
  let totalWorkshopsCount = 0;
  let totalEducationCount = 0;
  let totalExperienceCount = 0;
  let totalPublicationsCount = 0;
  let totalResourcesCount = 0;

  for (let idx = 0; idx < TEACHERS_DATA.length; idx++) {
    const t = TEACHERS_DATA[idx];
    const indexStr = (idx + 1).toString().padStart(2, '0');

    // Create User & Teacher Profile
    const teacherUser = await prisma.user.create({
      data: {
        email: t.email,
        password: 'teacher123',
        name: t.name,
        phone: t.phone,
        role: Role.TEACHER,
        isFirstLogin: false,
        teacherProfile: {
          create: {
            fullName: t.name,
            designation: t.designation,
            department: t.department,
            university: t.university,
            expertise: t.expertise,
            heroTitle: `${t.designation} in ${t.department}`,
            heroSubtitle: `Dedicated educator & academic mentor at ${t.university}. Specializing in ${t.expertise}.`,
            bioText: `${t.name} is a distinguished faculty member at ${t.university} with over 10+ years of research and teaching experience. Focus areas include ${t.expertise}.`,
            phdSummary: `Ph.D in ${t.department} focusing on advanced research in ${t.expertise.split(',')[0]}. Awarded for outstanding doctoral thesis research.`,
            officeAddress: `Department of ${t.department}, ${t.university} Main Campus, Room ${101 + idx}`,
            contactEmail: t.email,
            contactPhone: t.phone,
            googleScholarUrl: `https://scholar.google.com/citations?user=scholar_${idx + 1}`,
            linkedInUrl: `https://linkedin.com/in/${t.name.toLowerCase().replace(/[^a-z]/g, '')}`,
            researchGateUrl: `https://researchgate.net/profile/${t.name.toLowerCase().replace(/[^a-z]/g, '_')}`,
            orcidUrl: `https://orcid.org/0000-0002-${(1000 + idx).toString()}-9900`,
          },
        },
      },
      include: { teacherProfile: true },
    });

    const teacherProfileId = teacherUser.teacherProfile!.id;

    // A) 3 Education Records
    const educationItems = [
      {
        degree: `Ph.D. in ${t.department}`,
        institution: `${t.university}`,
        year: '2016 - 2020',
        description: `Research focused on ${t.expertise.split(',')[0]} under doctoral grant fellowship.`,
      },
      {
        degree: `M.Tech / M.E. in ${t.department}`,
        institution: 'IIT Bombay / VJTI Mumbai',
        year: '2013 - 2015',
        description: 'First Class with Distinction. Specialization project in advanced computer systems.',
      },
      {
        degree: `B.Tech / B.E. in ${t.department}`,
        institution: 'Pune University / Mumbai University',
        year: '2009 - 2013',
        description: 'Graduated with Distinction. Lead student coordinator for annual technical symposium.',
      },
    ];
    for (const edu of educationItems) {
      await prisma.education.create({
        data: { teacherId: teacherProfileId, ...edu },
      });
      totalEducationCount++;
    }

    // B) 3 Work Experience Records
    const experienceItems = [
      {
        role: t.designation,
        organization: t.university,
        period: '2021 - Present',
        description: `Leading research projects, curriculum development, and mentoring undergraduate and postgraduate students in ${t.expertise}.`,
      },
      {
        role: 'Assistant Professor',
        organization: 'K. J. Somaiya College of Engineering / SPIT Mumbai',
        period: '2017 - 2021',
        description: 'Taught core departmental courses, guided senior year capstone projects, organized national level hackathons.',
      },
      {
        role: 'Senior Software Engineer / Research Associate',
        organization: 'Tata Consultancy Services / Infosys Labs',
        period: '2015 - 2017',
        description: 'Worked on enterprise software modernization and applied machine learning prototypes.',
      },
    ];
    for (const exp of experienceItems) {
      await prisma.workExperience.create({
        data: { teacherId: teacherProfileId, ...exp },
      });
      totalExperienceCount++;
    }

    // C) 5 to 6 Certificate Records (6 per teacher = 150 total)
    const certificateItems = [
      {
        title: `AWS Certified Solutions Architect - Associate (${t.name})`,
        issuingOrganization: 'Amazon Web Services (AWS)',
        issueDate: new Date('2023-05-15'),
        credentialId: `AWS-CERT-${indexStr}-101`,
        credentialUrl: 'https://aws.amazon.com/verification',
      },
      {
        title: `NPTEL Elite + Gold Medal: Advanced ${t.expertise.split(',')[0]}`,
        issuingOrganization: 'IIT Madras / NPTEL',
        issueDate: new Date('2023-11-20'),
        credentialId: `NPTEL23CS${indexStr}99`,
        credentialUrl: 'https://nptel.ac.in/noc',
      },
      {
        title: `IBM Professional Certificate in ${t.expertise.split(',')[1] || 'Artificial Intelligence'}`,
        issuingOrganization: 'IBM Education',
        issueDate: new Date('2022-08-10'),
        credentialId: `IBM-${indexStr}-9872`,
        credentialUrl: 'https://coursera.org/verify/ibm',
      },
      {
        title: `Google Cloud Certified Professional Cloud Architect`,
        issuingOrganization: 'Google Cloud Platform',
        issueDate: new Date('2024-01-12'),
        credentialId: `GCP-ARCH-${indexStr}-44`,
        credentialUrl: 'https://cloud.google.com/certification',
      },
      {
        title: `Microsoft Certified Educator (MCE) & Azure AI Engineer`,
        issuingOrganization: 'Microsoft Corporation',
        issueDate: new Date('2022-03-30'),
        credentialId: `MSFT-EDU-${indexStr}-77`,
        credentialUrl: 'https://learn.microsoft.com/credentials',
      },
      {
        title: `Coursera Specialization: Deep Learning & Modern Frameworks`,
        issuingOrganization: 'DeepLearning.AI / Coursera',
        issueDate: new Date('2021-10-05'),
        credentialId: `DL-COURSERA-${indexStr}-05`,
        credentialUrl: 'https://coursera.org/verify/specialization',
      },
    ];
    for (const cert of certificateItems) {
      await prisma.certificate.create({
        data: { teacherId: teacherProfileId, ...cert },
      });
      totalCertificatesCount++;
    }

    // D) 3 Workshop / FDP Records
    const workshopItems = [
      {
        title: `National Level 5-Day FDP on ${t.expertise.split(',')[0]} & Next-Gen Technologies`,
        type: EventType.FDP,
        role: EventRole.ATTENDED,
        venue: `${t.university} Department Campus`,
        startDate: new Date('2023-07-10'),
        endDate: new Date('2023-07-14'),
        description: `Attended intensive 5-day national faculty development workshop funded by AICTE ATAL academy.`,
      },
      {
        title: `National Workshop on Modern Research Methodologies & Paper Writing`,
        type: EventType.WORKSHOP,
        role: EventRole.ORGANIZED,
        venue: `Central Auditorium, ${t.university}`,
        startDate: new Date('2023-12-04'),
        endDate: new Date('2023-12-06'),
        description: `Served as Convenor for 3-day workshop for PhD research scholars across the state.`,
      },
      {
        title: `STTP on Cloud Native Infrastructure & Microservices Architecture`,
        type: EventType.STTP,
        role: EventRole.RESOURCE_PERSON,
        venue: `Online Mode / Hybrid Auditorium`,
        startDate: new Date('2024-02-19'),
        endDate: new Date('2024-02-23'),
        description: `Delivered keynote lectures and hands-on lab sessions as Resource Person.`,
      },
    ];
    for (const wrk of workshopItems) {
      await prisma.workshopFDP.create({
        data: { teacherId: teacherProfileId, ...wrk },
      });
      totalWorkshopsCount++;
    }

    // E) 3 Research Publications
    const publicationItems = [
      {
        title: `Novel Framework for ${t.expertise.split(',')[0]} in High-Throughput Environments`,
        authors: `${t.name}, A. Sharma, R. Kulkarni`,
        journalOrConference: 'IEEE Transactions on Computers & Systems',
        year: 2023,
        doi: `10.1109/TC.2023.${100000 + idx}`,
        category: PublicationCategory.JOURNAL_PUBLICATION,
        publisher: 'IEEE Computer Society',
      },
      {
        title: `Comparative Analysis of ${t.expertise.split(',')[1] || 'Algorithms'} in Modern Computing Paradigms`,
        authors: `${t.name}, P. Verma, S. Nambiar`,
        journalOrConference: 'Springer Journal of Supercomputing',
        year: 2022,
        doi: `10.1007/s11227-022-${5000 + idx}`,
        category: PublicationCategory.JOURNAL_PUBLICATION,
        publisher: 'Springer Nature',
      },
      {
        title: `Implementation Strategies for Scalable ${t.expertise.split(',')[0]} Applications`,
        authors: `${t.name}, V. Deshmukh`,
        journalOrConference: 'International Conference on Machine Learning & Systems (ICMLS 2024)',
        year: 2024,
        doi: `10.1145/3580000.${3580100 + idx}`,
        category: PublicationCategory.CONFERENCE_PAPER,
        publisher: 'ACM Digital Library',
      },
    ];
    for (const pub of publicationItems) {
      await prisma.researchPublication.create({
        data: { teacherId: teacherProfileId, ...pub },
      });
      totalPublicationsCount++;
    }

    // F) 5 Blog Posts per Teacher (125 total blogs)
    const blogTopics = [
      {
        title: `Comprehensive Guide to ${t.expertise.split(',')[0]} in Modern Engineering`,
        slug: `t${indexStr}-guide-to-${t.expertise.split(',')[0].toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        summary: `Explore core principles, architectural paradigms, and real-world industrial implementations of ${t.expertise.split(',')[0]}.`,
        content: `
# Introduction to ${t.expertise.split(',')[0]}

${t.expertise.split(',')[0]} represents one of the most critical foundational pillars in modern academic research and computer engineering practice. In this article, we delve deep into the core mechanics, system design guidelines, and industry standards.

## Key Theoretical Concepts
1. **Scalability & Resiliency**: Ensuring system performance scales linearly with hardware capacity.
2. **Security Mechanisms**: Standardizing authentication, encryption, and zero-trust protocol designs.
3. **Optimized Execution**: Minimizing computational latency and memory consumption.

## Practical Recommendations for Students
- Practice hands-on implementation using open-source tools.
- Read seminal research papers from IEEE and ACM digital libraries.
- Build end-to-end projects demonstrating real-time problem solving.
        `,
      },
      {
        title: `Best Practices in ${t.expertise.split(',')[1] || 'System Architecture'}: Industry Case Studies`,
        slug: `t${indexStr}-best-practices-${(t.expertise.split(',')[1] || 'system').toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        summary: `A detailed breakdown of design patterns, anti-patterns, and optimization techniques for ${t.expertise.split(',')[1] || 'modern systems'}.`,
        content: `
# Best Practices and Architecture Guidelines

When engineering high-availability academic and enterprise systems, developers must adhere to strict modular design standards.

### Architectural Principles
- **Decoupled Components**: Isolate services using clean REST and gRPC API boundaries.
- **Automated Testing**: Implement CI/CD pipelines with comprehensive unit and integration tests.
- **Monitoring & Telemetry**: Collect real-time metrics using Prometheus and Grafana dashboards.

Stay tuned for our upcoming lab sessions where we implement these design patterns step by step!
        `,
      },
      {
        title: `Emerging Trends & Future Directions in ${t.department}`,
        slug: `t${indexStr}-emerging-trends-${t.department.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        summary: `Examining technological shifts, AI integration, and key research opportunities in ${t.department}.`,
        content: `
# Emerging Trends in ${t.department}

The landscape of ${t.department} is evolving rapidly driven by artificial intelligence, cloud automation, and edge infrastructure.

### Critical Research Areas for 2024-2026
- Autonomous systems and edge intelligence.
- Privacy-preserving computational techniques.
- Sustainable and energy-efficient algorithms.

Students interested in joining our research group are encouraged to review our published papers.
        `,
      },
      {
        title: `How to Prepare for University Semester Exams & Technical Interviews`,
        slug: `t${indexStr}-exam-and-interview-prep-guide`,
        summary: `Actionable strategies, note-taking frameworks, and subject revision tips for engineering students.`,
        content: `
# Exam & Interview Preparation Roadmap

Preparing effectively for university examinations requires a structured approach to syllabus coverage and practical problem-solving.

### Step-by-Step Preparation Checklist
1. Review previous year university question papers (Question Banks available on our portal).
2. Create concise formula sheets and architectural diagram flashcards.
3. Code solutions to standard algorithms from scratch without external libraries.
4. Participate in peer review study sessions to test core concepts.
        `,
      },
      {
        title: `Research Methodology & Writing High-Impact Scopus/IEEE Papers`,
        slug: `t${indexStr}-research-methodology-paper-writing`,
        summary: `A mentor's guide on selecting research problems, conducting literature surveys, and drafting manuscript submissions.`,
        content: `
# Writing High-Impact Academic Manuscripts

Publishing research in reputed journals requires clarity of thought, rigorous empirical evaluation, and proper citation ethics.

### Key Sections of a Research Paper
- **Abstract & Keywords**: Summarize problem statement, methodology, and quantitative findings in under 250 words.
- **Literature Review**: Identify explicit gaps in existing literature.
- **Methodology & Mathematical Formulation**: Clearly state assumptions, algorithms, and equations.
- **Results & Comparison**: Benchmark against state-of-the-art baselines.
        `,
      },
    ];

    for (const b of blogTopics) {
      await prisma.blogPost.create({
        data: {
          teacherId: teacherProfileId,
          title: b.title,
          slug: b.slug,
          summary: b.summary,
          content: b.content,
          coverImage: `/images/profile.jpg`,
          isPublished: true,
          viewCount: Math.floor(150 + Math.random() * 800),
          estimatedReadingMinutes: Math.floor(3 + Math.random() * 5),
          totalEngagementSeconds: Math.floor(120 + Math.random() * 600),
        },
      });
      totalBlogsCount++;
    }

    // G) 1 Subject per teacher with 3 Teaching Resources (1 Notes, 1 PPT, 1 Question Bank)
    const subject = await prisma.subject.create({
      data: {
        teacherId: teacherProfileId,
        code: t.subjectCode,
        name: t.subjectName,
        department: t.department,
        semester: `Semester ${(idx % 8) + 1}`,
        description: `Official university syllabus course covering ${t.expertise}. Designed for ${t.department} students.`,
      },
    });

    // 3 Resources per subject (Notes, PPT, Question Bank)
    const resourceTypes = [
      {
        title: `${t.subjectName} - Complete Lecture Notes & Reference Modules (PDF)`,
        type: ResourceType.NOTES,
        fileUrl: '/uploads/sample_notes.pdf',
        fileType: 'pdf',
        description: `Detailed chapter-wise lecture notes covering all modules for ${t.subjectName}. Includes solved numericals and diagrams.`,
      },
      {
        title: `${t.subjectName} - Classroom Presentation Deck (PPT)`,
        type: ResourceType.PPT,
        fileUrl: '/uploads/sample_ppt.pdf',
        fileType: 'pdf',
        description: `Official classroom lecture slide deck (PPTX format converted to PDF) used for university lectures.`,
      },
      {
        title: `${t.subjectName} - University Question Bank & Solution Key (PDF)`,
        type: ResourceType.QUESTION_BANK,
        fileUrl: '/uploads/sample_qb.pdf',
        fileType: 'pdf',
        description: `Curated bank of previous 5-year university exam questions categorized by module with model answers.`,
      },
    ];

    for (const res of resourceTypes) {
      await prisma.teachingResource.create({
        data: {
          teacherId: teacherProfileId,
          subjectId: subject.id,
          title: res.title,
          resourceType: res.type,
          fileUrl: res.fileUrl,
          fileType: res.fileType,
          description: res.description,
        },
      });
      totalResourcesCount++;
    }

    // Add 1 Video Lecture per subject
    await prisma.videoLecture.create({
      data: {
        teacherId: teacherProfileId,
        subjectId: subject.id,
        title: `${t.subjectName} - Module 1 Masterclass Lecture`,
        youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        youtubeId: 'dQw4w9WgXcQ',
        description: `Video recording of classroom lecture covering foundational concepts of ${t.subjectName}.`,
      },
    });

    // Also populate an approved TeacherRequest item for admin review demonstration
    await prisma.teacherRequest.create({
      data: {
        name: t.name,
        email: t.email,
        phone: t.phone,
        university: t.university,
        department: t.department,
        designation: t.designation,
        expertise: t.expertise,
        note: `Approved teacher profile created during database seeding.`,
        status: 'APPROVED',
      },
    });

    console.log(` Teachers Seeded: [${indexStr}/25] ${t.name} (${t.university})`);
  }

  // Also add 5 pending teacher requests for Admin Dashboard demonstration
  const pendingRequestsData = [
    {
      name: 'Dr. Harshvardhan Joshi',
      email: 'harshvardhan.joshi@university.edu',
      phone: '+91 98111 22334',
      university: 'Mumbai University',
      department: 'Computer Engineering',
      designation: 'Associate Professor',
      expertise: 'Deep Learning, Computer Vision, Python',
      note: 'Requesting teacher profile creation for accessing departmental resources and sharing PPTs.',
    },
    {
      name: 'Prof. Anjali Saxena',
      email: 'anjali.saxena@sppu.edu',
      phone: '+91 98222 33445',
      university: 'SPPU Pune',
      department: 'Information Technology',
      designation: 'Assistant Professor',
      expertise: 'Cloud Computing, DevOps, Kubernetes',
      note: 'Faculty coordinator for cloud computing lab looking to upload notes.',
    },
    {
      name: 'Dr. Madhavan Pillai',
      email: 'madhavan.pillai@vjti.ac.in',
      phone: '+91 98333 44556',
      university: 'VJTI Mumbai',
      department: 'Data Science',
      designation: 'Professor',
      expertise: 'Big Data, Hadoop, Spark, Data Mining',
      note: 'Need access to publish academic blog posts and share question banks.',
    },
    {
      name: 'Prof. Archana Kadam',
      email: 'archana.kadam@shivaji.edu',
      phone: '+91 98444 55667',
      university: 'Shivaji University Kolhapur',
      department: 'Computer Applications',
      designation: 'Assistant Professor',
      expertise: 'Web Technologies, Full Stack JavaScript',
      note: 'Interested in sharing web development tutorial notes with students.',
    },
    {
      name: 'Dr. Sameer Shinde',
      email: 'sameer.shinde@coep.ac.in',
      phone: '+91 98555 66778',
      university: 'COEP Technological University',
      department: 'Cybersecurity',
      designation: 'Associate Professor',
      expertise: 'Ethical Hacking, Network Security, Malware Analysis',
      note: 'Faculty profile request for cybersecurity research domain.',
    },
  ];

  for (const pr of pendingRequestsData) {
    await prisma.teacherRequest.create({
      data: {
        name: pr.name,
        email: pr.email,
        phone: pr.phone,
        university: pr.university,
        department: pr.department,
        designation: pr.designation,
        expertise: pr.expertise,
        note: pr.note,
        status: 'PENDING',
      },
    });
  }

  console.log('\n==================================================');
  console.log('🎉 SEEDING COMPLETED SUCCESSFULLY!');
  console.log(`- Teachers Seeded:         ${TEACHERS_DATA.length} Accounts`);
  console.log(`- Education Records:       ${totalEducationCount} Records (3 per teacher)`);
  console.log(`- Work Experience Records: ${totalExperienceCount} Records (3 per teacher)`);
  console.log(`- Certificates Seeded:     ${totalCertificatesCount} Certificates (6 per teacher)`);
  console.log(`- Workshops/FDPs Seeded:   ${totalWorkshopsCount} Events (3 per teacher)`);
  console.log(`- Research Publications:   ${totalPublicationsCount} Papers (3 per teacher)`);
  console.log(`- Blog Posts Published:    ${totalBlogsCount} Articles (5 per teacher)`);
  console.log(`- Teaching Resources:      ${totalResourcesCount} Files (Notes, PPTs, Question Banks)`);
  console.log(`- Admin Account:           admin@teacherscommunity.com (Password: admin123)`);
  console.log(`- Student Account:         student@teacherscommunity.com (Password: student123)`);
  console.log(`- Default Teacher Password: teacher123`);
  console.log('==================================================\n');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

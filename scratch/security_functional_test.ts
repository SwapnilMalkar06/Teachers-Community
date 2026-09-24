import { PrismaClient } from '@prisma/client';
import { parseSessionCookie, serializeSession, AuthSession } from '../src/lib/auth';

const prisma = new PrismaClient();

async function runSecurityAndFunctionalTestSuite() {
  console.log('========================================================================');
  console.log('🔒 STARTING FULL PROJECT SECURITY & FUNCTIONAL VERIFICATION TEST SUITE');
  console.log('========================================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, title: string, details?: string) {
    if (condition) {
      console.log(`  ✓ [PASS] ${title}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${title} ${details ? `- ${details}` : ''}`);
      failed++;
    }
  }

  try {
    // ------------------------------------------------------------------------
    // SECTION 1: AUTHENTICATION & ROLE-BASED ACCESS CONTROL (RBAC) SECURITY
    // ------------------------------------------------------------------------
    console.log('🛡️ SECTION 1: AUTHENTICATION & RBAC SECURITY CHECKS');

    // 1.1 Cookie Parsing & Base64 Security
    const sampleSession: AuthSession = {
      userId: 'test-user-id-123',
      email: 'security.test@example.com',
      name: 'Security Test User',
      role: 'TEACHER',
      teacherId: 'teacher-profile-id-456'
    };
    const serialized = serializeSession(sampleSession);
    const parsed = parseSessionCookie(serialized);
    assert(parsed?.userId === 'test-user-id-123' && parsed?.role === 'TEACHER', 'Session cookie serialization and deserialization');

    // 1.2 Invalid Cookie Tamper Resistance
    const invalidCookie = parseSessionCookie('invalid_base64_string_xyz_!@#');
    assert(invalidCookie === null, 'Rejects invalid/malformed authentication cookies gracefully');

    const tamperedJsonCookie = Buffer.from(JSON.stringify({ malformed: true })).toString('base64');
    assert(parseSessionCookie(tamperedJsonCookie) === null, 'Rejects cookies missing mandatory userId/role fields');


    // ------------------------------------------------------------------------
    // SECTION 2: DATABASE & MODEL INTEGRITY AUDIT
    // ------------------------------------------------------------------------
    console.log('\n🗄️ SECTION 2: DATABASE SCHEMAS & RELATION INTEGRITY CHECKS');

    // 2.1 User & TeacherProfile Cascade / Relation Check
    const testUserEmail = `sec.user.${Date.now()}@example.com`;
    const createdUser = await prisma.user.create({
      data: {
        email: testUserEmail,
        name: 'Security Tester',
        password: 'secure_hashed_password',
        role: 'TEACHER',
      }
    });
    assert(!!createdUser.id, 'User record creation with default role assignments');

    const createdTeacher = await prisma.teacherProfile.create({
      data: {
        userId: createdUser.id,
        fullName: 'Dr. Security Auditor',
        designation: 'Associate Professor',
        department: 'Information Technology',
        university: 'Mumbai University',
        heroSubtitle: 'Security & Systems Academic Researcher',
        bioText: 'Academic bio text detailing security research and teaching expertise.',
        contactEmail: testUserEmail,
      }
    });
    assert(!!createdTeacher.id && createdTeacher.userId === createdUser.id, 'TeacherProfile relation linkage to User');

    // 2.2 Education & WorkExperience Ownership Models
    const edu = await prisma.education.create({
      data: {
        teacherId: createdTeacher.id,
        degree: 'Ph.D. in Cyber Security',
        institution: 'IIT Bombay',
        year: '2020',
        description: 'Vulnerability analysis and cloud security'
      }
    });
    assert(!!edu.id, 'Education entry created and linked to Teacher Profile');

    const exp = await prisma.workExperience.create({
      data: {
        teacherId: createdTeacher.id,
        role: 'Assistant Professor',
        organization: 'VJTI Mumbai',
        period: '2020 - Present',
      }
    });
    assert(!!exp.id, 'Work Experience entry created and linked to Teacher Profile');

    // 2.3 Scholarly Publications & FDPs & Certificates
    const pub = await prisma.researchPublication.create({
      data: {
        teacherId: createdTeacher.id,
        title: 'Zero-Trust Architecture in Microservice Environments',
        authors: 'Dr. Security Auditor, Prof. Ashwini Sawant',
        journalOrConference: 'IEEE Transactions on Dependable and Secure Computing',
        year: 2024,
        category: 'JOURNAL_PUBLICATION'
      }
    });
    assert(!!pub.id, 'Research Publication created with valid category enum');

    const fdp = await prisma.workshopFDP.create({
      data: {
        teacherId: createdTeacher.id,
        title: 'Cyber Security & Ethical Hacking FDP',
        type: 'FDP',
        role: 'RESOURCE_PERSON',
        venue: 'Mumbai University',
        startDate: new Date(),
      }
    });
    assert(!!fdp.id, 'Workshop/FDP entry created with valid EventType and EventRole');

    const cert = await prisma.certificate.create({
      data: {
        teacherId: createdTeacher.id,
        title: 'Certified Information Systems Security Professional (CISSP)',
        issuingOrganization: 'ISC2',
        issueDate: new Date(),
      }
    });
    assert(!!cert.id, 'Certificate record created successfully');


    // ------------------------------------------------------------------------
    // SECTION 3: ACADEMIC RESOURCE & FILE UPLOAD AUDIT
    // ------------------------------------------------------------------------
    console.log('\n📚 SECTION 3: TEACHING RESOURCES & FILE UPLOAD FUNCTIONALITY');

    // 3.1 Subject & Resource Creation
    const subjectCode = `CS-SEC-${Date.now()}`;
    const subject = await prisma.subject.create({
      data: {
        teacherId: createdTeacher.id,
        code: subjectCode,
        name: 'Information & Network Security',
        department: 'Computer Engineering',
        semester: 'Semester 7',
      }
    });
    assert(!!subject.id, 'Academic Subject creation with unique code');

    const resource = await prisma.teachingResource.create({
      data: {
        teacherId: createdTeacher.id,
        subjectId: subject.id,
        title: 'Module 1: Cryptography & Key Management Notes',
        resourceType: 'NOTES',
        fileUrl: '/uploads/sample-crypto-notes.pdf',
        fileType: 'pdf',
      }
    });
    assert(!!resource.id && resource.resourceType === 'NOTES', 'Teaching Resource record created with file URL binding');

    const video = await prisma.videoLecture.create({
      data: {
        teacherId: createdTeacher.id,
        subjectId: subject.id,
        title: 'Public Key Infrastructure (PKI) Deep Dive',
        youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        youtubeId: 'dQw4w9WgXcQ',
      }
    });
    assert(!!video.id && video.youtubeId === 'dQw4w9WgXcQ', 'Video Lecture entry created with extracted YouTube ID');


    // ------------------------------------------------------------------------
    // SECTION 4: DATA CLEANUP & ISOLATION SANITY
    // ------------------------------------------------------------------------
    console.log('\n🧹 SECTION 4: CLEANUP & ISOLATION VERIFICATION');

    await prisma.teacherProfile.delete({ where: { id: createdTeacher.id } }); // Triggers cascade deletion of Edu, Exp, Pubs, etc.
    
    const verifyDeletedTeacher = await prisma.teacherProfile.findUnique({ where: { id: createdTeacher.id } });
    assert(verifyDeletedTeacher === null, 'Deleting TeacherProfile removes profile cleanly');

    const verifyDeletedEdu = await prisma.education.findUnique({ where: { id: edu.id } });
    assert(verifyDeletedEdu === null, 'Cascade onDelete: Cascade removes Education entries');

    const verifyDeletedPub = await prisma.researchPublication.findUnique({ where: { id: pub.id } });
    assert(verifyDeletedPub === null, 'Cascade onDelete: Cascade removes Research Publication entries');

    await prisma.user.delete({ where: { id: createdUser.id } });
    const verifyDeletedUser = await prisma.user.findUnique({ where: { id: createdUser.id } });
    assert(verifyDeletedUser === null, 'User deletion removes user account');

    console.log('\n========================================================================');
    console.log(`📊 FINAL TEST SUITE RESULTS: ${passed} PASSED / ${failed} FAILED`);
    console.log('========================================================================\n');

    if (failed > 0) {
      process.exit(1);
    }

  } catch (error) {
    console.error('\n❌ TEST SUITE FAILED WITH EXCEPTION:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runSecurityAndFunctionalTestSuite();

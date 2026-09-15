import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Fetching all teacher records from database...\n');

  const teachers = await prisma.teacherProfile.findMany({
    include: {
      user: true,
      subjects: true,
      resources: true,
      blogs: true,
    },
  });

  console.log(`Total Teachers Found: ${teachers.length}\n`);

  teachers.forEach((t, i) => {
    console.log(`--- Teacher ${i + 1} ---`);
    console.log(`Full Name:   ${t.fullName}`);
    console.log(`Designation: ${t.designation}`);
    console.log(`Department:  ${t.department}`);
    console.log(`University:  ${t.university}`);
    console.log(`Expertise:   ${t.expertise}`);
    console.log(`Email:       ${t.contactEmail || t.user?.email}`);
    console.log(`Phone:       ${t.contactPhone || t.user?.phone}`);
    console.log(`Password:    teacher123 (Default Seed Password)`);
    console.log(`Subjects:    ${t.subjects.map(s => s.name).join(', ')}`);
    console.log(`Resources:   ${t.resources.length} files (Notes, PPTs, Question Banks)`);
    console.log(`Blog Posts:  ${t.blogs.length} articles published\n`);
  });

  const requests = await prisma.teacherRequest.findMany();
  console.log(`Total Teacher Join Requests: ${requests.length}`);
  requests.forEach((r, i) => {
    console.log(`Request ${i + 1}: ${r.name} (${r.email}) - Status: ${r.status}, OTP: ${r.otp || 'N/A'}, Phone: ${r.phone}`);
  });
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());

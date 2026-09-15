import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding clean database for Teachers-Community multi-teacher platform...');

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

  console.log('Clean database seeding finished! (No default teacher accounts created).');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

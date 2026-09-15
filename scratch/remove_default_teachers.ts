import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Removing all default dummy teacher records from database...\n');

  const defaultEmails = [
    'ashwini@teacherscommunity.com',
    'rajesh@teacherscommunity.com',
    'sunita@teacherscommunity.com',
  ];

  const defaultUsers = await prisma.user.findMany({
    where: {
      email: { in: defaultEmails },
    },
    include: {
      teacherProfile: true,
    },
  });

  const teacherProfileIds = defaultUsers
    .map((u) => u.teacherProfile?.id)
    .filter((id): id is string => Boolean(id));

  console.log(`Found ${defaultUsers.length} default teacher user accounts.`);

  if (teacherProfileIds.length > 0) {
    // Delete resources, subjects, publications, and blogs associated with default teachers
    await prisma.teachingResource.deleteMany({
      where: { teacherId: { in: teacherProfileIds } },
    });
    await prisma.subject.deleteMany({
      where: { teacherId: { in: teacherProfileIds } },
    });
    await prisma.researchPublication.deleteMany({
      where: { teacherId: { in: teacherProfileIds } },
    });
    await prisma.blogPost.deleteMany({
      where: { teacherId: { in: teacherProfileIds } },
    });
    await prisma.teacherProfile.deleteMany({
      where: { id: { in: teacherProfileIds } },
    });
  }

  // Delete the default user records
  await prisma.user.deleteMany({
    where: {
      email: { in: defaultEmails },
    },
  });

  console.log('Successfully purged default teacher records!\n');

  const remainingUsers = await prisma.user.findMany({
    include: { teacherProfile: true },
  });

  console.log(`Remaining Users in Database (${remainingUsers.length}):`);
  remainingUsers.forEach((u, i) => {
    console.log(`${i + 1}. ${u.name} | ${u.email} | Role: ${u.role}`);
  });
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());

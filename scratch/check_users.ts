import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    include: {
      teacherProfile: true,
      studentProfile: true,
    },
  });

  console.log(`Total Users in Database: ${users.length}\n`);
  users.forEach((u, i) => {
    console.log(`User ${i + 1}: ${u.name} | Email: ${u.email} | Role: ${u.role} | TeacherProfile: ${u.teacherProfile ? 'YES' : 'NO'}`);
  });
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());

import { PrismaClient } from '@prisma/client';
import { sendSMSOTP, generate6DigitOTP } from '../src/lib/sms';

const prisma = new PrismaClient();

async function main() {
  const targetPhone = '+91 7410147591';
  const targetEmail = 'ashwini.savant@university.edu';
  const name = 'Dr. Ashwini Savant';

  console.log(`Checking database for teacher request with phone ${targetPhone}...`);

  // Update or create TeacherRequest with user's mobile number
  let request = await prisma.teacherRequest.findFirst({
    where: { email: targetEmail },
  });

  const otp = generate6DigitOTP();
  const otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000);

  if (request) {
    request = await prisma.teacherRequest.update({
      where: { id: request.id },
      data: {
        phone: targetPhone,
        otp: otp,
        otpExpiresAt: otpExpiresAt,
        status: 'PENDING',
      },
    });
    console.log(`Updated existing teacher request ID ${request.id} with phone ${targetPhone}`);
  } else {
    request = await prisma.teacherRequest.create({
      data: {
        name: name,
        email: targetEmail,
        phone: targetPhone,
        designation: 'Associate Professor',
        department: 'Computer Science & Engineering',
        university: 'Mumbai University',
        expertise: 'Artificial Intelligence & Machine Learning',
        note: 'Requesting teacher portal access for academic resource sharing.',
        status: 'PENDING',
        otp: otp,
        otpExpiresAt: otpExpiresAt,
      },
    });
    console.log(`Created new pending teacher request ID ${request.id} with phone ${targetPhone}`);
  }

  // Also update User record if exists
  const existingUser = await prisma.user.findUnique({
    where: { email: targetEmail },
  });

  if (existingUser) {
    await prisma.user.update({
      where: { id: existingUser.id },
      data: {
        phone: targetPhone,
        otp: otp,
        otpExpiresAt: otpExpiresAt,
      },
    });
    console.log(`Updated User record for ${targetEmail} with phone ${targetPhone}`);
  }

  // Trigger test SMS dispatch function
  console.log(`\nDispatching test OTP to ${targetPhone}...`);
  const smsResult = await sendSMSOTP(targetPhone, name, otp);

  console.log(`\n==================================================`);
  console.log(`[SMS Result Status]:`, smsResult);
  console.log(`Target Phone:      ${targetPhone}`);
  console.log(`6-Digit OTP:       ${otp}`);
  console.log(`Teacher Email:     ${targetEmail}`);
  console.log(`==================================================`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

/**
 * SMS Dispatch Utility for Teachers-Community
 * Generates 6-digit OTPs and dispatches SMS alerts to approved university teachers.
 */

export function generate6DigitOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function sendSMSOTP(phoneNumber: string, name: string, otp: string): Promise<{ success: boolean; provider: string }> {
  console.log(`\n==================================================`);
  console.log(`[SMS DISPATCH SERVICE] Sending OTP to Teacher`);
  console.log(`Recipient Name: ${name}`);
  console.log(`Phone Number:   ${phoneNumber}`);
  console.log(`6-Digit OTP:    ${otp}`);
  console.log(`Message:        Hello ${name}, your Teachers-Community account has been approved by the Admin. Your OTP for first-time password setup is: ${otp}. Valid for 15 minutes.`);
  console.log(`==================================================\n`);

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromPhone = process.env.TWILIO_PHONE_NUMBER;

  if (accountSid && authToken && fromPhone) {
    try {
      const basicAuth = Buffer.from(`${accountSid}:${authToken}`).toString('base64');
      const params = new URLSearchParams();
      params.append('To', phoneNumber);
      params.append('From', fromPhone);
      params.append('Body', `Hello ${name}, your Teachers-Community account has been approved! Use OTP ${otp} for first-time login and password setup.`);

      const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${basicAuth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      });

      if (res.ok) {
        return { success: true, provider: 'TWILIO' };
      }
    } catch (err) {
      console.error('Twilio SMS send error:', err);
    }
  }

  // Development/Mock SMS fallback mode
  return { success: true, provider: 'CONSOLE_MOCK' };
}

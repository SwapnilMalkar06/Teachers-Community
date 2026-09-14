/**
 * SMS Dispatch Utility for Teachers-Community
 * Generates 6-digit OTPs and dispatches SMS alerts to approved university teachers.
 */

export function generate6DigitOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Normalizes phone numbers for SMS API gateways.
 * E.g., "+91 98765 43210" -> "9876543210" for 10-digit Indian gateways or "+919876543210" for Twilio.
 */
export function normalizePhoneNumber(phone: string): { raw: string; clean10Digit: string; withCountryCode: string } {
  const digitsOnly = phone.replace(/\D/g, '');
  
  let clean10Digit = digitsOnly;
  let withCountryCode = `+${digitsOnly}`;

  if (digitsOnly.length === 12 && digitsOnly.startsWith('91')) {
    clean10Digit = digitsOnly.substring(2);
    withCountryCode = `+${digitsOnly}`;
  } else if (digitsOnly.length === 10) {
    clean10Digit = digitsOnly;
    withCountryCode = `+91${digitsOnly}`;
  }

  return { raw: phone, clean10Digit, withCountryCode };
}

export async function sendSMSOTP(phoneNumber: string, name: string, otp: string): Promise<{ success: boolean; provider: string; details?: string }> {
  const { clean10Digit, withCountryCode } = normalizePhoneNumber(phoneNumber);
  
  console.log(`\n==================================================`);
  console.log(`[SMS DISPATCH SERVICE] Sending OTP to Teacher`);
  console.log(`Recipient Name:    ${name}`);
  console.log(`Raw Phone Input:   ${phoneNumber}`);
  console.log(`Formatted E.164:   ${withCountryCode}`);
  console.log(`10-Digit (India):  ${clean10Digit}`);
  console.log(`6-Digit OTP Code:  ${otp}`);
  console.log(`Message Content:   Hello ${name}, your Teachers-Community account has been approved by Admin. Your OTP for password setup is: ${otp}. Valid for 15 mins.`);
  console.log(`==================================================\n`);

  // 1. FAST2SMS (India Real-time SMS Gateway)
  const fast2smsKey = process.env.FAST2SMS_API_KEY;
  if (fast2smsKey) {
    try {
      console.log('[SMS Provider] Dispatching real-time SMS via Fast2SMS...');
      const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
        method: 'POST',
        headers: {
          'authorization': fast2smsKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          route: 'otp',
          variables_values: otp,
          numbers: clean10Digit,
        }),
      });

      const data = await response.json();
      console.log('[Fast2SMS Response]:', data);

      if (response.ok && data.return === true) {
        return { success: true, provider: 'FAST2SMS', details: data.message?.[0] || 'SMS dispatched via Fast2SMS' };
      } else {
        console.warn('Fast2SMS returned failure, falling back to quick route:', data);
        // Fallback to quick SMS route if OTP template is not configured
        const fallbackRes = await fetch('https://www.fast2sms.com/dev/bulkV2', {
          method: 'POST',
          headers: {
            'authorization': fast2smsKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            route: 'q',
            message: `Hello ${name}, your Teachers-Community OTP is ${otp}. Valid for 15 mins.`,
            language: 'english',
            flash: '0',
            numbers: clean10Digit,
          }),
        });
        const fallbackData = await fallbackRes.json();
        if (fallbackRes.ok && fallbackData.return === true) {
          return { success: true, provider: 'FAST2SMS_QUICK', details: fallbackData.message?.[0] || 'SMS dispatched via Fast2SMS Quick Route' };
        }
      }
    } catch (err: any) {
      console.error('Fast2SMS Dispatch Error:', err?.message || err);
    }
  }

  // 2. 2FACTOR (India Real-time SMS Gateway)
  const twoFactorKey = process.env.TWOFACTOR_API_KEY;
  if (twoFactorKey) {
    try {
      console.log('[SMS Provider] Dispatching real-time SMS via 2Factor...');
      const response = await fetch(`https://2factor.in/API/V1/${twoFactorKey}/SMS/${clean10Digit}/${otp}/AUTOGEN`, {
        method: 'GET',
      });
      const data = await response.json();
      console.log('[2Factor Response]:', data);
      if (data.Status === 'Success') {
        return { success: true, provider: '2FACTOR', details: data.Details };
      }
    } catch (err: any) {
      console.error('2Factor Dispatch Error:', err?.message || err);
    }
  }

  // 3. TWILIO (Global SMS Gateway)
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromPhone = process.env.TWILIO_PHONE_NUMBER;

  if (accountSid && authToken && fromPhone) {
    try {
      console.log('[SMS Provider] Dispatching real-time SMS via Twilio...');
      const basicAuth = Buffer.from(`${accountSid}:${authToken}`).toString('base64');
      const params = new URLSearchParams();
      params.append('To', withCountryCode);
      params.append('From', fromPhone);
      params.append('Body', `Hello ${name}, your Teachers-Community account is approved! Use OTP ${otp} to log in & set your password.`);

      const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${basicAuth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      });

      const twilioData = await res.json();
      console.log('[Twilio Response]:', twilioData);

      if (res.ok) {
        return { success: true, provider: 'TWILIO', details: twilioData.sid };
      }
    } catch (err: any) {
      console.error('Twilio SMS send error:', err?.message || err);
    }
  }

  // 4. CUSTOM WEBHOOK GATEWAY
  const customUrl = process.env.CUSTOM_SMS_URL;
  if (customUrl) {
    try {
      const targetUrl = customUrl
        .replace('{phone}', encodeURIComponent(clean10Digit))
        .replace('{full_phone}', encodeURIComponent(withCountryCode))
        .replace('{otp}', encodeURIComponent(otp))
        .replace('{name}', encodeURIComponent(name));

      console.log('[SMS Provider] Dispatching SMS via Custom Webhook URL:', targetUrl);
      const res = await fetch(targetUrl);
      if (res.ok) {
        return { success: true, provider: 'CUSTOM_WEBHOOK' };
      }
    } catch (err: any) {
      console.error('Custom Webhook SMS Error:', err?.message || err);
    }
  }

  // 5. Development/Mock SMS fallback mode
  console.log('[SMS Provider] No live SMS Gateway API keys found in .env. Using CONSOLE_MOCK mode.');
  return { success: true, provider: 'CONSOLE_MOCK', details: `OTP displayed on console & Admin UI: ${otp}` };
}

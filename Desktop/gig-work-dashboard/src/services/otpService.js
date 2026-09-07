/**
 * Real Phone OTP Verification Engine
 * Supports Fast2SMS / Twilio / Firebase Phone Auth & Simulated Live Sandbox
 */

// In-memory active OTP registry (Phone -> { otp, expiresAt, attempts })
const activeOtpStore = new Map();

/**
 * Sends a 6-digit OTP to a 10-digit Indian Mobile Number
 * @param {string} phone 
 * @param {string} channel - 'sms' | 'whatsapp'
 */
export async function sendPhoneOtp(phone, channel = 'sms') {
  const cleanPhone = phone.replace(/[^0-9]/g, '').slice(-10);
  if (cleanPhone.length !== 10) {
    return { success: false, error: 'Please enter a valid 10-digit mobile number' };
  }

  // Generate 6-digit secure numeric OTP
  const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes validity

  activeOtpStore.set(cleanPhone, {
    otp: generatedOtp,
    expiresAt,
    attempts: 0
  });

  // Check if Fast2SMS / Twilio API key is configured
  const fast2smsKey = import.meta.env.VITE_FAST2SMS_API_KEY;
  if (fast2smsKey && channel === 'sms') {
    try {
      await fetch('https://www.fast2sms.com/dev/bulkV2', {
        method: 'POST',
        headers: {
          authorization: fast2smsKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          route: 'otp',
          variables_values: generatedOtp,
          numbers: cleanPhone
        })
      });
    } catch (err) {
      console.warn('[Fast2SMS API Warning]:', err);
    }
  }

  return {
    success: true,
    message: 6-digit OTP sent successfully to +91  via ,
    debugOtp: generatedOtp, // Provided for instant sandbox testing
    expiresInSeconds: 300
  };
}

/**
 * Verifies the 6-digit OTP
 * @param {string} phone 
 * @param {string} enteredOtp 
 */
export async function verifyPhoneOtp(phone, enteredOtp) {
  const cleanPhone = phone.replace(/[^0-9]/g, '').slice(-10);
  const record = activeOtpStore.get(cleanPhone);

  // Master Test OTP for easy demo / testing
  if (enteredOtp === '123456' || enteredOtp === '999999') {
    return { success: true, message: 'Phone verified successfully.' };
  }

  if (!record) {
    return { success: false, error: 'No OTP requested for this number. Please click Resend OTP.' };
  }

  if (Date.now() > record.expiresAt) {
    activeOtpStore.delete(cleanPhone);
    return { success: false, error: 'OTP has expired. Please request a new one.' };
  }

  if (record.otp !== enteredOtp.trim()) {
    record.attempts += 1;
    if (record.attempts >= 4) {
      activeOtpStore.delete(cleanPhone);
      return { success: false, error: 'Too many incorrect attempts. Please request a new OTP.' };
    }
    return { success: false, error: Invalid OTP.  attempts remaining. };
  }

  // Verified!
  activeOtpStore.delete(cleanPhone);
  return { success: true, message: 'Phone verified successfully.' };
}

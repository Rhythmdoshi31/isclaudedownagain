import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { resend, FROM_EMAIL } from '@/lib/resend';
import { generateOTP, hashString } from '@/lib/utils';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'email is required' }, { status: 400 });
    }

    const emailKey = email.toLowerCase();

    // Check rate limit (max 3 per hour)
    const rateKey = `rate:unsub:${emailKey}`;
    const attempts = await redis.incr(rateKey);
    
    if (attempts === 1) {
      await redis.expire(rateKey, 3600); // 1 hour
    }

    if (attempts > 3) {
      return NextResponse.json({ error: 'too many attempts. try again in an hour.' }, { status: 429 });
    }

    // Generate OTP
    const otp = generateOTP();
    const hashedOtp = hashString(otp);

    // Store OTP in Redis (10 minutes)
    await redis.setex(`otp_unsub:${emailKey}`, 600, hashedOtp);

    // Send email
    await resend.emails.send({
      from: `isclaudedownagain <${FROM_EMAIL}>`,
      to: email,
      subject: 'unsubscribe confirmation - isclaudedownagain',
      html: `
        <div style="font-family: monospace; padding: 20px;">
          <h2>unsubscribe confirmation</h2>
          <p>your verification code is: <strong style="font-size: 24px;">${otp}</strong></p>
          <p>this code will expire in 10 minutes.</p>
          <p>if you didn't request this, you can ignore this email.</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('unsubscribe request error:', error);
    return NextResponse.json({ error: 'internal server error' }, { status: 500 });
  }
}

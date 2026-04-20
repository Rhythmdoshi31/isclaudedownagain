import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { resend, FROM_EMAIL } from '@/lib/resend';
import { hashString, generateOTP } from '@/lib/utils';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'invalid email' }, { status: 400 });
    }

    const emailKey = email.toLowerCase();
    
    // Rate limit check
    const rateKey = `rate:${emailKey}`;
    const attempts = await redis.incr(rateKey);
    
    if (attempts === 1) {
      await redis.expire(rateKey, 3600); // 1 hour TTL
    }

    if (attempts > 3) {
      return NextResponse.json({ error: 'rate limit exceeded. try again in an hour.' }, { status: 429 });
    }

    // Generate and hash OTP
    const otp = generateOTP();
    const hashedOtp = hashString(otp);

    // Store in redis with 10 min TTL
    await redis.setex(`otp:${emailKey}`, 600, hashedOtp);

    // Send email via Resend
    const { error } = await resend.emails.send({
      from: `isclaudedownagain <${FROM_EMAIL}>`,
      to: emailKey,
      subject: 'your otp for isclaudedownagain',
      html: `
        <div style="font-family: monospace; padding: 20px;">
          <h2>verify your email</h2>
          <p>your one-time password is:</p>
          <h1 style="background: #FFE600; padding: 10px; display: inline-block; border: 3px solid #000;">${otp}</h1>
          <p>this code expires in 10 minutes.</p>
        </div>
      `,
    });

    if (error) {
      console.error('resend error:', error);
      return NextResponse.json({ error: 'failed to send email' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('subscribe error:', error);
    return NextResponse.json({ error: 'internal server error' }, { status: 500 });
  }
}

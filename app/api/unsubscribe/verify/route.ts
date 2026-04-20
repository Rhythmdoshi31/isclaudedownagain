import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { hashString } from '@/lib/utils';

export async function POST(request: Request) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json({ error: 'email and otp are required' }, { status: 400 });
    }

    const emailKey = email.toLowerCase();
    const hashedOtp = hashString(otp);

    // Get stored OTP
    const storedHashedOtp = await redis.get(`otp_unsub:${emailKey}`);

    if (!storedHashedOtp) {
      return NextResponse.json({ error: 'otp expired or not found' }, { status: 400 });
    }

    if (storedHashedOtp !== hashedOtp) {
      return NextResponse.json({ error: 'invalid otp' }, { status: 400 });
    }

    // Valid OTP: delete subscriber and delete OTP
    await redis.del(`sub:${emailKey}`);
    await redis.del(`otp_unsub:${emailKey}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('unsubscribe verify error:', error);
    return NextResponse.json({ error: 'internal server error' }, { status: 500 });
  }
}

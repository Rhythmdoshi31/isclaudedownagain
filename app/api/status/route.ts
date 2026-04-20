import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const statusStr = await redis.get<string>('status:current');
    
    let overall = 'unknown';
    let components: any[] = [];
    let lastChecked = Date.now();

    if (statusStr) {
      try {
        const parsed = typeof statusStr === 'string' ? JSON.parse(statusStr) : (statusStr as any);
        overall = parsed.overall || 'unknown';
        components = parsed.components || [];
        lastChecked = parsed.lastChecked || lastChecked;
      } catch {
        overall = 'unknown';
      }
    }

    return NextResponse.json({
      status: overall, // Keeping top-level 'status' for backward compatibility or Hero.tsx ease
      components,
      lastChecked
    });
  } catch (error) {
    console.error('status error:', error);
    return NextResponse.json({ error: 'internal server error' }, { status: 500 });
  }
}

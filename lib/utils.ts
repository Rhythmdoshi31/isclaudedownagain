import crypto from 'crypto';

export function hashString(input: string): string {
  return crypto.createHash('sha256').update(input).digest('hex');
}

export function generateOTP(): string {
  // Generate a random 6-digit number
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

# kyabeclau.de

## what this is
a status monitoring site that checks if claude (anthropic) is down
and notifies subscribers instantly via email or sms.

## tech stack
- next.js 14 (app router, typescript)
- upstash redis (subscriber storage + status state)
- resend (email sending + otp)
- twilio (sms, optional)
- vercel cron (polls every 1 min)

## env vars needed
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
RESEND_API_KEY=
RESEND_FROM_EMAIL=
TWILIO_ACCOUNT_SID=      # optional
TWILIO_AUTH_TOKEN=        # optional
TWILIO_PHONE_NUMBER=      # optional

## api routes
POST /api/subscribe     → send otp to email/phone
POST /api/verify        → verify otp, store subscriber
GET  /api/status        → return current claude status (cached)
GET  /api/check-status  → cron endpoint, polls anthropic, emails on change

## status source
https://status.anthropic.com/api/v2/status.json
indicator values: "none" | "minor" | "major" | "critical"

## pages
/ → homepage (subscribe form + live status)
/history → past incidents list (future)

## rules
- always use app router, never pages router
- always typescript
- lowercase everything in ui text
- all components in /components folder
- no ui libraries — raw tailwind only
- otp expires after 10 minutes (store in redis with ttl)
- rate limit subscribe endpoint (max 3 attempts per email per hour)
- do not store plain otps — store hashed (sha256)
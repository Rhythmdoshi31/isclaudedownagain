import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { resend, FROM_EMAIL } from '@/lib/resend';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    if (process.env.NODE_ENV !== "development") {
      const authHeader = request.headers.get("authorization");
      if (!authHeader || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new NextResponse("unauthorized" + authHeader, { status: 401 });
      }
    }

    const [statusRes, componentsRes] = await Promise.all([
      fetch('https://status.anthropic.com/api/v2/status.json'),
      fetch('https://status.anthropic.com/api/v2/components.json')
    ]);

    if (!statusRes.ok || !componentsRes.ok) {
      throw new Error(`Failed to fetch status`);
    }

    const statusData = await statusRes.json();
    const componentsData = await componentsRes.json();

    const indicator = statusData.status.indicator;
    let overallStatus = 'unknown';
    if (indicator === 'none') {
      overallStatus = 'operational';
    } else if (indicator === 'minor') {
      overallStatus = 'degraded';
    } else if (indicator === 'major' || indicator === 'critical') {
      overallStatus = 'outage';
    }

    function normalizeComponentStatus(status: string) {
      switch (status) {
        case 'operational': return 'operational';
        case 'degraded_performance':
        case 'partial_outage':
        case 'under_maintenance': return 'degraded';
        case 'major_outage': return 'outage';
        default: return 'unknown';
      }
    }

    const ALLOWED_COMPONENTS = ['claude.ai', 'claude api (api.anthropic.com)', 'claude code', 'claude cowork'];
    
    const components = componentsData.components
      .map((c: any) => ({
        name: c.name.toLowerCase(),
        status: normalizeComponentStatus(c.status)
      }))
      .filter((c: any) => ALLOWED_COMPONENTS.includes(c.name));

    const currentStatusObj = {
      overall: overallStatus,
      components: components,
      lastChecked: Date.now()
    };

    console.log(currentStatusObj, "currentStatusObj");

    const previousStatusStr = await redis.get<string>('status:previous');
    let previousStatus: any = null;
    
    if (previousStatusStr) {
      try {
        previousStatus = typeof previousStatusStr === 'string' ? JSON.parse(previousStatusStr) : (previousStatusStr as any);
      } catch {
        previousStatus = null;
      }
    }

    let overallChanged = false;
    let changedComponents: {name: string, from: string, to: string}[] = [];

    if (previousStatus) {
      overallChanged = previousStatus.overall !== overallStatus;
      
      const prevMap = Object.fromEntries(
        (previousStatus.components || []).map((c: any) => [c.name, c.status])
      );
      const newMap = Object.fromEntries(
        components.map((c: any) => [c.name, c.status])
      );

      for (const name in newMap) {
        if (prevMap[name] !== newMap[name]) {
          changedComponents.push({
            name,
            from: prevMap[name] || "unknown",
            to: newMap[name]
          });
        }
      }
    }

    // Always update current status
    await redis.set('status:current', JSON.stringify(currentStatusObj));

    // If status changed, notify subscribers
    if (previousStatus && (overallChanged || changedComponents.length > 0)) {
      // Update previous status
      await redis.set('status:previous', JSON.stringify(currentStatusObj));

      // Get all subscribers
      let cursor: any = 0;
      let subscribers: string[] = [];
      do {
        const result = await redis.scan(cursor, { match: 'sub:*', count: 100 }) as [any, string[]];
        cursor = result[0];
        subscribers.push(...result[1]);
      } while (cursor != 0 && cursor !== '0');

      // Extract emails
      const emails = subscribers.map(key => key.replace('sub:', ''));

      let componentsChangedHtml = '';
      if (changedComponents.length > 0) {
        componentsChangedHtml = `
          <h3>components changed:</h3>
          <ul>
            ${changedComponents.map(c => `<li>${c.name}: ${c.from} ➔ ${c.to}</li>`).join('')}
          </ul>
        `;
      }

      const currentComponentsHtml = `
        <h3>current state:</h3>
        <ul>
          ${components.map((c: any) => `<li>${c.name} ➔ ${c.status}</li>`).join('')}
        </ul>
      `;

      // Send emails in batches
      if (emails.length > 0) {
        const BATCH_SIZE = 50;
        for (let i = 0; i < emails.length; i += BATCH_SIZE) {
          const batch = emails.slice(i, i + BATCH_SIZE);
          
          await resend.emails.send({
            from: `isclaudedownagain <${FROM_EMAIL}>`,
            to: FROM_EMAIL,
            bcc: batch,
            subject: `claude status update: ${overallStatus}`,
            html: `
              <div style="font-family: monospace; padding: 20px;">
                <h2>🚨 status update</h2>
                <p>overall status: <span style="font-weight: bold; text-transform: uppercase;">${overallStatus}</span></p>
                ${componentsChangedHtml}
                ${currentComponentsHtml}
                <hr style="border: 1px solid #000; margin: 20px 0;" />
                <p><small>you are receiving this because you subscribed to isclaudedownagain.</small></p>
              </div>
            `,
          });
        }
      }
    } else if (!previousStatus) {
      // First time running, set previous status
      await redis.set('status:previous', JSON.stringify(currentStatusObj));
    }

    return NextResponse.json({ success: true, status: overallStatus });
  } catch (error) {
    console.error('check-status error:', error);
    return NextResponse.json({ error: 'internal server error' }, { status: 500 });
  }
}

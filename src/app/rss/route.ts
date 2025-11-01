import { SITE } from '@/lib/seo/site';
import { loadHalloweenPack } from '@/lib/prompts/halloween';
export async function GET() {
  const base = SITE.url;
  try {
    const data = loadHalloweenPack(process.cwd());
    const items = data.items.slice(0,20).map((it:any)=>`
  <item>
    <title>${it.id} - ${it.location}</title>
    <link>${base}/prompts/halloween?id=${it.id}</link>
    <description>${it.theme}</description>
  </item>`).join('');
    const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${SITE.name}</title><link>${base}</link><description>${SITE.description}</description>${items}</channel></rss>`;
    return new Response(xml,{ headers:{ 'Content-Type':'application/rss+xml; charset=utf-8' }});
  } catch {
    return new Response(`<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${SITE.name}</title><link>${base}</link><description>${SITE.description}</description></channel></rss>`,{ headers:{ 'Content-Type':'application/rss+xml; charset=utf-8' }});
  }
}


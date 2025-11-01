import { SITE } from '@/lib/seo/site';
import { loadHalloweenPack } from '@/lib/prompts/halloween';
export async function GET() {
  const base = SITE.url;
  try {
    const data = loadHalloweenPack(process.cwd());
    const entries = data.items.slice(0,20).map((it:any)=>`
  <entry>
    <title>${it.id} - ${it.location}</title>
    <link href="${base}/prompts/halloween?id=${it.id}"/>
    <id>${base}/prompts/halloween?id=${it.id}</id>
    <updated>${new Date().toISOString()}</updated>
    <summary>${it.theme || ''}</summary>
  </entry>`).join('');
    const xml = `<?xml version="1.0" encoding="utf-8"?><feed xmlns="http://www.w3.org/2005/Atom"><title>${SITE.name}</title><link href="${base}"/><updated>${new Date().toISOString()}</updated>${entries}</feed>`;
    return new Response(xml,{ headers:{ 'Content-Type':'application/atom+xml; charset=utf-8' }});
  } catch {
    return new Response(`<?xml version="1.0" encoding="utf-8"?><feed xmlns="http://www.w3.org/2005/Atom"><title>${SITE.name}</title><link href="${base}"/><updated>${new Date().toISOString()}</updated></feed>`,{ headers:{ 'Content-Type':'application/atom+xml; charset=utf-8' }});
  }
}


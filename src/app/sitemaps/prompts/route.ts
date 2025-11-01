import { SITE } from '@/lib/seo/site';
import { loadHalloweenPack } from '@/lib/prompts/halloween';
export const dynamic = 'force-static';
export async function GET() {
  const base = SITE.url;
  try {
    const data = loadHalloweenPack(process.cwd());
    const urls = data.items.map((it:any)=> `<url><loc>${base}/prompts/halloween?loc=${encodeURIComponent(it.location)}&id=${it.id}</loc><changefreq>weekly</changefreq><priority>0.5</priority></url>`).join('');
    const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;
    return new Response(xml,{ headers:{ 'Content-Type':'application/xml; charset=utf-8' }});
  } catch {
    return new Response('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>',{ headers:{ 'Content-Type':'application/xml; charset=utf-8' }});
  }
}


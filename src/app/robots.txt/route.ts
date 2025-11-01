import { SITE } from '@/lib/seo/site';
export const dynamic = 'force-static';
export async function GET() {
  const body = [
    'User-agent: *',
    'Allow: /',
    '',
    'Sitemap: ' + SITE.url + '/sitemap.xml',
    'Host: ' + SITE.url
  ].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain' } });
}


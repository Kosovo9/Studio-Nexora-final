import { SITE } from '@/lib/seo/site';
export const dynamic = 'force-static';
export default async function sitemap() {
  const base = SITE.url;
  const urls = [
    '', 'earth', 'prompts/halloween', 'prompts/halloween/families',
    'pricing', 'security/human-check', 'legal/terms', 'legal/privacy', 'legal/cookies'
  ].map((p)=> ({
    url: base + '/' + p,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: p === '' ? 1 : 0.6
  }));
  return urls;
}


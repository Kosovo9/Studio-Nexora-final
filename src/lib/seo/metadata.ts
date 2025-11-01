import type { Metadata } from 'next';
import { SITE } from './site';

type Opts = {
  title?: string;
  description?: string;
  path?: string;            // e.g. '/pricing'
  noindex?: boolean;
  images?: string[];        // OG images
  lang?: string;            // 'es','en',...
};

export function pageSEO(opts: Opts = {}): Metadata {
  const title = opts.title ? `${opts.title} · ${SITE.name}` : SITE.name;
  const desc = opts.description || SITE.description;
  const url = new URL(SITE.url);
  const canonical = opts.path ? new URL(opts.path.replace(/^\//,''), url).toString() : SITE.url;

  const images = (opts.images && opts.images.length ? opts.images : ['/opengraph-image']);

  const languages: Record<string,string> = {
    'x-default': SITE.url,
    ...Object.fromEntries(SITE.languages.map(l => [l, `${SITE.url}/?lang=${l}`]))
  };

  const robots = opts.noindex ? { index: false, follow: false, nocache: true } : { index: true, follow: true };

  return {
    title, description: desc, metadataBase: new URL(SITE.url),
    alternates: { canonical, languages },
    robots,
    openGraph: {
      type: 'website', title, description: desc, url: canonical,
      siteName: SITE.name, locale: SITE.locale, images
    },
    twitter: {
      card: 'summary_large_image',
      site: SITE.twitter, creator: SITE.twitter, title, description: desc, images
    },
    icons: { icon: [{ url: '/favicon.ico' }] }
  };
}


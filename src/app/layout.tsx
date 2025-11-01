import type { Metadata, Viewport } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { Inter } from 'next/font/google';
import { SITE } from '@/lib/seo/site';
import Preconnects from '@/components/seo/Preconnects';
import SeoRoot from '@/components/seo/SeoRoot';
import PlausibleGate from '@/components/analytics/PlausibleGate';
import CookieBanner from '@/components/consent/CookieBanner';
import CookieManagerButton from '@/components/consent/CookieManagerButton';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: SITE.name,
    template: `%s · ${SITE.name}`
  },
  description: SITE.description,
  metadataBase: new URL(SITE.url),
  alternates: {
    canonical: SITE.url,
    languages: {
      'x-default': SITE.url,
      'es': SITE.url + '/?lang=es',
      'en': SITE.url + '/?lang=en',
      'pt': SITE.url + '/?lang=pt',
      'fr': SITE.url + '/?lang=fr',
      'de': SITE.url + '/?lang=de',
      'it': SITE.url + '/?lang=it',
      'zh': SITE.url + '/?lang=zh',
      'ja': SITE.url + '/?lang=ja',
      'ko': SITE.url + '/?lang=ko',
      'ar': SITE.url + '/?lang=ar',
      'hi': SITE.url + '/?lang=hi',
      'ru': SITE.url + '/?lang=ru'
    }
  },
  openGraph: {
    type: 'website',
    title: SITE.name,
    description: SITE.description,
    url: SITE.url,
    siteName: SITE.name,
    locale: SITE.locale,
    images: ['/opengraph-image']
  },
  twitter: {
    card: 'summary_large_image',
    site: SITE.twitter,
    creator: SITE.twitter
  },
  icons: {
    icon: [{ url: '/favicon.ico' }]
  }
};

export const viewport: Viewport = {
  themeColor: '#0ea5e9',
  colorScheme: 'light dark',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <Preconnects />
      </head>
      <body className={`min-h-screen antialiased ${inter.className}`}>
        <SeoRoot />
        <PlausibleGate />
        <CookieBanner />
        <CookieManagerButton />
        <ClerkProvider>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}

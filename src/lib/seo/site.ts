export const SITE = {
  name: process.env.NEXT_PUBLIC_ORG_NAME || 'Studio Nexora',
  description: 'Estudio IA premium: prompts, media hiperrealista, SaaS y growth global.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://nexoraproglobal.com',
  locale: 'es_MX',
  twitter: process.env.NEXT_PUBLIC_TWITTER || '@nexorapro',
  logo: process.env.NEXT_PUBLIC_ORG_LOGO || '/icon.png',
  languages: ['es','en','pt','fr','de','it','zh','ja','ko','ar','hi','ru'] as const
};

export type Lang = typeof SITE.languages[number];


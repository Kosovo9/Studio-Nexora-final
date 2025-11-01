import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Inter } from 'next/font/google';
import dynamic from 'next/dynamic';
import EnergyModeProviderWrapper from '@/components/providers/EnergyModeProvider';
import '../globals.css';

const inter = Inter({ subsets: ['latin'] });

const EarthBackground = dynamic(() => import('@/components/earth/EarthBackground'), { ssr: false });
const Navbar = dynamic(() => import('@/components/nav/Navbar'), { ssr: false });

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <EnergyModeProviderWrapper>
          <div className="fixed inset-0 -z-10">
            <EarthBackground />
          </div>
          <Navbar />
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
        </EnergyModeProviderWrapper>
      </body>
    </html>
  );
}
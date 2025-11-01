'use client';

import { useTranslations } from 'next-intl';
import GlobeHero from '@/components/GlobeHero';
import PricingAndCTA from '@/components/PricingAndCTA';

export default function StudioNexoraClient() {
  const t = useTranslations('common');
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Hero Section with Globe */}
      <GlobeHero />

      {/* Pricing and CTA Section */}
      <PricingAndCTA />
    </div>
  );
}

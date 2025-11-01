"use client";

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ArrowRight, Sparkles } from 'lucide-react';
import dynamic from 'next/dynamic';

// Lazy load EarthCanvas for better performance
const EarthCanvas = dynamic(() => import('./EarthCanvas'), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 -z-10">
      <img 
        src="/earth-fallback.svg" 
        alt="" 
        className="w-full h-full object-cover opacity-40" 
        loading="eager"
      />
    </div>
  ),
});

export default function GlobeHero() {
  const router = useRouter();
  const t = useTranslations('common');

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900">
      {/* Globe Background */}
      <EarthCanvas />

      {/* Content Overlay */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-2xl animate-fade-in">
            Transforma tu recuerdo en arte profesional, en minutos.
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto drop-shadow-lg leading-relaxed">
            Retratos hiperrealistas, abrazos imposibles, videos emocionales y escenas temáticas globales. 
            Entrega rápida. Sin sesión de estudio física.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            {/* Primary CTA */}
            <button
              onClick={() => router.push('/studio')}
              className="group bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-700 hover:via-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-200 flex items-center gap-3 shadow-2xl hover:shadow-purple-500/50 hover:scale-105"
            >
              <Sparkles className="w-6 h-6" />
              Empieza ahora
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Secondary CTA */}
            <button
              onClick={() => router.push('/studio?view=gallery')}
              className="bg-white/10 backdrop-blur-md border-2 border-white/20 hover:bg-white/20 text-white font-semibold py-4 px-8 rounded-xl text-lg transition-all duration-200 hover:scale-105"
            >
              Ver ejemplos
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-8 mt-12 text-sm text-gray-300">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span>Entrega en menos de 24 horas</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
              <span>Privacidad garantizada</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
              <span>IA profesional + edición humana</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


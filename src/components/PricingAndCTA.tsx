"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard, MessageCircle, Sparkles, Heart, Film, ArrowRight } from 'lucide-react';

interface Pricing {
  base: number;
  currency: string;
  symbol: string;
}

interface RegionConfig {
  basePrice: number;
  currency: string;
  symbol: string;
  language: 'es' | 'en';
}

const REGION_PRICING: Record<string, RegionConfig> = {
  MX: { basePrice: 199, currency: 'MXN', symbol: '$', language: 'es' },
  US: { basePrice: 25, currency: 'USD', symbol: '$', language: 'en' },
  CA: { basePrice: 30, currency: 'CAD', symbol: '$', language: 'en' },
  LATAM: { basePrice: 15, currency: 'USD', symbol: '$', language: 'es' },
  GLOBAL: { basePrice: 20, currency: 'USD', symbol: '$', language: 'en' },
};

const LATAM_COUNTRIES = [
  'AR', 'BO', 'BR', 'CL', 'CO', 'CR', 'CU', 'DO', 'EC', 'SV',
  'GT', 'HN', 'HT', 'JM', 'NI', 'PA', 'PY', 'PE', 'PR', 'UY', 'VE'
];

export default function PricingAndCTA() {
  const router = useRouter();
  const [region, setRegion] = useState<RegionConfig>(REGION_PRICING.GLOBAL);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    detectRegion();
  }, []);

  const detectRegion = () => {
    try {
      // Method 1: Try to detect from timezone
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (timezone.includes('America/Mexico')) {
        setRegion(REGION_PRICING.MX);
        return;
      }
      if (timezone.includes('America/New_York') || timezone.includes('America/Chicago') || 
          timezone.includes('America/Denver') || timezone.includes('America/Los_Angeles')) {
        setRegion(REGION_PRICING.US);
        return;
      }
      if (timezone.includes('America/Toronto') || timezone.includes('America/Vancouver')) {
        setRegion(REGION_PRICING.CA);
        return;
      }

      // Method 2: Try to detect from locale
      const locale = navigator.language || navigator.languages?.[0] || 'en';
      const countryCode = locale.split('-')[1]?.toUpperCase();

      if (countryCode === 'MX') {
        setRegion(REGION_PRICING.MX);
        return;
      }
      if (countryCode === 'US') {
        setRegion(REGION_PRICING.US);
        return;
      }
      if (countryCode === 'CA') {
        setRegion(REGION_PRICING.CA);
        return;
      }
      if (countryCode && LATAM_COUNTRIES.includes(countryCode)) {
        setRegion(REGION_PRICING.LATAM);
        return;
      }

      // Method 3: Check if Spanish language
      if (locale.startsWith('es')) {
        setRegion(REGION_PRICING.LATAM);
        return;
      }

      // Default to global
      setRegion(REGION_PRICING.GLOBAL);
    } catch (error) {
      setRegion(REGION_PRICING.GLOBAL);
    }
  };

  const isSpanish = region.language === 'es';

  const packages = [
    {
      id: 'recuerdo',
      icon: Sparkles,
      nameEs: 'Recuerdo Inmortal',
      nameEn: 'Immortal Memory',
      descEs: 'Foto retocada hiperrealista (1 persona o mascota)',
      descEn: 'Hyperrealistic retouched photo (1 person or pet)',
      multiplier: 1.0,
    },
    {
      id: 'abrazo',
      icon: Heart,
      nameEs: 'Abrazo Imposible',
      nameEn: 'Impossible Embrace',
      descEs: 'Montaje emocional (tú abrazando a alguien que ya no está / unión de 2 fotos diferentes)',
      descEn: 'Emotional montage (you embracing someone no longer here / merge of 2 different photos)',
      multiplier: 1.4,
    },
    {
      id: 'video',
      icon: Film,
      nameEs: 'Video Corto Emocional',
      nameEn: 'Emotional Short Video',
      descEs: 'Mini clip estilo homenaje, animación leve de foto + título y música (10-15s)',
      descEn: 'Tribute-style mini clip, subtle photo animation + title and music (10-15s)',
      multiplier: 1.8,
    },
  ];

  const calculatePrice = (multiplier: number): string => {
    const price = region.basePrice * multiplier;
    return `${region.symbol}${Math.round(price).toLocaleString()}`;
  };

  const handleUpload = () => {
    // TODO: Verificar si existe ruta /upload o /studio para upload
    // Si existe, usar router.push('/upload')
    // Si no existe, crear página de upload con formulario de Stripe Checkout
    router.push('/studio');
  };

  const handleStripeCheckout = () => {
    // TODO: Conectar Stripe Checkout session aquí
    // Debe llamar a /api/checkout con los parámetros del paquete seleccionado
    // Por ahora redirige a checkout
    router.push('/api/checkout');
  };

  if (!mounted) {
    return null; // Prevent hydration mismatch
  }

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8">
      {/* Background gradient with glassmorphism effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-purple-900/90 to-indigo-900/95 backdrop-blur-sm" />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {isSpanish ? 'Precios Claros. Resultados Inmediatos.' : 'Clear Pricing. Immediate Results.'}
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            {isSpanish 
              ? 'Entrega rápida. Privada. Lista para compartir hoy.'
              : 'Fast delivery. Private. Ready to share today.'}
          </p>
          <div className="mt-4 text-sm text-gray-400">
            {isSpanish 
              ? `Precios en ${region.currency} - Detected: ${region.currency === 'MXN' ? 'México' : region.currency === 'CAD' ? 'Canadá' : region.currency === 'USD' ? (region === REGION_PRICING.US ? 'USA' : 'LATAM') : 'Global'}`
              : `Prices in ${region.currency} - Detected: ${region.currency === 'MXN' ? 'Mexico' : region.currency === 'CAD' ? 'Canada' : region.currency === 'USD' ? (region === REGION_PRICING.US ? 'USA' : 'LATAM') : 'Global'}`}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {packages.map((pkg) => {
            const Icon = pkg.icon;
            const price = calculatePrice(pkg.multiplier);
            
            return (
              <div
                key={pkg.id}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all duration-300 shadow-xl hover:shadow-2xl"
              >
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl mr-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">
                      {isSpanish ? pkg.nameEs : pkg.nameEn}
                    </h3>
                  </div>
                </div>
                
                <p className="text-gray-300 mb-6 text-sm">
                  {isSpanish ? pkg.descEs : pkg.descEn}
                </p>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">{price}</span>
                  <span className="text-gray-400 text-lg ml-2">
                    {isSpanish ? '/ imagen HD' : '/ HD image'}
                  </span>
                </div>

                <button
                  onClick={handleUpload}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  {isSpanish ? 'Quiero mi imagen ahora' : 'I want my image now'}
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Main CTAs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 max-w-4xl mx-auto">
          {/* Primary CTA */}
          <button
            onClick={handleUpload}
            className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-700 hover:via-indigo-700 hover:to-purple-700 text-white font-bold py-5 px-8 rounded-2xl text-lg transition-all duration-200 flex items-center justify-center gap-3 shadow-2xl hover:shadow-purple-500/50 hover:scale-105"
          >
            <Sparkles className="w-6 h-6" />
            {isSpanish ? 'Quiero mi imagen ahora' : 'I want my image now'}
            <ArrowRight className="w-6 h-6" />
          </button>

          {/* Stripe Checkout CTA */}
          <button
            onClick={handleStripeCheckout}
            className="bg-white hover:bg-gray-100 text-gray-900 font-bold py-5 px-8 rounded-2xl text-lg transition-all duration-200 flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl hover:scale-105 border-2 border-gray-200"
          >
            <CreditCard className="w-6 h-6" />
            {isSpanish ? 'Pagar con tarjeta' : 'Pay with card'}
          </button>
        </div>

        {/* WhatsApp CTA */}
        <div className="text-center mb-12">
          <a
            href="https://wa.me/XXXXXXXXXXX"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <MessageCircle className="w-5 h-5" />
            {isSpanish 
              ? 'Atención directa por WhatsApp (edición humana asistida con IA)'
              : 'Direct WhatsApp support (human + AI studio)'}
          </a>
          {/* TODO: Reemplazar XXXXXXXXXXX con el número de teléfono de negocio USA cuando esté disponible */}
        </div>

        {/* Legal Disclaimer */}
        <div className="max-w-4xl mx-auto bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl p-8">
          <div className="text-sm text-gray-300 space-y-4">
            <p className="leading-relaxed">
              {isSpanish ? (
                <>
                  <strong className="text-white">Subiendo tus fotos confirmas que tienes permiso para usarlas.</strong> Imágenes sensibles (menores de edad, personas fallecidas, momentos familiares) se tratan con máximo respeto. Guardamos tu material hasta 24h solo para entregar tu pedido, luego se elimina automáticamente. Podemos ofrecer almacenamiento seguro extendido en planes premium.
                </>
              ) : (
                <>
                  <strong className="text-white">By uploading, you confirm you have the right to use these photos.</strong> Sensitive images (kids, loved ones who passed, family moments) are handled with maximum respect. We keep your content up to 24h only to deliver your order, then we delete it. Long-term secure storage is available in premium plans.
                </>
              )}
            </p>
            
            <p className="text-gray-400 italic border-t border-white/10 pt-4">
              {isSpanish 
                ? 'No producimos contenido sexual, ilegal o dañino. Nos reservamos el derecho de rechazar material y reembolsar.'
                : 'We do not produce sexual, illegal, or harmful content. We reserve the right to reject material and refund.'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}


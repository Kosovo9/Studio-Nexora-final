import { Check, Star, Gift, Sparkles, Tag } from 'lucide-react';
import { Language, translations } from '../lib/translations';

interface PricingProps {
  lang: Language;
  onSelectPackage: (packageType: string) => void;
}

export default function Pricing({ lang, onSelectPackage }: PricingProps) {
  const t = translations[lang].pricing;

  const packages = [
    {
      id: 'christmas',
      name: lang === 'es' ? 'Plan Navideño Especial' : 'Christmas Special Plan',
      price: '299',
      features: lang === 'es' ? [
        'Estudio navideño de lujo',
        'NYC en Navidad (Rockefeller, Central Park)',
        'Cabañas con chimenea encendida',
        'Sesión con Santa Claus profesional',
        'Mercados navideños europeos',
        'Paisajes invernales mágicos',
        '2 versiones: Original + Mejorada',
        'Entrega en 5 minutos'
      ] : [
        'Luxury Christmas studio',
        'NYC at Christmas (Rockefeller, Central Park)',
        'Cabins with fireplace',
        'Professional Santa Claus session',
        'European Christmas markets',
        'Magical winter landscapes',
        '2 versions: Original + Enhanced',
        'Delivery in 5 minutes'
      ],
      popular: false,
      seasonal: true,
      seasonalNote: lang === 'es' ? '¡Solo Noviembre 2025!' : 'November 2025 Only!',
      icon: Gift
    },
    {
      id: '1_photo',
      name: t.packages.single.name,
      price: t.packages.single.price,
      features: t.packages.single.features,
      popular: false
    },
    {
      id: '2_photos',
      name: t.packages.double.name,
      price: t.packages.double.price,
      features: t.packages.double.features,
      popular: true,
      popularText: t.packages.double.popular
    },
    {
      id: '3_photos',
      name: t.packages.triple.name,
      price: t.packages.triple.price,
      features: t.packages.triple.features,
      popular: false
    },
    {
      id: 'pet',
      name: t.packages.pet.name,
      price: t.packages.pet.price,
      features: t.packages.pet.features,
      popular: false
    },
    {
      id: 'family',
      name: t.packages.family.name,
      price: t.packages.family.price,
      features: t.packages.family.features,
      popular: false
    }
  ];

  return (
    <section id="pricing" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop"
          alt="Mexico City skyline with Torre Latinoamericana"
          className="w-full h-full object-cover opacity-90"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/92 via-slate-900/88 to-slate-900/92"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-300 bg-clip-text text-transparent">
            {t.title}
          </h2>
          <p className="text-2xl text-amber-200/90">
            {t.from} $200 MXN
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-yellow-500 mx-auto rounded-full mt-4"></div>

          <div className="mt-12 max-w-3xl mx-auto">
            <div className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 p-1 rounded-2xl shadow-2xl animate-pulse">
              <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl p-8">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Tag className="w-8 h-8 text-yellow-400" />
                  <span className="text-3xl md:text-4xl font-black bg-gradient-to-r from-yellow-300 via-orange-300 to-red-300 bg-clip-text text-transparent">
                    {t.promotion.badge}
                  </span>
                  <Tag className="w-8 h-8 text-yellow-400" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                  {t.promotion.title}
                </h3>
                <p className="text-lg text-amber-100/90 mb-6">
                  {t.promotion.description}
                </p>
                <button
                  onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 hover:from-yellow-500 hover:via-orange-500 hover:to-red-500 text-slate-900 px-8 py-4 rounded-full text-lg font-black shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105"
                >
                  <Sparkles className="w-5 h-5" />
                  {t.promotion.cta}
                  <Sparkles className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {packages.map((pkg: any) => (
            <div
              key={pkg.id}
              className={`relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 pt-12 border-2 transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 group ${
                pkg.seasonal
                  ? 'border-red-500/50 shadow-2xl shadow-red-500/30 ring-4 ring-green-500/20'
                  : pkg.popular
                  ? 'border-amber-400/50 shadow-2xl shadow-amber-500/20'
                  : 'border-white/20 hover:border-amber-400/50'
              }`}
            >
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl ${
                pkg.seasonal
                  ? 'bg-gradient-to-br from-red-500/10 via-green-500/10 to-red-500/10'
                  : 'bg-gradient-to-br from-amber-500/10 to-yellow-500/10'
              }`}></div>

              {pkg.seasonal && (
                <div className="absolute top-4 left-4 right-4 bg-gradient-to-r from-red-500 to-green-600 text-white px-4 py-2 rounded-full text-xs font-bold flex items-center justify-center gap-2 shadow-xl animate-pulse">
                  <Gift className="w-4 h-4" />
                  {pkg.seasonalNote}
                  <Sparkles className="w-4 h-4" />
                </div>
              )}

              {pkg.popular && !pkg.seasonal && (
                <div className="absolute top-4 left-4 right-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 px-4 py-2 rounded-full text-xs font-bold flex items-center justify-center gap-2 shadow-xl">
                  <Star className="w-4 h-4 fill-current" />
                  {pkg.popularText}
                </div>
              )}

              <div className="relative mb-6">
                {pkg.icon && (
                  <div className="mb-4">
                    <pkg.icon className="w-12 h-12 text-red-400 animate-bounce" />
                  </div>
                )}
                <h3 className={`text-2xl font-bold mb-3 transition-colors ${
                  pkg.seasonal
                    ? 'text-white group-hover:text-red-300'
                    : 'text-white group-hover:text-amber-300'
                }`}>
                  {pkg.name}
                </h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-white">
                    ${pkg.price}
                  </span>
                  <span className={pkg.seasonal ? 'text-red-200/80' : 'text-amber-200/80'}>MXN</span>
                </div>
              </div>

              <ul className="relative space-y-4 mb-8">
                {pkg.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center mt-0.5 group-hover:bg-amber-500/30 transition-colors">
                      <Check className="w-4 h-4 text-amber-400" />
                    </div>
                    <span className="text-amber-100/90">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => onSelectPackage(pkg.id)}
                className={`relative w-full py-4 rounded-xl font-bold transition-all duration-300 ${
                  pkg.seasonal
                    ? 'bg-gradient-to-r from-red-500 to-green-600 text-white hover:from-red-600 hover:to-green-700 shadow-xl hover:shadow-2xl'
                    : pkg.popular
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 hover:from-amber-600 hover:to-yellow-600 shadow-xl hover:shadow-2xl'
                    : 'bg-white/10 text-white hover:bg-white/20 border-2 border-white/20 hover:border-amber-400/50'
                }`}
              >
                {t.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

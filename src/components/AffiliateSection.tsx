import { DollarSign, TrendingUp, Users, Clock, BarChart3 } from 'lucide-react';
import { Language, translations } from '../lib/translations';

interface AffiliateSectionProps {
  lang: Language;
}

export default function AffiliateSection({ lang }: AffiliateSectionProps) {
  const t = translations[lang].affiliate;

  const benefits = [
    { icon: DollarSign, text: t.benefits[0] },
    { icon: BarChart3, text: t.benefits[1] },
    { icon: Users, text: t.benefits[2] },
    { icon: Clock, text: t.benefits[3] },
    { icon: TrendingUp, text: t.benefits[4] }
  ];

  return (
    <section id="affiliates" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="Dubai Skyline"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/90 via-slate-900/85 to-slate-900/90"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 backdrop-blur-sm text-emerald-300 border border-emerald-400/30 px-6 py-3 rounded-full text-sm font-bold mb-8">
              <TrendingUp className="w-5 h-5" />
              {t.subtitle}
            </div>

            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-300 via-teal-300 to-emerald-300 bg-clip-text text-transparent">
              {t.title}
            </h2>

            <p className="text-xl text-emerald-100/90 mb-10 leading-relaxed">
              {t.desc}
            </p>

            <ul className="space-y-5 mb-10">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-4 group">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-2xl shadow-emerald-500/30 group-hover:scale-110 transition-transform">
                    <benefit.icon className="w-6 h-6" />
                  </div>
                  <span className="text-lg text-emerald-100/90 pt-2 group-hover:text-emerald-200 transition-colors">
                    {benefit.text}
                  </span>
                </li>
              ))}
            </ul>

            <button className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-10 py-5 rounded-full text-lg font-bold transition-all duration-300 shadow-2xl shadow-emerald-500/40 hover:shadow-emerald-500/60 hover:scale-105">
              <Users className="w-6 h-6" />
              {t.cta}
            </button>
          </div>

          <div className="relative">
            <div className="bg-white/10 backdrop-blur-xl border-2 border-emerald-400/30 rounded-3xl p-10 text-white shadow-2xl">
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 backdrop-blur-sm rounded-2xl p-8 border border-emerald-400/30 hover:border-emerald-400/50 transition-all group">
                  <div className="text-sm text-emerald-300 mb-3 font-semibold">
                    {lang === 'es' ? 'Comisión por Venta' : 'Commission per Sale'}
                  </div>
                  <div className="text-6xl font-bold bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">40%</div>
                </div>

                <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 backdrop-blur-sm rounded-2xl p-8 border border-emerald-400/30 hover:border-emerald-400/50 transition-all">
                  <div className="text-sm text-emerald-300 mb-3 font-semibold">
                    {lang === 'es' ? 'Ejemplo: Venta de $1,000 MXN' : 'Example: $1,000 MXN Sale'}
                  </div>
                  <div className="text-4xl font-bold text-white">= $400 MXN</div>
                  <div className="text-sm text-emerald-200 mt-2">
                    {lang === 'es' ? 'Tu ganancia' : 'Your earning'}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 backdrop-blur-sm rounded-2xl p-8 border border-emerald-400/30 hover:border-emerald-400/50 transition-all">
                  <div className="text-sm text-emerald-300 mb-3 font-semibold">
                    {lang === 'es' ? 'Potencial Mensual (25 ventas)' : 'Monthly Potential (25 sales)'}
                  </div>
                  <div className="text-4xl font-bold bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">$10,000 MXN</div>
                </div>
              </div>
            </div>

            <div className="absolute -top-6 -right-6 w-40 h-40 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full blur-3xl opacity-30 animate-pulse"></div>
            <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
        </div>
      </div>
    </section>
  );
}

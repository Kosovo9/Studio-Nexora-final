import { Gift, Users2, Percent } from 'lucide-react';
import { Language, translations } from '../lib/translations';

interface ReferralSectionProps {
  lang: Language;
}

export default function ReferralSection({ lang }: ReferralSectionProps) {
  const t = translations[lang].referral;

  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="New York City"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/90 via-slate-900/85 to-slate-900/90"></div>
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-sm text-orange-300 border border-orange-400/30 px-6 py-3 rounded-full text-sm font-bold mb-8">
          <Gift className="w-5 h-5" />
          15% OFF
        </div>

        <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-orange-300 via-red-300 to-orange-300 bg-clip-text text-transparent">
          {t.title}
        </h2>

        <p className="text-2xl text-orange-200/90 mb-6">
          {t.subtitle}
        </p>

        <p className="text-lg text-orange-100/80 mb-16 max-w-3xl mx-auto leading-relaxed">
          {t.desc}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border-2 border-orange-400/30 hover:border-orange-400/50 transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/20 hover:-translate-y-2 group">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-orange-500/30 group-hover:scale-110 transition-transform">
              <Users2 className="w-10 h-10 text-white" />
            </div>
            <h3 className="font-bold text-xl text-white mb-3 group-hover:text-orange-300 transition-colors">
              {lang === 'es' ? 'Invita Amigos' : 'Invite Friends'}
            </h3>
            <p className="text-orange-100/80">
              {lang === 'es' ? 'Comparte tu código único' : 'Share your unique code'}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border-2 border-red-400/30 hover:border-red-400/50 transition-all duration-500 hover:shadow-2xl hover:shadow-red-500/20 hover:-translate-y-2 group">
            <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-red-500/30 group-hover:scale-110 transition-transform">
              <Gift className="w-10 h-10 text-white" />
            </div>
            <h3 className="font-bold text-xl text-white mb-3 group-hover:text-red-300 transition-colors">
              {lang === 'es' ? 'Primera Compra' : 'First Purchase'}
            </h3>
            <p className="text-orange-100/80">
              {lang === 'es' ? 'Tu amigo realiza su orden' : 'Your friend makes their order'}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border-2 border-orange-400/30 hover:border-orange-400/50 transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/20 hover:-translate-y-2 group">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-orange-500/30 group-hover:scale-110 transition-transform">
              <Percent className="w-10 h-10 text-white" />
            </div>
            <h3 className="font-bold text-xl text-white mb-3 group-hover:text-orange-300 transition-colors">
              {lang === 'es' ? 'Ambos Ganan' : 'Both Win'}
            </h3>
            <p className="text-orange-100/80">
              {lang === 'es' ? '15% de descuento cada uno' : '15% discount each'}
            </p>
          </div>
        </div>

        <a
          href="#referrals"
          className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-10 py-5 rounded-full text-lg font-bold transition-all duration-300 shadow-2xl shadow-orange-500/40 hover:shadow-orange-500/60 hover:scale-105"
        >
          <Gift className="w-6 h-6" />
          {t.cta}
        </a>
      </div>
    </section>
  );
}

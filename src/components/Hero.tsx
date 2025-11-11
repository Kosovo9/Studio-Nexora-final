import { Sparkles, Zap } from 'lucide-react';
import { Language, translations } from '../lib/translations';
import AnimatedCarousel from './AnimatedCarousel';

interface HeroProps {
  lang: Language;
  onGetStarted: () => void;
}

export default function Hero({ lang, onGetStarted }: HeroProps) {
  const t = translations[lang].hero;

  const leftCarouselImages = [
    'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=400'
  ];

  const rightCarouselImages = [
    'https://images.pexels.com/photos/2253879/pexels-photo-2253879.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/4195325/pexels-photo-4195325.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/3184398/pexels-photo-3184398.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400'
  ];

  return (
    <section className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white overflow-hidden min-h-screen">
      <div className="absolute inset-0">
        <img
          src="https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="Luxury background"
          className="w-full h-full object-cover opacity-10"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-slate-900/90 to-black/95"></div>
      </div>

      <div className="absolute left-0 top-0 bottom-0 w-64 opacity-20">
        <AnimatedCarousel images={leftCarouselImages} direction="left" />
      </div>

      <div className="absolute right-0 top-0 bottom-0 w-64 opacity-20">
        <AnimatedCarousel images={rightCarouselImages} direction="right" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 flex items-center min-h-screen">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-sm border border-cyan-400/30 rounded-full px-4 py-2 mb-8">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-medium bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
              {t.subtitle}
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white via-cyan-200 to-blue-200 bg-clip-text text-transparent">
              {t.title}
            </span>
          </h1>

          <button
            onClick={onGetStarted}
            className="group inline-flex items-center gap-3 bg-gradient-to-r from-cyan-500 via-blue-600 to-blue-700 hover:from-cyan-600 hover:via-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40 hover:scale-105 mb-16"
          >
            <img src="/Nexora LOGO.jpg" alt="Nexora" className="w-10 h-10 rounded-lg shadow-xl" />
            {t.cta}
            <Zap className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-0 -z-10 rounded-3xl overflow-hidden">
              <img
                src="/image.png"
                alt="Earth from space"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-slate-950/40"></div>
            </div>

            <div className="grid grid-cols-3 gap-6 relative z-10 p-2">
              <div className="bg-white/5 backdrop-blur-xl border border-cyan-400/30 rounded-2xl p-6 hover:bg-white/10 hover:border-cyan-400/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20">
                <div className="text-3xl font-bold bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent mb-1">
                  {t.stats.clients}
                </div>
              </div>
              <div className="bg-white/5 backdrop-blur-xl border border-blue-400/30 rounded-2xl p-6 hover:bg-white/10 hover:border-blue-400/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20">
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent mb-1">
                  {t.stats.quality}
                </div>
              </div>
              <div className="bg-white/5 backdrop-blur-xl border border-cyan-400/30 rounded-2xl p-6 hover:bg-white/10 hover:border-cyan-400/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20">
                <div className="text-3xl font-bold bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent mb-1">
                  {t.stats.speed}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

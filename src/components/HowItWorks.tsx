import { Upload, Sparkles, Download } from 'lucide-react';
import { Language, translations } from '../lib/translations';

interface HowItWorksProps {
  lang: Language;
}

export default function HowItWorks({ lang }: HowItWorksProps) {
  const t = translations[lang].howItWorks;

  const steps = [
    {
      icon: Upload,
      title: t.step1.title,
      desc: t.step1.desc,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Sparkles,
      title: t.step2.title,
      desc: t.step2.desc,
      color: 'from-violet-500 to-purple-500'
    },
    {
      icon: Download,
      title: t.step3.title,
      desc: t.step3.desc,
      color: 'from-emerald-500 to-teal-500'
    }
  ];

  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-black">
        <img
          src="https://images.pexels.com/photos/2159/flight-sky-earth-space.jpg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop"
          alt="Space shuttle launch"
          className="w-full h-full object-cover opacity-90"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/60 to-black/75"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-300 via-blue-300 to-cyan-300 bg-clip-text text-transparent">
            {t.title}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative group"
            >
              <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl p-8 h-full border-2 border-white/10 hover:border-cyan-400/50 transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/20 hover:-translate-y-3 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className={`relative inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${step.color} text-white mb-8 shadow-2xl shadow-cyan-500/30 group-hover:scale-110 transition-transform duration-500`}>
                  <step.icon className="w-10 h-10" />
                </div>

                <div className="absolute top-6 right-6 text-8xl font-bold text-white/5 group-hover:text-white/10 transition-colors duration-500">
                  {index + 1}
                </div>

                <h3 className="relative text-2xl font-bold text-white mb-4 group-hover:text-cyan-300 transition-colors duration-300">
                  {step.title}
                </h3>
                <p className="relative text-cyan-100/80 text-lg leading-relaxed">
                  {step.desc}
                </p>

                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>

              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-cyan-400/50 to-transparent z-10"></div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-16 flex justify-center gap-3">
          <div className="w-3 h-3 rounded-full bg-cyan-400/50 animate-pulse"></div>
          <div className="w-3 h-3 rounded-full bg-blue-400/50 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-3 h-3 rounded-full bg-cyan-400/50 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </section>
  );
}

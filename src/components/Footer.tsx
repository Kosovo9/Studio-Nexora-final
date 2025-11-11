import { Globe, CreditCard } from 'lucide-react';
import { Language, translations } from '../lib/translations';

interface FooterProps {
  lang: Language;
  onLanguageChange: (lang: Language) => void;
}

export default function Footer({ lang, onLanguageChange }: FooterProps) {
  const t = translations[lang].footer;

  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-1">
            <div className="flex items-center gap-4 mb-6">
              <img src="/Nexora LOGO.jpg" alt="Nexora" className="w-16 h-16 rounded-xl shadow-2xl" />
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Studio Nexora</span>
            </div>
            <p className="text-sm text-slate-400 mb-4 leading-relaxed">
              {lang === 'es'
                ? 'Transformamos tus fotos en retratos profesionales con IA de última generación.'
                : 'We transform your photos into professional portraits with cutting-edge AI.'}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => onLanguageChange('es')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  lang === 'es'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                ES
              </button>
              <button
                onClick={() => onLanguageChange('en')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  lang === 'en'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                EN
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">{t.company}</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm hover:text-white transition-colors">
                  {t.about}
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-white transition-colors">
                  {t.blog}
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-white transition-colors">
                  {t.careers}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">{t.legal}</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm hover:text-white transition-colors">
                  {t.privacy}
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-white transition-colors">
                  {t.terms}
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-white transition-colors">
                  {t.cookies}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">{t.support}</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm hover:text-white transition-colors">
                  {t.help}
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-white transition-colors">
                  {t.contact}
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-white transition-colors">
                  {t.faq}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8">
          <div className="bg-slate-800/50 rounded-2xl p-6 mb-6">
            <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
              <Globe className="w-5 h-5" />
              {t.disclaimer}
            </h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              {t.disclaimerText}
            </p>
          </div>

          <div className="flex flex-col items-center gap-6">
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-2 text-slate-400">
                <CreditCard className="w-5 h-5" />
                <span className="text-sm font-medium">
                  {lang === 'es' ? 'Métodos de pago seguros' : 'Secure payment methods'}
                </span>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-6">
                <div className="bg-white rounded-lg px-4 py-2 shadow-lg hover:shadow-xl transition-shadow">
                  <svg className="h-8" viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="48" height="32" rx="4" fill="white"/>
                    <path d="M18.5 9.5H29.5V22.5H18.5V9.5Z" fill="#FF5F00"/>
                    <path d="M19 16C19 13.2 20.4 10.8 22.5 9.5C21.1 8.5 19.4 8 17.5 8C12.8 8 9 11.8 9 16.5C9 21.2 12.8 25 17.5 25C19.4 25 21.1 24.5 22.5 23.5C20.4 22.2 19 19.8 19 16Z" fill="#EB001B"/>
                    <path d="M39 16.5C39 21.2 35.2 25 30.5 25C28.6 25 26.9 24.5 25.5 23.5C27.6 22.2 29 19.8 29 16C29 13.2 27.6 10.8 25.5 9.5C26.9 8.5 28.6 8 30.5 8C35.2 8 39 11.8 39 16.5Z" fill="#F79E1B"/>
                  </svg>
                </div>
                <div className="bg-white rounded-lg px-4 py-2 shadow-lg hover:shadow-xl transition-shadow">
                  <svg className="h-8" viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="48" height="32" rx="4" fill="white"/>
                    <path d="M20.5 9L14 23H18L19 20H23L24 23H28L21.5 9H20.5Z" fill="#1434CB"/>
                    <path d="M21 13L22.5 18H19.5L21 13Z" fill="#1434CB"/>
                    <path d="M31 9L24.5 23H28.5L35 9H31Z" fill="#1434CB"/>
                  </svg>
                </div>
                <div className="bg-gradient-to-r from-yellow-300 to-yellow-400 rounded-lg px-4 py-2 shadow-lg hover:shadow-xl transition-shadow">
                  <svg className="h-8" viewBox="0 0 80 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <text x="4" y="22" fontFamily="Arial, sans-serif" fontSize="18" fontWeight="bold" fill="#000">Lemon</text>
                  </svg>
                </div>
                <div className="bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg px-4 py-2 shadow-lg hover:shadow-xl transition-shadow">
                  <svg className="h-8" viewBox="0 0 60 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <text x="4" y="22" fontFamily="Arial, sans-serif" fontSize="16" fontWeight="bold" fill="#fff">Stripe</text>
                  </svg>
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-slate-400">
                © 2024 Studio Nexora. {t.rights}
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

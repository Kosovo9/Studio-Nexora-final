import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Language } from '../lib/translations';

interface HeaderProps {
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  onGetStarted?: () => void;
}

export default function Header({ lang, onLanguageChange, onGetStarted }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { label: lang === 'es' ? 'Inicio' : 'Home', href: '#home' },
    { label: lang === 'es' ? 'Precios' : 'Pricing', href: '#pricing' },
    { label: lang === 'es' ? 'Ejemplos' : 'Examples', href: '#samples' },
    { label: lang === 'es' ? 'Afiliados' : 'Affiliates', href: '#affiliates' }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-100 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-xl bg-slate-800 flex items-center justify-center shadow-lg">
              <span className="text-3xl font-bold text-blue-400">N</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-800 leading-tight">NEXORA</span>
              <span className="text-4xl font-extrabold text-blue-700 leading-tight">Studio Nexora</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-10">
            {menuItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-slate-600 hover:text-blue-600 font-semibold text-lg transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-5">
            <div className="flex gap-2">
              <button
                onClick={() => onLanguageChange('es')}
                className={`px-4 py-2 rounded-lg text-base font-semibold transition-colors ${
                  lang === 'es'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                }`}
              >
                ES
              </button>
              <button
                onClick={() => onLanguageChange('en')}
                className={`px-4 py-2 rounded-lg text-base font-semibold transition-colors ${
                  lang === 'en'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                }`}
              >
                EN
              </button>
            </div>

            <button
              onClick={onGetStarted}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-bold text-lg transition-all shadow-lg hover:shadow-xl"
            >
              {lang === 'es' ? 'Comenzar' : 'Get Started'}
            </button>
          </div>

          <button
            className="md:hidden text-slate-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200">
          <div className="px-4 py-4 space-y-4">
            {menuItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="block text-slate-700 hover:text-blue-600 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <div className="flex gap-2 pt-4 border-t border-slate-200">
              <button
                onClick={() => onLanguageChange('es')}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium ${
                  lang === 'es'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                ES
              </button>
              <button
                onClick={() => onLanguageChange('en')}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium ${
                  lang === 'en'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                EN
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Language } from '../lib/translations';

interface HeaderProps {
  lang: Language;
  onLanguageChange: (lang: Language) => void;
}

export default function Header({ lang, onLanguageChange }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { label: lang === 'es' ? 'Inicio' : 'Home', href: '#home' },
    { label: lang === 'es' ? 'Precios' : 'Pricing', href: '#pricing' },
    { label: lang === 'es' ? 'Ejemplos' : 'Examples', href: '#samples' },
    { label: lang === 'es' ? 'Afiliados' : 'Affiliates', href: '#affiliates' }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-5">
            <img src="/Nexora LOGO.jpg" alt="Nexora" className="w-20 h-20 rounded-xl shadow-lg" />
            <span className="text-3xl font-extrabold bg-gradient-to-r from-blue-700 to-blue-900 bg-clip-text text-transparent">Studio Nexora</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {menuItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-slate-700 hover:text-blue-600 font-semibold text-base transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <div className="flex gap-2">
              <button
                onClick={() => onLanguageChange('es')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  lang === 'es'
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                ES
              </button>
              <button
                onClick={() => onLanguageChange('en')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  lang === 'en'
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                EN
              </button>
            </div>

            <button className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors shadow-lg">
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

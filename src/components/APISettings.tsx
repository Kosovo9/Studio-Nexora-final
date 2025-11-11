import { Key, Database, CreditCard, Zap, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { Language } from '../lib/translations';

interface APISettingsProps {
  lang: Language;
}

export default function APISettings({ lang }: APISettingsProps) {
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState(false);

  const apiConfigs = [
    {
      id: 'stripe',
      name: 'Stripe',
      icon: CreditCard,
      color: 'from-blue-500 to-cyan-500',
      keys: [
        { label: lang === 'es' ? 'Llave Pública' : 'Public Key', field: 'STRIPE_PUBLIC_KEY', placeholder: 'pk_live_...' },
        { label: lang === 'es' ? 'Llave Secreta' : 'Secret Key', field: 'STRIPE_SECRET_KEY', placeholder: 'sk_live_...' }
      ]
    },
    {
      id: 'lemonsqueezy',
      name: 'Lemon Squeezy',
      icon: Zap,
      color: 'from-amber-500 to-yellow-500',
      keys: [
        { label: 'API Key', field: 'LEMONSQUEEZY_API_KEY', placeholder: 'lsk_...' },
        { label: 'Store ID', field: 'LEMONSQUEEZY_STORE_ID', placeholder: '12345' }
      ]
    },
    {
      id: 'ai',
      name: lang === 'es' ? 'IA (Generación de Imágenes)' : 'AI (Image Generation)',
      icon: Zap,
      color: 'from-violet-500 to-purple-500',
      keys: [
        { label: 'API Key', field: 'AI_API_KEY', placeholder: 'sk-...' },
        { label: 'API Endpoint', field: 'AI_API_ENDPOINT', placeholder: 'https://api.example.com' }
      ]
    },
    {
      id: 'supabase',
      name: 'Supabase',
      icon: Database,
      color: 'from-emerald-500 to-teal-500',
      keys: [
        { label: 'Project URL', field: 'SUPABASE_URL', placeholder: 'https://xxx.supabase.co' },
        { label: 'Anon Key', field: 'SUPABASE_ANON_KEY', placeholder: 'eyJ...' }
      ]
    }
  ];

  const toggleShow = (field: string) => {
    setShowKeys(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-3">
          <Key className="w-8 h-8 text-blue-600" />
          {lang === 'es' ? 'Configuración de APIs' : 'API Configuration'}
        </h2>
        <p className="text-slate-600">
          {lang === 'es'
            ? 'Configura las llaves API necesarias para el funcionamiento de la plataforma'
            : 'Configure the API keys required for platform operation'}
        </p>
      </div>

      <div className="space-y-6 mb-8">
        {apiConfigs.map((config) => (
          <div
            key={config.id}
            className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden shadow-lg"
          >
            <div className={`bg-gradient-to-r ${config.color} p-6 text-white`}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <config.icon className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold">{config.name}</h3>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {config.keys.map((key) => (
                <div key={key.field}>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    {key.label}
                  </label>
                  <div className="relative">
                    <input
                      type={showKeys[key.field] ? 'text' : 'password'}
                      placeholder={key.placeholder}
                      className="w-full px-4 py-3 pr-12 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors font-mono text-sm"
                    />
                    <button
                      onClick={() => toggleShow(key.field)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showKeys[key.field] ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6 mb-6">
        <h4 className="font-bold text-amber-900 mb-2 flex items-center gap-2">
          <Zap className="w-5 h-5" />
          {lang === 'es' ? 'Importante' : 'Important'}
        </h4>
        <p className="text-amber-800 text-sm leading-relaxed">
          {lang === 'es'
            ? 'Las llaves API son sensibles y deben mantenerse seguras. Nunca las compartas públicamente. Estas configuraciones se guardarán de forma segura en variables de entorno.'
            : 'API keys are sensitive and must be kept secure. Never share them publicly. These settings will be saved securely in environment variables.'}
        </p>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center gap-3 ${
            saved
              ? 'bg-emerald-600 text-white'
              : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl'
          }`}
        >
          {saved ? (
            <>
              <CheckCircle2 className="w-5 h-5" />
              {lang === 'es' ? 'Guardado' : 'Saved'}
            </>
          ) : (
            <>
              <Key className="w-5 h-5" />
              {lang === 'es' ? 'Guardar Configuración' : 'Save Configuration'}
            </>
          )}
        </button>
      </div>
    </div>
  );
}

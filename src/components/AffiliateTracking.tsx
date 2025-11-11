import { DollarSign, TrendingUp, Users, Eye, Copy, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { Language, translations } from '../lib/translations';

interface AffiliateTrackingProps {
  lang: Language;
}

export default function AffiliateTracking({ lang }: AffiliateTrackingProps) {
  const [copied, setCopied] = useState(false);
  const t = translations[lang].tracking;

  const affiliateCode = 'NEXORA-AF123';
  const affiliateUrl = `https://studionexora.com?ref=${affiliateCode}`;

  const stats = {
    totalEarnings: '15,420',
    pendingPayment: '2,340',
    sales: 38,
    clicks: 1250,
    conversionRate: 3.04
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(affiliateUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">{t.title}</h2>
        <p className="text-slate-600">
          {lang === 'es'
            ? 'Monitorea tus ganancias y rendimiento en tiempo real'
            : 'Monitor your earnings and performance in real-time'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="w-8 h-8" />
            <div className="text-sm opacity-90">{t.totalEarnings}</div>
          </div>
          <div className="text-3xl font-bold">${stats.totalEarnings}</div>
          <div className="text-sm opacity-75 mt-1">MXN</div>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8" />
            <div className="text-sm opacity-90">{t.pendingPayment}</div>
          </div>
          <div className="text-3xl font-bold">${stats.pendingPayment}</div>
          <div className="text-sm opacity-75 mt-1">MXN</div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8" />
            <div className="text-sm opacity-90">{t.sales}</div>
          </div>
          <div className="text-3xl font-bold">{stats.sales}</div>
        </div>

        <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <Eye className="w-8 h-8" />
            <div className="text-sm opacity-90">{t.clicks}</div>
          </div>
          <div className="text-3xl font-bold">{stats.clicks}</div>
          <div className="text-sm opacity-75 mt-1">{t.conversionRate}: {stats.conversionRate}%</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 shadow-lg">
        <h3 className="text-xl font-bold text-slate-900 mb-4">{t.affiliateCode}</h3>

        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            {lang === 'es' ? 'Tu código de afiliado' : 'Your affiliate code'}
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={affiliateCode}
              readOnly
              className="flex-1 px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-900"
            />
            <button
              onClick={handleCopy}
              className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-xl font-semibold transition-all duration-300 flex items-center gap-2"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  {lang === 'es' ? 'Copiado' : 'Copied'}
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  {lang === 'es' ? 'Copiar' : 'Copy'}
                </>
              )}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            {lang === 'es' ? 'Tu enlace de afiliado' : 'Your affiliate link'}
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={affiliateUrl}
              readOnly
              className="flex-1 px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-700"
            />
            <button
              onClick={handleCopy}
              className="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl font-semibold transition-colors"
            >
              <Copy className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Gift, Users2, CheckCircle, Clock, Copy } from 'lucide-react';
import { useState } from 'react';
import { Language, translations } from '../lib/translations';
import { useReferral } from '../lib/hooks/useReferral';
import { useAuth } from '../lib/hooks/useAuth';

interface ReferralTrackingProps {
  lang: Language;
}

export default function ReferralTracking({ lang }: ReferralTrackingProps) {
  const { user } = useAuth();
  const { referralCode, referrals, loading, error } = useReferral(user?.id || null);
  const [copied, setCopied] = useState(false);
  const t = translations[lang].tracking;

  const appUrl = import.meta.env.VITE_APP_URL || 'https://studionexora.com';
  const referralUrl = referralCode ? `${appUrl}?ref=${referralCode}` : '';

  const handleCopy = () => {
    if (referralUrl) {
      navigator.clipboard.writeText(referralUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">
          {lang === 'es' ? 'Mis Referidos' : 'My Referrals'}
        </h2>
        <p className="text-slate-600">
          {lang === 'es'
            ? 'Comparte tu código y obtén 15% de descuento'
            : 'Share your code and get 15% discount'}
        </p>
      </div>

      <div className="bg-gradient-to-br from-blue-500 to-violet-600 rounded-2xl p-8 text-white mb-8 shadow-xl">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
            <Gift className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-2xl font-bold">15% OFF</h3>
            <p className="opacity-90">
              {lang === 'es' ? 'Por cada amigo que compre' : 'For each friend who buys'}
            </p>
          </div>
        </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-4">
          <label className="block text-sm font-medium mb-2 opacity-90">
            {t.referralCode}
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={referralCode || ''}
              readOnly
              className="flex-1 px-4 py-2 bg-white/20 border border-white/30 rounded-lg font-mono text-white placeholder-white/50"
              placeholder={loading ? (lang === 'es' ? 'Cargando...' : 'Loading...') : ''}
            />
            <button
              onClick={handleCopy}
              disabled={!referralCode}
              className="px-4 py-2 bg-white hover:bg-white/90 text-violet-600 rounded-lg font-semibold transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Copy className="w-5 h-5" />
              {copied ? (lang === 'es' ? 'Copiado' : 'Copied') : (lang === 'es' ? 'Copiar' : 'Copy')}
            </button>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <label className="block text-sm font-medium mb-2 opacity-90">
            {lang === 'es' ? 'Enlace de referido' : 'Referral link'}
          </label>
          <input
            type="text"
            value={referralUrl}
            readOnly
            className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-sm text-white"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 shadow-lg">
        <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Users2 className="w-6 h-6 text-blue-600" />
          {lang === 'es' ? 'Historial de Referidos' : 'Referral History'}
        </h3>

        {loading ? (
          <div className="text-center py-8 text-slate-500">
            {lang === 'es' ? 'Cargando...' : 'Loading...'}
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">
            {error}
          </div>
        ) : referrals.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            {lang === 'es'
              ? 'Aún no has referido a nadie. ¡Comparte tu código!'
              : 'You haven\'t referred anyone yet. Share your code!'}
          </div>
        ) : (
          <div className="space-y-3">
            {referrals.map((referral) => (
              <div
                key={referral.id}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-4">
                  {referral.status === 'completed' ? (
                    <CheckCircle className="w-6 h-6 text-emerald-600" />
                  ) : (
                    <Clock className="w-6 h-6 text-amber-600" />
                  )}
                  <div>
                    <div className="font-semibold text-slate-900">
                      {lang === 'es' ? 'Referido' : 'Referred'} #{referral.refereeId.substring(0, 8)}
                    </div>
                    <div className="text-sm text-slate-600">
                      {new Date(referral.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-emerald-600">
                    {referral.status === 'completed' ? '20% OFF' : '15% OFF'}
                  </div>
                  <div className="text-sm text-slate-500">
                    {referral.status === 'completed'
                      ? lang === 'es' ? 'Completado' : 'Completed'
                      : lang === 'es' ? 'Pendiente' : 'Pending'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

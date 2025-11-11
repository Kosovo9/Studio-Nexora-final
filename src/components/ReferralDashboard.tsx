import { Gift, Users2, TrendingUp, Copy, CheckCircle, Clock, Percent } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useReferral } from '../lib/hooks/useReferral';
import { useAuth } from '../lib/hooks/useAuth';
import { Language, translations } from '../lib/translations';

interface ReferralDashboardProps {
  lang: Language;
}

export default function ReferralDashboard({ lang }: ReferralDashboardProps) {
  const { user } = useAuth();
  const {
    referralCode,
    stats,
    referrals,
    discountCodes,
    loading,
    error,
    refresh,
  } = useReferral(user?.id || null);

  const [copied, setCopied] = useState(false);
  const appUrl = import.meta.env.VITE_APP_URL || 'https://studionexora.com';
  const referralUrl = referralCode ? `${appUrl}?ref=${referralCode}` : '';

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Si no hay usuario, mostrar mensaje discreto sin romper el layout
  if (!user) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-12 text-slate-600 bg-slate-50 rounded-2xl border border-slate-200">
          <p className="text-lg">
            {lang === 'es' ? 'Inicia sesión para ver tus referidos' : 'Sign in to view your referrals'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
          {lang === 'es' ? 'Programa de Referidos' : 'Referral Program'}
        </h2>
        <p className="text-slate-600">
          {lang === 'es'
            ? 'Invita amigos y obtén descuentos en tus compras'
            : 'Invite friends and get discounts on your purchases'}
        </p>
      </div>

      {loading && (
        <div className="text-center py-12 text-slate-600">
          {lang === 'es' ? 'Cargando...' : 'Loading...'}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-red-800">
          {error}
        </div>
      )}

      {/* Estadísticas */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <Users2 className="w-8 h-8" />
              <div className="text-sm opacity-90">
                {lang === 'es' ? 'Total Referidos' : 'Total Referrals'}
              </div>
            </div>
            <div className="text-3xl font-bold">{stats.totalReferrals}</div>
          </div>

          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <CheckCircle className="w-8 h-8" />
              <div className="text-sm opacity-90">
                {lang === 'es' ? 'Completados' : 'Completed'}
              </div>
            </div>
            <div className="text-3xl font-bold">{stats.completedReferrals}</div>
          </div>

          <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <Clock className="w-8 h-8" />
              <div className="text-sm opacity-90">
                {lang === 'es' ? 'Pendientes' : 'Pending'}
              </div>
            </div>
            <div className="text-3xl font-bold">{stats.pendingReferrals}</div>
          </div>

          <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <Gift className="w-8 h-8" />
              <div className="text-sm opacity-90">
                {lang === 'es' ? 'Descuentos Disponibles' : 'Available Discounts'}
              </div>
            </div>
            <div className="text-3xl font-bold">{stats.availableDiscounts}/3</div>
          </div>
        </div>
      )}

      {/* Código de Referido */}
      {referralCode && (
        <div className="bg-gradient-to-br from-blue-500 to-violet-600 rounded-2xl p-8 text-white mb-8 shadow-xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <Gift className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">
                {lang === 'es' ? 'Tu Código de Referido' : 'Your Referral Code'}
              </h3>
              <p className="opacity-90">
                {lang === 'es'
                  ? 'Comparte este código y ambos ganan'
                  : 'Share this code and both win'}
              </p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-4">
            <label className="block text-sm font-medium mb-2 opacity-90">
              {lang === 'es' ? 'Código' : 'Code'}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={referralCode}
                readOnly
                className="flex-1 px-4 py-3 bg-white/20 border border-white/30 rounded-lg font-mono text-lg text-white"
              />
              <button
                onClick={() => handleCopy(referralCode)}
                className="px-6 py-3 bg-white hover:bg-white/90 text-violet-600 rounded-lg font-semibold transition-colors flex items-center gap-2"
              >
                <Copy className="w-5 h-5" />
                {copied ? (lang === 'es' ? 'Copiado' : 'Copied') : (lang === 'es' ? 'Copiar' : 'Copy')}
              </button>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <label className="block text-sm font-medium mb-2 opacity-90">
              {lang === 'es' ? 'Enlace de Referido' : 'Referral Link'}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={referralUrl}
                readOnly
                className="flex-1 px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-sm text-white"
              />
              <button
                onClick={() => handleCopy(referralUrl)}
                className="px-4 py-2 bg-white hover:bg-white/90 text-violet-600 rounded-lg font-semibold transition-colors"
              >
                <Copy className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="font-semibold mb-1">
                {lang === 'es' ? 'Para tu amigo:' : 'For your friend:'}
              </div>
              <div className="text-2xl font-bold">15% OFF</div>
              <div className="opacity-75">
                {lang === 'es' ? 'En su primera compra' : 'On their first purchase'}
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="font-semibold mb-1">
                {lang === 'es' ? 'Para ti:' : 'For you:'}
              </div>
              <div className="text-2xl font-bold">20% OFF</div>
              <div className="opacity-75">
                {lang === 'es' ? 'Hasta 3 descuentos' : 'Up to 3 discounts'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Códigos de Descuento Disponibles */}
      {discountCodes.length > 0 && (
        <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 shadow-lg mb-8">
          <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Gift className="w-6 h-6 text-violet-600" />
            {lang === 'es' ? 'Mis Códigos de Descuento' : 'My Discount Codes'}
          </h3>
          <div className="space-y-3">
            {discountCodes.map((code) => (
              <div
                key={code.id}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl border border-violet-200"
              >
                <div>
                  <div className="font-mono font-bold text-lg text-violet-900">{code.code}</div>
                  <div className="text-sm text-slate-600">
                    {code.discountPercent}% {lang === 'es' ? 'de descuento' : 'discount'}
                    {code.expiresAt && (
                      <span className="ml-2">
                        - {lang === 'es' ? 'Expira' : 'Expires'}{' '}
                        {new Date(code.expiresAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-violet-600">{code.discountPercent}%</div>
                  <div className="text-xs text-slate-500">
                    {code.currentUses}/{code.maxUses}{' '}
                    {lang === 'es' ? 'usos' : 'uses'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Historial de Referidos */}
      <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 shadow-lg">
        <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Users2 className="w-6 h-6 text-blue-600" />
          {lang === 'es' ? 'Historial de Referidos' : 'Referral History'}
        </h3>

        {referrals.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            {lang === 'es'
              ? 'Aún no has referido a nadie. ¡Comparte tu código!'
              : "You haven't referred anyone yet. Share your code!"}
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
                    {referral.status === 'completed' ? '20% OFF' : 'Pendiente'}
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


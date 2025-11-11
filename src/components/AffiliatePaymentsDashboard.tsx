import { DollarSign, Calendar, TrendingUp, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../lib/hooks/useAuth';
import { getOrCreateAffiliate, getAffiliateStats, updateAffiliatePaymentMethod, type Affiliate } from '../lib/services/affiliateService';
import { getAffiliateTransactions, getNextPaymentCycles, type PaymentTransaction } from '../lib/services/paymentProcessingService';
import { Language } from '../lib/translations';

interface AffiliatePaymentsDashboardProps {
  lang: Language;
}

export default function AffiliatePaymentsDashboard({ lang }: AffiliatePaymentsDashboardProps) {
  const { user } = useAuth();
  const [affiliate, setAffiliate] = useState<Affiliate | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nextCycles, setNextCycles] = useState<{ date1: Date; date2: Date } | null>(null);

  useEffect(() => {
    if (user) {
      loadAffiliateData();
    }
  }, [user]);

  const loadAffiliateData = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const [affiliateResult, statsResult, transactionsResult] = await Promise.all([
        getOrCreateAffiliate(user.id),
        user ? getAffiliateStats(user.id) : Promise.resolve({ data: null, error: null }),
        user ? getAffiliateTransactions(user.id) : Promise.resolve({ data: null, error: null }),
      ]);

      if (affiliateResult.error) {
        setError(affiliateResult.error);
      } else {
        setAffiliate(affiliateResult.data);
      }

      if (statsResult.data) {
        setStats(statsResult.data);
      }

      if (transactionsResult.data) {
        setTransactions(transactionsResult.data);
      }

      setNextCycles(getNextPaymentCycles());
    } catch (err: any) {
      setError(err.message || 'Failed to load affiliate data');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-12 text-slate-600 bg-slate-50 rounded-2xl border border-slate-200">
          <p className="text-lg">
            {lang === 'es' ? 'Inicia sesión para ver tus pagos' : 'Sign in to view your payments'}
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-12 text-slate-600">
          {lang === 'es' ? 'Cargando...' : 'Loading...'}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
          {lang === 'es' ? 'Dashboard de Pagos' : 'Payments Dashboard'}
        </h2>
        <p className="text-slate-600">
          {lang === 'es'
            ? 'Gestiona tus ganancias y métodos de pago'
            : 'Manage your earnings and payment methods'}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-red-800">
          {error}
        </div>
      )}

      {/* Estadísticas de Earnings */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="w-8 h-8" />
              <div className="text-sm opacity-90">
                {lang === 'es' ? 'Total Ganado' : 'Total Earned'}
              </div>
            </div>
            <div className="text-3xl font-bold">${stats.totalEarnings.toFixed(2)}</div>
            <div className="text-sm opacity-75 mt-2">MXN</div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <CheckCircle className="w-8 h-8" />
              <div className="text-sm opacity-90">
                {lang === 'es' ? 'Pagado' : 'Paid'}
              </div>
            </div>
            <div className="text-3xl font-bold">${stats.paidEarnings.toFixed(2)}</div>
            <div className="text-sm opacity-75 mt-2">MXN</div>
          </div>

          <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <Clock className="w-8 h-8" />
              <div className="text-sm opacity-90">
                {lang === 'es' ? 'Pendiente' : 'Pending'}
              </div>
            </div>
            <div className="text-3xl font-bold">${stats.pendingEarnings.toFixed(2)}</div>
            <div className="text-sm opacity-75 mt-2">
              {stats.canWithdraw
                ? lang === 'es' ? 'Listo para pago' : 'Ready for payment'
                : `Min: $${affiliate?.minimumPayout || 500}`}
            </div>
          </div>

          <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8" />
              <div className="text-sm opacity-90">
                {lang === 'es' ? 'Conversión' : 'Conversion'}
              </div>
            </div>
            <div className="text-3xl font-bold">{stats.conversionRate.toFixed(1)}%</div>
            <div className="text-sm opacity-75 mt-2">
              {stats.totalConversions} / {stats.totalClicks}
            </div>
          </div>
        </div>
      )}

      {/* Próximos Ciclos de Pago */}
      {nextCycles && (
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 mb-8 border-2 border-blue-200">
          <div className="flex items-center gap-4 mb-4">
            <Calendar className="w-8 h-8 text-blue-600" />
            <h3 className="text-xl font-bold text-slate-900">
              {lang === 'es' ? 'Próximos Ciclos de Pago' : 'Next Payment Cycles'}
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-4 border border-blue-200">
              <div className="text-sm text-slate-600 mb-1">
                {lang === 'es' ? 'Primer Ciclo' : 'First Cycle'}
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {nextCycles.date1.toLocaleDateString('es-MX', {
                  day: 'numeric',
                  month: 'long',
                })}
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-blue-200">
              <div className="text-sm text-slate-600 mb-1">
                {lang === 'es' ? 'Segundo Ciclo' : 'Second Cycle'}
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {nextCycles.date2.toLocaleDateString('es-MX', {
                  day: 'numeric',
                  month: 'long',
                })}
              </div>
            </div>
          </div>
          <div className="mt-4 p-4 bg-blue-100 rounded-lg">
            <p className="text-sm text-blue-900">
              <strong>{lang === 'es' ? 'Recordatorio:' : 'Reminder:'}</strong>{' '}
              {lang === 'es'
                ? 'Los pagos se procesan los días 1 y 15 de cada mes. Mínimo $500 MXN acumulados con retención de 15 días.'
                : 'Payments are processed on the 1st and 15th of each month. Minimum $500 MXN accumulated with 15-day hold.'}
            </p>
          </div>
        </div>
      )}

      {/* Historial de Transacciones */}
      <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 shadow-lg">
        <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <DollarSign className="w-6 h-6 text-emerald-600" />
          {lang === 'es' ? 'Historial de Pagos' : 'Payment History'}
        </h3>

        {transactions.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            {lang === 'es'
              ? 'Aún no tienes transacciones de pago'
              : "You don't have any payment transactions yet"}
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-4">
                  {transaction.status === 'completed' ? (
                    <CheckCircle className="w-6 h-6 text-emerald-600" />
                  ) : transaction.status === 'processing' ? (
                    <Clock className="w-6 h-6 text-amber-600" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  )}
                  <div>
                    <div className="font-semibold text-slate-900">
                      ${transaction.amount.toFixed(2)} {transaction.currency}
                    </div>
                    <div className="text-sm text-slate-600">
                      {new Date(transaction.createdAt).toLocaleDateString('es-MX', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`font-bold ${
                      transaction.status === 'completed'
                        ? 'text-emerald-600'
                        : transaction.status === 'processing'
                        ? 'text-amber-600'
                        : 'text-red-600'
                    }`}
                  >
                    {transaction.status === 'completed'
                      ? lang === 'es' ? 'Completado' : 'Completed'
                      : transaction.status === 'processing'
                      ? lang === 'es' ? 'Procesando' : 'Processing'
                      : lang === 'es' ? 'Pendiente' : 'Pending'}
                  </div>
                  <div className="text-sm text-slate-500 capitalize">
                    {transaction.paymentMethod}
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


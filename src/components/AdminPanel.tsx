import { Users, DollarSign, ShoppingBag, TrendingUp, Activity } from 'lucide-react';
import { Language, translations } from '../lib/translations';

interface AdminPanelProps {
  lang: Language;
}

export default function AdminPanel({ lang }: AdminPanelProps) {
  const t = translations[lang].admin;

  const stats = {
    totalUsers: 52340,
    totalOrders: 18765,
    totalRevenue: 4523400,
    activeAffiliates: 1284,
    monthlyGrowth: 23.4
  };

  const recentOrders = [
    { id: 'ORD-001', user: 'Juan Pérez', amount: 350, status: 'completed', date: '2025-01-11' },
    { id: 'ORD-002', user: 'Maria Lopez', amount: 500, status: 'processing', date: '2025-01-11' },
    { id: 'ORD-003', user: 'Carlos Rodriguez', amount: 200, status: 'completed', date: '2025-01-11' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-2">
          {t.title}
        </h1>
        <p className="text-slate-600">
          {lang === 'es'
            ? 'Vista general de la plataforma Studio Nexora'
            : 'Studio Nexora platform overview'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-sm text-emerald-600 font-semibold">+12%</div>
          </div>
          <div className="text-3xl font-bold text-slate-900 mb-1">
            {stats.totalUsers.toLocaleString()}
          </div>
          <div className="text-sm text-slate-600">{t.users}</div>
        </div>

        <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="text-sm text-emerald-600 font-semibold">+8%</div>
          </div>
          <div className="text-3xl font-bold text-slate-900 mb-1">
            {stats.totalOrders.toLocaleString()}
          </div>
          <div className="text-sm text-slate-600">{t.orders}</div>
        </div>

        <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-amber-600" />
            </div>
            <div className="text-sm text-emerald-600 font-semibold">+23%</div>
          </div>
          <div className="text-3xl font-bold text-slate-900 mb-1">
            ${(stats.totalRevenue / 1000).toFixed(0)}K
          </div>
          <div className="text-sm text-slate-600">{t.revenue} MXN</div>
        </div>

        <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-violet-600" />
            </div>
            <div className="text-sm text-emerald-600 font-semibold">+15%</div>
          </div>
          <div className="text-3xl font-bold text-slate-900 mb-1">
            {stats.activeAffiliates.toLocaleString()}
          </div>
          <div className="text-sm text-slate-600">{t.affiliates}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 shadow-lg">
          <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Activity className="w-6 h-6 text-blue-600" />
            {lang === 'es' ? 'Órdenes Recientes' : 'Recent Orders'}
          </h3>
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <div>
                  <div className="font-semibold text-slate-900">{order.id}</div>
                  <div className="text-sm text-slate-600">{order.user}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-slate-900">${order.amount} MXN</div>
                  <div
                    className={`text-xs font-semibold ${
                      order.status === 'completed' ? 'text-emerald-600' : 'text-amber-600'
                    }`}
                  >
                    {order.status === 'completed'
                      ? lang === 'es' ? 'Completado' : 'Completed'
                      : lang === 'es' ? 'Procesando' : 'Processing'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl">
          <h3 className="text-2xl font-bold mb-4">
            {lang === 'es' ? 'Crecimiento Mensual' : 'Monthly Growth'}
          </h3>
          <div className="text-6xl font-bold mb-2">+{stats.monthlyGrowth}%</div>
          <p className="text-cyan-100">
            {lang === 'es'
              ? 'Comparado con el mes anterior'
              : 'Compared to previous month'}
          </p>
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-2xl font-bold">+{((stats.totalOrders * 0.08) / 30).toFixed(0)}</div>
              <div className="text-sm text-cyan-100">
                {lang === 'es' ? 'Órdenes/día' : 'Orders/day'}
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-2xl font-bold">$
                {((stats.totalRevenue * 0.23) / 30 / 1000).toFixed(0)}K
              </div>
              <div className="text-sm text-cyan-100">
                {lang === 'es' ? 'Ingresos/día' : 'Revenue/day'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

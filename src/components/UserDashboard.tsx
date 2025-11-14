import { useState, useEffect } from 'react';
import { User, Package, Clock, CheckCircle, XCircle, Download, Image as ImageIcon } from 'lucide-react';
import { Language } from '../lib/translations';
import { useAuth } from '../lib/hooks/useAuth';
import { getUserOrders, type Order } from '../lib/services/orderService';
import { supabase } from '../lib/supabase';

interface UserDashboardProps {
  lang: Language;
  onViewResults?: (orderId: string) => void;
}

export default function UserDashboard({ lang, onViewResults }: UserDashboardProps) {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'orders' | 'profile'>('orders');

  useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [user]);

  const loadOrders = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await getUserOrders(user.id);
      if (!error && data) {
        setOrders(data);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { icon: Clock, color: 'bg-yellow-100 text-yellow-800', text: lang === 'es' ? 'Pendiente' : 'Pending' },
      processing: { icon: Clock, color: 'bg-blue-100 text-blue-800', text: lang === 'es' ? 'Procesando' : 'Processing' },
      completed: { icon: CheckCircle, color: 'bg-green-100 text-green-800', text: lang === 'es' ? 'Completado' : 'Completed' },
      failed: { icon: XCircle, color: 'bg-red-100 text-red-800', text: lang === 'es' ? 'Fallido' : 'Failed' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${config.color}`}>
        <Icon className="w-4 h-4" />
        {config.text}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(lang === 'es' ? 'es-MX' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
            <p className="mt-4 text-slate-600">{lang === 'es' ? 'Cargando...' : 'Loading...'}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <p className="text-xl text-slate-600">{lang === 'es' ? 'Por favor inicia sesión' : 'Please sign in'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            {lang === 'es' ? 'Mi Cuenta' : 'My Account'}
          </h1>
          <p className="text-slate-600">{lang === 'es' ? 'Gestiona tus órdenes y perfil' : 'Manage your orders and profile'}</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-slate-200">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-4 px-6 font-semibold transition-colors ${
              activeTab === 'orders'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Package className="w-5 h-5 inline-block mr-2" />
            {lang === 'es' ? 'Mis Órdenes' : 'My Orders'}
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-4 px-6 font-semibold transition-colors ${
              activeTab === 'profile'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-5 h-5 inline-block mr-2" />
            {lang === 'es' ? 'Perfil' : 'Profile'}
          </button>
        </div>

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            {orders.length === 0 ? (
              <div className="bg-white rounded-2xl border-2 border-slate-200 p-12 text-center">
                <Package className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  {lang === 'es' ? 'No tienes órdenes aún' : 'No orders yet'}
                </h3>
                <p className="text-slate-600 mb-6">
                  {lang === 'es' ? 'Comienza creando tu primera orden' : 'Start by creating your first order'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-2xl border-2 border-slate-200 p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-3">
                          <h3 className="text-lg font-bold text-slate-900">
                            {lang === 'es' ? 'Orden' : 'Order'} #{order.id.substring(0, 8).toUpperCase()}
                          </h3>
                          {getStatusBadge(order.payment_status)}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-slate-500 mb-1">{lang === 'es' ? 'Paquete' : 'Package'}</p>
                            <p className="font-semibold text-slate-900">{order.package_type}</p>
                          </div>
                          <div>
                            <p className="text-slate-500 mb-1">{lang === 'es' ? 'Precio' : 'Price'}</p>
                            <p className="font-semibold text-slate-900">${order.final_price_mxn} MXN</p>
                          </div>
                          <div>
                            <p className="text-slate-500 mb-1">{lang === 'es' ? 'Fecha' : 'Date'}</p>
                            <p className="font-semibold text-slate-900">{formatDate(order.created_at)}</p>
                          </div>
                          <div>
                            <p className="text-slate-500 mb-1">{lang === 'es' ? 'Método' : 'Method'}</p>
                            <p className="font-semibold text-slate-900">{order.payment_provider}</p>
                          </div>
                        </div>
                      </div>
                      {order.payment_status === 'completed' && (
                        <button
                          onClick={() => onViewResults?.(order.id)}
                          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                        >
                          <Download className="w-5 h-5" />
                          {lang === 'es' ? 'Ver Fotos' : 'View Photos'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-2xl border-2 border-slate-200 p-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  {lang === 'es' ? 'Nombre Completo' : 'Full Name'}
                </label>
                <p className="text-lg text-slate-900">{user.fullName || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  {lang === 'es' ? 'Correo Electrónico' : 'Email'}
                </label>
                <p className="text-lg text-slate-900">{user.email}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  {lang === 'es' ? 'Código de Referido' : 'Referral Code'}
                </label>
                <p className="text-lg font-mono text-blue-600">{user.affiliateCode}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  {lang === 'es' ? 'Créditos' : 'Credits'}
                </label>
                <p className="text-lg text-slate-900">{user.credits}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  {lang === 'es' ? 'Total Gastado' : 'Total Spent'}
                </label>
                <p className="text-lg text-slate-900">${user.totalSpent} MXN</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


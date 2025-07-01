import React, { memo } from 'react';
import { 
  MoreHorizontal, 
  Eye, 
  Download, 
  CreditCard, 
  ShoppingBag,
  Calendar,
  DollarSign,
  TrendingUp,
  CheckCircle,
  Clock,
  XCircle,
  ArrowRight
} from 'lucide-react';

interface RecentOrdersProps {
  orders: any[];
}

const OrderRow = memo(({ order, index }: { order: any; index: number }) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          icon: CheckCircle,
          bg: 'bg-gradient-to-r from-green-50 to-emerald-50',
          border: 'border-green-200',
          text: 'text-green-700',
          label: 'Terminée',
          dot: 'bg-green-500'
        };
      case 'pending':
        return {
          icon: Clock,
          bg: 'bg-gradient-to-r from-yellow-50 to-amber-50',
          border: 'border-yellow-200',
          text: 'text-yellow-700',
          label: 'En attente',
          dot: 'bg-yellow-500'
        };
      default:
        return {
          icon: XCircle,
          bg: 'bg-gradient-to-r from-red-50 to-rose-50',
          border: 'border-red-200',
          text: 'text-red-700',
          label: 'Annulée',
          dot: 'bg-red-500'
        };
    }
  };

  const statusConfig = getStatusConfig(order.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-4 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] group">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* ID Commande avec icône */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-600">ID Commande</div>
              <div className="text-base font-bold text-gray-900">
                #{order.id || `ORD-${index + 1}`}
              </div>
            </div>
          </div>

          {/* Date */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-600">Date</div>
              <div className="text-sm font-semibold text-gray-900">
                {new Date(order.created_at).toLocaleDateString('fr-FR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
                })}
              </div>
            </div>
          </div>

          {/* Montant */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-600">Montant</div>
              <div className="text-lg font-bold text-green-600">
                ${(order.amount_total / 100).toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Statut */}
          <div className={`flex items-center space-x-2 px-4 py-2 rounded-xl ${statusConfig.bg} border ${statusConfig.border}`}>
            <div className={`w-2 h-2 rounded-full ${statusConfig.dot}`}></div>
            <StatusIcon className={`w-4 h-4 ${statusConfig.text}`} />
            <span className={`text-sm font-semibold ${statusConfig.text}`}>
              {statusConfig.label}
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <button className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center text-white hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              <Eye className="w-4 h-4" />
            </button>
            <button className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              <Download className="w-4 h-4" />
            </button>
            <button className="w-10 h-10 bg-gradient-to-r from-gray-500 to-gray-600 rounded-xl flex items-center justify-center text-white hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

export const RecentOrders = memo(({ orders }: RecentOrdersProps) => {
  return (
    <div className="space-y-6">
      {/* Header amélioré */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Commandes récentes</h3>
            <p className="text-gray-600">Suivi de vos dernières transactions</p>
          </div>
        </div>
        <button className="group flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105">
          <span>Voir tout</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-green-900">Commandes terminées</span>
          </div>
          <p className="text-2xl font-bold text-green-900 mb-1">
            {orders.filter(o => o.status === 'completed').length}
          </p>
          <p className="text-sm text-green-700">Ce mois-ci</p>
        </div>

        <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-yellow-900">En attente</span>
          </div>
          <p className="text-2xl font-bold text-yellow-900 mb-1">
            {orders.filter(o => o.status === 'pending').length}
          </p>
          <p className="text-sm text-yellow-700">À traiter</p>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-blue-900">Revenus totaux</span>
          </div>
          <p className="text-2xl font-bold text-blue-900 mb-1">
            ${(orders.reduce((sum, order) => sum + (order.amount_total / 100), 0)).toFixed(2)}
          </p>
          <p className="text-sm text-blue-700">Ce mois-ci</p>
        </div>
      </div>

      {/* Liste des commandes */}
      <div className="space-y-4">
        {orders.length > 0 ? (
          orders.map((order, index) => (
            <OrderRow key={order.id || index} order={order} index={index} />
          ))
        ) : (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 text-center shadow-lg border border-white/20">
            <div className="w-20 h-20 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <CreditCard className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Aucune commande récente</h3>
            <p className="text-gray-600 mb-6">Les nouvelles commandes apparaîtront ici</p>
            <button className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              Voir l'historique complet
            </button>
          </div>
        )}
      </div>
    </div>
  );
});
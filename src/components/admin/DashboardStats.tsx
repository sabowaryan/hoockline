import React, { memo } from 'react';
import { 
  Users, 
  CreditCard, 
  DollarSign, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  UserPlus,
  ShoppingCart,
  TrendingDown,
  Activity
} from 'lucide-react';

interface DashboardStatsProps {
  stats: {
    totalUsers: number;
    totalOrders: number;
    totalRevenue: number;
    recentOrders: any[];
  };
}

interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
  icon: React.ComponentType<{ className?: string }>;
  color: 'blue' | 'green' | 'purple' | 'orange';
  gradient: string;
  bgGradient: string;
}

const StatCard = memo(({ title, value, change, icon: Icon, color, gradient, bgGradient }: StatCardProps) => {
  const colorClasses = {
    blue: {
      icon: 'text-blue-600',
      change: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-200'
    },
    green: {
      icon: 'text-green-600',
      change: 'text-green-600',
      bg: 'bg-green-50',
      border: 'border-green-200'
    },
    purple: {
      icon: 'text-purple-600',
      change: 'text-purple-600',
      bg: 'bg-purple-50',
      border: 'border-purple-200'
    },
    orange: {
      icon: 'text-orange-600',
      change: 'text-orange-600',
      bg: 'bg-orange-50',
      border: 'border-orange-200'
    }
  };

  const colors = colorClasses[color];

  return (
    <div className={`bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 transform hover:scale-105 group`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
          <p className={`text-3xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
            {value}
          </p>
        </div>
        <div className={`w-14 h-14 bg-gradient-to-r ${bgGradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}>
          <Icon className={`w-7 h-7 text-white`} />
        </div>
      </div>
      
      {change && (
        <div className={`flex items-center justify-between p-3 rounded-xl ${colors.bg} border ${colors.border}`}>
          <div className={`flex items-center text-sm font-semibold ${colors.change}`}>
            {change.type === 'increase' ? (
              <ArrowUpRight className="w-4 h-4 mr-2" />
            ) : (
              <ArrowDownRight className="w-4 h-4 mr-2" />
            )}
            <span>{Math.abs(change.value)}%</span>
          </div>
          <span className="text-xs text-gray-500 font-medium">
            vs mois dernier
          </span>
        </div>
      )}
    </div>
  );
});

export const DashboardStats = memo(({ stats }: DashboardStatsProps) => {
  const conversionRate = stats.totalUsers > 0 ? ((stats.totalOrders / stats.totalUsers) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Titre de section */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
          <Activity className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Statistiques du tableau de bord</h2>
          <p className="text-gray-600">Vue d'ensemble de vos performances</p>
        </div>
      </div>

      {/* Grille des statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Utilisateurs totaux"
          value={stats.totalUsers.toLocaleString()}
          change={{ value: 12, type: 'increase' }}
          icon={UserPlus}
          color="blue"
          gradient="from-blue-600 to-cyan-600"
          bgGradient="from-blue-500 to-cyan-600"
        />
        
        <StatCard
          title="Commandes totales"
          value={stats.totalOrders.toLocaleString()}
          change={{ value: 8, type: 'increase' }}
          icon={ShoppingCart}
          color="green"
          gradient="from-green-600 to-emerald-600"
          bgGradient="from-green-500 to-emerald-600"
        />
        
        <StatCard
          title="Revenus totaux"
          value={`$${stats.totalRevenue.toFixed(2)}`}
          change={{ value: 15, type: 'increase' }}
          icon={DollarSign}
          color="purple"
          gradient="from-purple-600 to-pink-600"
          bgGradient="from-purple-500 to-pink-600"
        />
        
        <StatCard
          title="Taux de conversion"
          value={`${conversionRate.toFixed(1)}%`}
          change={{ value: 3, type: 'decrease' }}
          icon={TrendingDown}
          color="orange"
          gradient="from-orange-600 to-amber-600"
          bgGradient="from-orange-500 to-amber-600"
        />
      </div>

      {/* Indicateurs de performance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-blue-900">Croissance utilisateurs</span>
          </div>
          <p className="text-2xl font-bold text-blue-900 mb-1">+12%</p>
          <p className="text-sm text-blue-700">Ce mois-ci</p>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-green-900">Commandes moyennes</span>
          </div>
          <p className="text-2xl font-bold text-green-900 mb-1">${(stats.totalRevenue / Math.max(stats.totalOrders, 1)).toFixed(2)}</p>
          <p className="text-sm text-green-700">Par commande</p>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
              <Users className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-purple-900">Utilisateurs actifs</span>
          </div>
          <p className="text-2xl font-bold text-purple-900 mb-1">{Math.round(stats.totalUsers * 0.85).toLocaleString()}</p>
          <p className="text-sm text-purple-700">85% du total</p>
        </div>
      </div>
    </div>
  );
});
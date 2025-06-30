import React from 'react';
import { Users, CreditCard, DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';

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
}

function StatCard({ title, value, change, icon: Icon, color }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600'
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <div className={`flex items-center mt-2 text-sm ${
              change.type === 'increase' ? 'text-green-600' : 'text-red-600'
            }`}>
              {change.type === 'increase' ? (
                <ArrowUpRight className="w-4 h-4 mr-1" />
              ) : (
                <ArrowDownRight className="w-4 h-4 mr-1" />
              )}
              <span>{Math.abs(change.value)}%</span>
              <span className="text-gray-500 ml-1">vs mois dernier</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const conversionRate = stats.totalUsers > 0 ? ((stats.totalOrders / stats.totalUsers) * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Utilisateurs totaux"
        value={stats.totalUsers.toLocaleString()}
        change={{ value: 12, type: 'increase' }}
        icon={Users}
        color="blue"
      />
      
      <StatCard
        title="Commandes totales"
        value={stats.totalOrders.toLocaleString()}
        change={{ value: 8, type: 'increase' }}
        icon={CreditCard}
        color="green"
      />
      
      <StatCard
        title="Revenus totaux"
        value={`$${stats.totalRevenue.toFixed(2)}`}
        change={{ value: 15, type: 'increase' }}
        icon={DollarSign}
        color="purple"
      />
      
      <StatCard
        title="Taux de conversion"
        value={`${conversionRate.toFixed(1)}%`}
        change={{ value: 3, type: 'decrease' }}
        icon={TrendingUp}
        color="orange"
      />
    </div>
  );
}
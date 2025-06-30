import React, { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { AdminLayout } from './admin/AdminLayout';
import { DashboardStats } from './admin/DashboardStats';
import { RecentOrders } from './admin/RecentOrders';
import { QuickActions } from './admin/QuickActions';

interface AdminDashboardProps {
  user: User;
}

interface DashboardStats {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  recentOrders: any[];
}

export function AdminDashboard({ user }: AdminDashboardProps) {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    recentOrders: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Fetch total users count
      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Fetch total orders and revenue
      const { data: orders, error: ordersError } = await supabase
        .from('stripe_orders')
        .select('amount_total, created_at, payment_status, status')
        .eq('status', 'completed');

      if (ordersError) {
        console.error('Error fetching orders:', ordersError);
      }

      const totalRevenue = orders?.reduce((sum, order) => sum + (order.amount_total / 100), 0) || 0;
      const recentOrders = orders?.slice(-10).reverse() || [];

      setStats({
        totalUsers: usersCount || 0,
        totalOrders: orders?.length || 0,
        totalRevenue,
        recentOrders
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout user={user}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Chargement du tableau de bord...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout user={user}>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 sm:p-8 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                Bienvenue, Administrateur
              </h1>
              <p className="text-purple-100 text-lg">
                Voici un aperçu de l'activité de Clicklone aujourd'hui
              </p>
            </div>
            <div className="mt-4 sm:mt-0 text-right">
              <div className="text-3xl font-bold">
                {new Date().toLocaleDateString('fr-FR', { 
                  day: '2-digit', 
                  month: 'short' 
                })}
              </div>
              <div className="text-purple-200 text-sm">
                {new Date().toLocaleDateString('fr-FR', { 
                  weekday: 'long' 
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <DashboardStats stats={stats} />

        {/* Recent Orders */}
        <RecentOrders orders={stats.recentOrders} />

        {/* Quick Actions */}
        <QuickActions />
      </div>
    </AdminLayout>
  );
}
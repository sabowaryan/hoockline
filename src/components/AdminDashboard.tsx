import React, { useState, useEffect, useMemo } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { AdminLayout } from './admin/AdminLayout';
import { DashboardStats } from './admin/DashboardStats';
import { RecentOrders } from './admin/RecentOrders';
import { QuickActions } from './admin/QuickActions';

interface AdminDashboardProps {
  user: User;
}

interface DashboardData {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  recentOrders: any[];
}

export function AdminDashboard({ user }: AdminDashboardProps) {
  const [data, setData] = useState<DashboardData>({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    recentOrders: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Optimized data fetching with parallel requests
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Execute all queries in parallel for better performance
        const [usersResult, ordersResult] = await Promise.allSettled([
          // Users count query
          supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true }),
          
          // Orders query with limit for recent orders
          supabase
            .from('stripe_orders')
            .select('amount_total, created_at, payment_status, status, id')
            .eq('status', 'completed')
            .order('created_at', { ascending: false })
            .limit(10)
        ]);

        // Process users result
        let totalUsers = 0;
        if (usersResult.status === 'fulfilled' && !usersResult.value.error) {
          totalUsers = usersResult.value.count || 0;
        } else if (usersResult.status === 'rejected') {
          console.warn('Failed to fetch users count:', usersResult.reason);
        }

        // Process orders result
        let totalOrders = 0;
        let totalRevenue = 0;
        let recentOrders: any[] = [];
        
        if (ordersResult.status === 'fulfilled' && !ordersResult.value.error) {
          const orders = ordersResult.value.data || [];
          totalOrders = orders.length;
          totalRevenue = orders.reduce((sum, order) => sum + (order.amount_total / 100), 0);
          recentOrders = orders.slice(0, 5); // Only show 5 most recent
        } else if (ordersResult.status === 'rejected') {
          console.warn('Failed to fetch orders:', ordersResult.reason);
        }

        setData({
          totalUsers,
          totalOrders,
          totalRevenue,
          recentOrders
        });

      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Memoized stats to prevent unnecessary re-renders
  const memoizedStats = useMemo(() => data, [data]);

  if (loading) {
    return (
      <AdminLayout user={user}>
        <div className="space-y-8">
          {/* Loading skeleton */}
          <div className="bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl p-6 sm:p-8 animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout user={user}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-600 text-2xl">⚠️</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Erreur de chargement</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Réessayer
            </button>
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
                Voici un aperçu de l'activité de Clicklone
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
        <DashboardStats stats={memoizedStats} />

        {/* Recent Orders */}
        <RecentOrders orders={memoizedStats.recentOrders} />

        {/* Quick Actions */}
        <QuickActions />
      </div>
    </AdminLayout>
  );
}
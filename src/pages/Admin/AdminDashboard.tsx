import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../lib/supabase';
import { DashboardStats } from '../../components/admin/DashboardStats';
import { RecentOrders } from '../../components/admin/RecentOrders';
import { QuickActions } from '../../components/admin/QuickActions';
import { 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  DollarSign, 
  Calendar,
  Clock,
  RefreshCw,
  AlertCircle,
  Sparkles,
  BarChart3
} from 'lucide-react';

interface DashboardData {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  recentOrders: any[];
}

export function AdminDashboard() {
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Loading skeleton for header */}
          <div className="bg-gradient-to-r from-gray-200 to-gray-300 rounded-3xl p-8 animate-pulse">
            <div className="h-10 bg-gray-300 rounded-xl w-1/3 mb-4"></div>
            <div className="h-6 bg-gray-300 rounded-lg w-1/2"></div>
          </div>
          
          {/* Loading skeleton for stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 animate-pulse">
                <div className="h-6 bg-gray-200 rounded-lg w-1/2 mb-3"></div>
                <div className="h-10 bg-gray-200 rounded-xl w-1/3 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
          
          {/* Loading skeleton for content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 animate-pulse">
              <div className="h-8 bg-gray-200 rounded-lg w-1/3 mb-6"></div>
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded-xl mb-4"></div>
              ))}
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 animate-pulse">
              <div className="h-8 bg-gray-200 rounded-lg w-1/2 mb-6"></div>
              <div className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-20 bg-gray-200 rounded-xl"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10 text-red-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Erreur de chargement</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 mx-auto"
            >
              <RefreshCw className="w-5 h-5" />
              <span>Réessayer</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Enhanced Welcome Section */}
        <div className="relative overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 rounded-3xl p-8 text-white shadow-2xl">
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
            
            <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <h1 className="text-3xl lg:text-4xl font-bold">
                    Bienvenue, Administrateur
                  </h1>
                </div>
                <p className="text-purple-100 text-lg lg:text-xl max-w-2xl leading-relaxed">
                  Voici un aperçu complet de l'activité de Clicklone avec des métriques en temps réel
                </p>
              </div>
              
              <div className="mt-6 lg:mt-0 lg:text-right">
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
                  <div className="flex items-center justify-center lg:justify-end space-x-2 mb-2">
                    <Calendar className="w-5 h-5 text-purple-200" />
                    <span className="text-purple-200 text-sm font-medium">Aujourd'hui</span>
                  </div>
                  <div className="text-3xl font-bold mb-1">
                    {new Date().toLocaleDateString('fr-FR', { 
                      day: '2-digit', 
                      month: 'short' 
                    })}
                  </div>
                  <div className="text-purple-200 text-sm">
                    {new Date().toLocaleDateString('fr-FR', { 
                      weekday: 'long',
                      year: 'numeric'
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="relative">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Métriques principales</h2>
          </div>
          <DashboardStats stats={memoizedStats} />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Recent Orders - Takes 2 columns */}
          <div className="xl:col-span-2">
            <RecentOrders orders={memoizedStats.recentOrders} />
          </div>
          
          {/* Quick Actions - Takes 1 column */}
          <div className="xl:col-span-1">
            <QuickActions />
          </div>
        </div>

        {/* Bottom decorative elements */}
        <div className="relative h-20">
          <div className="absolute top-0 left-1/4 w-3 h-3 bg-purple-400 rounded-full animate-pulse" />
          <div className="absolute top-8 right-1/3 w-2 h-2 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-4 right-1/4 w-1 h-1 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
      </div>
    </div>
  );
}
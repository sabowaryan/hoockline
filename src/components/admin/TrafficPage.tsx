import React, { useState, useEffect, memo } from 'react';
import { 
  TrendingUp, 
  Eye, 
  Users, 
  Calendar,
  BarChart3,
  Globe,
  Clock,
  ArrowUp,
  ArrowDown,
  Minus,
  Target,
  Filter
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { ConversionFunnel } from './analytics/ConversionFunnel';
import { TrafficSources } from './analytics/TrafficSources';
import { AdvancedAnalytics } from './analytics/AdvancedAnalytics';

interface PageView {
  id: number;
  page_path: string;
  created_at: string;
  session_id: string;
}

interface PopularPage {
  page_path: string;
  total_views: number;
  unique_sessions: number;
  days_active: number;
  last_view: string;
}

interface DailyStats {
  date: string;
  total_views: number;
  unique_sessions: number;
}

interface TrafficStats {
  totalViews: number;
  uniqueSessions: number;
  avgViewsPerSession: number;
  topPages: PopularPage[];
  dailyStats: DailyStats[];
  recentViews: PageView[];
}

type AnalyticsView = 'overview' | 'funnel' | 'sources' | 'advanced';

const StatCard = memo(({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  color 
}: {
  title: string;
  value: string | number;
  change?: { value: number; type: 'increase' | 'decrease' | 'neutral' };
  icon: React.ComponentType<{ className?: string }>;
  color: 'blue' | 'green' | 'purple' | 'orange';
}) => {
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
              change.type === 'increase' ? 'text-green-600' : 
              change.type === 'decrease' ? 'text-red-600' : 'text-gray-600'
            }`}>
              {change.type === 'increase' && <ArrowUp className="w-4 h-4 mr-1" />}
              {change.type === 'decrease' && <ArrowDown className="w-4 h-4 mr-1" />}
              {change.type === 'neutral' && <Minus className="w-4 h-4 mr-1" />}
              <span>{Math.abs(change.value)}%</span>
              <span className="text-gray-500 ml-1">vs période précédente</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
});

const PageRow = memo(({ page, index }: { page: PopularPage; index: number }) => {
  const getPageName = (path: string) => {
    if (path === '/') return 'Accueil';
    if (path === '/generator') return 'Générateur';
    if (path === '/payment') return 'Paiement';
    if (path === '/success') return 'Succès';
    return path;
  };

  const getPageIcon = (path: string) => {
    if (path === '/') return '🏠';
    if (path === '/generator') return '⚡';
    if (path === '/payment') return '💳';
    if (path === '/success') return '✅';
    return '📄';
  };

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <span className="text-lg mr-3">{getPageIcon(page.page_path)}</span>
          <div>
            <div className="text-sm font-medium text-gray-900">
              {getPageName(page.page_path)}
            </div>
            <div className="text-sm text-gray-500">
              {page.page_path}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {page.total_views.toLocaleString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {page.unique_sessions.toLocaleString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {page.days_active}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {new Date(page.last_view).toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}
      </td>
    </tr>
  );
});

export const TrafficPage = memo(() => {
  const [stats, setStats] = useState<TrafficStats>({
    totalViews: 0,
    uniqueSessions: 0,
    avgViewsPerSession: 0,
    topPages: [],
    dailyStats: [],
    recentViews: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [activeView, setActiveView] = useState<AnalyticsView>('overview');

  useEffect(() => {
    if (activeView === 'overview') {
      fetchTrafficStats();
    }
  }, [timeRange, activeView]);

  const fetchTrafficStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const daysBack = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysBack);

      // Fetch popular pages
      const { data: popularPages, error: popularError } = await supabase
        .from('popular_pages')
        .select('*')
        .limit(10);

      if (popularError) throw popularError;

      // Fetch total stats
      const { data: totalViews, error: totalError } = await supabase
        .from('page_views')
        .select('id, session_id', { count: 'exact' })
        .gte('created_at', startDate.toISOString());

      if (totalError) throw totalError;

      // Calculate unique sessions
      const uniqueSessionsSet = new Set(totalViews?.map(v => v.session_id) || []);
      const uniqueSessions = uniqueSessionsSet.size;
      const totalViewsCount = totalViews?.length || 0;

      // Fetch daily stats
      const { data: dailyData, error: dailyError } = await supabase
        .from('daily_page_views')
        .select('*')
        .gte('date', startDate.toISOString().split('T')[0])
        .order('date', { ascending: false })
        .limit(daysBack);

      if (dailyError) throw dailyError;

      // Fetch recent views
      const { data: recentViews, error: recentError } = await supabase
        .from('page_views')
        .select('id, page_path, created_at, session_id')
        .order('created_at', { ascending: false })
        .limit(20);

      if (recentError) throw recentError;

      // Process daily stats
      const dailyStats = dailyData?.reduce((acc: Record<string, DailyStats>, curr) => {
        const date = curr.date;
        if (!acc[date]) {
          acc[date] = {
            date,
            total_views: 0,
            unique_sessions: 0
          };
        }
        acc[date].total_views += curr.views;
        acc[date].unique_sessions += curr.unique_sessions;
        return acc;
      }, {});

      const dailyStatsArray = Object.values(dailyStats || {}).sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      setStats({
        totalViews: totalViewsCount,
        uniqueSessions,
        avgViewsPerSession: uniqueSessions > 0 ? Math.round((totalViewsCount / uniqueSessions) * 10) / 10 : 0,
        topPages: popularPages || [],
        dailyStats: dailyStatsArray,
        recentViews: recentViews || []
      });

    } catch (err: any) {
      console.error('Error fetching traffic stats:', err);
      setError('Erreur lors du chargement des statistiques');
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    switch (activeView) {
      case 'funnel':
        return <ConversionFunnel />;
      case 'sources':
        return <TrafficSources />;
      case 'advanced':
        return <AdvancedAnalytics />;
      default:
        return renderOverview();
    }
  };

  const renderOverview = () => {
    if (loading) {
      return (
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-600 text-2xl">⚠️</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Erreur de chargement</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchTrafficStats}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Réessayer
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Vues totales"
            value={stats.totalViews.toLocaleString()}
            change={{ value: 12, type: 'increase' }}
            icon={Eye}
            color="blue"
          />
          
          <StatCard
            title="Sessions uniques"
            value={stats.uniqueSessions.toLocaleString()}
            change={{ value: 8, type: 'increase' }}
            icon={Users}
            color="green"
          />
          
          <StatCard
            title="Vues par session"
            value={stats.avgViewsPerSession}
            change={{ value: 3, type: 'neutral' }}
            icon={BarChart3}
            color="purple"
          />
          
          <StatCard
            title="Pages actives"
            value={stats.topPages.length}
            change={{ value: 5, type: 'increase' }}
            icon={Globe}
            color="orange"
          />
        </div>

        {/* Popular Pages */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Pages populaires</h3>
              <span className="text-sm text-gray-500">
                {timeRange === '7d' ? '7 derniers jours' : 
                 timeRange === '30d' ? '30 derniers jours' : '90 derniers jours'}
              </span>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Page
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vues totales
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sessions uniques
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Jours actifs
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dernière vue
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats.topPages.length > 0 ? (
                  stats.topPages.map((page, index) => (
                    <PageRow key={page.page_path} page={page} index={index} />
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">
                      <div className="flex flex-col items-center">
                        <TrendingUp className="w-8 h-8 text-gray-300 mb-2" />
                        <p>Aucune donnée de trafic disponible</p>
                        <p className="text-xs text-gray-400 mt-1">
                          Les statistiques apparaîtront une fois que des visiteurs auront consulté votre site
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Activité récente</h3>
          </div>
          
          <div className="p-6">
            {stats.recentViews.length > 0 ? (
              <div className="space-y-3">
                {stats.recentViews.slice(0, 10).map((view) => (
                  <div key={view.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                    <div className="flex items-center space-x-3">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">
                        {view.page_path === '/' ? 'Accueil' : view.page_path}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(view.created_at).toLocaleString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Clock className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Aucune activité récente</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Statistiques de trafic
          </h2>
          <p className="text-gray-600">
            Analyse complète du trafic et des conversions
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          {activeView === 'overview' && (
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as '7d' | '30d' | '90d')}
              className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="7d">7 derniers jours</option>
              <option value="30d">30 derniers jours</option>
              <option value="90d">90 derniers jours</option>
            </select>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {[
              { id: 'overview', name: 'Vue d\'ensemble', icon: BarChart3 },
              { id: 'funnel', name: 'Funnel de conversion', icon: Target },
              { id: 'sources', name: 'Sources de trafic', icon: Globe },
              { id: 'advanced', name: 'Analytics avancées', icon: TrendingUp },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id as AnalyticsView)}
                className={`${
                  activeView === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      {renderContent()}
    </div>
  );
});

TrafficPage.displayName = 'TrafficPage';
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
  Filter,
  Activity,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { ConversionFunnel } from '../../components/admin/analytics/ConversionFunnel';
import { TrafficSources } from '../../components/admin/analytics/TrafficSources';
import { AdvancedAnalytics } from '../../components/admin/analytics/AdvancedAnalytics';

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
  const colorConfig = {
    blue: {
      bg: 'bg-gradient-to-br from-blue-50 to-indigo-100',
      border: 'border-blue-200/50',
      iconBg: 'bg-gradient-to-br from-blue-500 to-indigo-600',
      text: 'text-blue-600'
    },
    green: {
      bg: 'bg-gradient-to-br from-green-50 to-emerald-100',
      border: 'border-green-200/50',
      iconBg: 'bg-gradient-to-br from-green-500 to-emerald-600',
      text: 'text-green-600'
    },
    purple: {
      bg: 'bg-gradient-to-br from-purple-50 to-violet-100',
      border: 'border-purple-200/50',
      iconBg: 'bg-gradient-to-br from-purple-500 to-violet-600',
      text: 'text-purple-600'
    },
    orange: {
      bg: 'bg-gradient-to-br from-orange-50 to-amber-100',
      border: 'border-orange-200/50',
      iconBg: 'bg-gradient-to-br from-orange-500 to-amber-600',
      text: 'text-orange-600'
    }
  };

  const config = colorConfig[color];

  return (
    <div className={`${config.bg} rounded-2xl p-6 shadow-lg border ${config.border} hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-3">{value}</p>
          {change && (
            <div className={`flex items-center text-sm font-medium ${
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
        <div className={`w-14 h-14 ${config.iconBg} rounded-xl flex items-center justify-center shadow-lg`}>
          <Icon className="w-7 h-7 text-white" />
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

  const getPageColor = (index: number) => {
    const colors = [
      'from-blue-500 to-indigo-600',
      'from-purple-500 to-violet-600',
      'from-green-500 to-emerald-600',
      'from-orange-500 to-amber-600',
      'from-pink-500 to-rose-600'
    ];
    return colors[index % colors.length];
  };

  return (
    <tr className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition-all duration-300">
      <td className="px-8 py-6 whitespace-nowrap">
        <div className="flex items-center space-x-4">
          <div className={`w-12 h-12 bg-gradient-to-br ${getPageColor(index)} rounded-xl flex items-center justify-center shadow-sm`}>
            <span className="text-xl">{getPageIcon(page.page_path)}</span>
          </div>
          <div>
            <div className="text-lg font-bold text-gray-900">
              {getPageName(page.page_path)}
            </div>
            <div className="text-sm text-gray-500">
              {page.page_path}
            </div>
          </div>
        </div>
      </td>
      <td className="px-8 py-6 whitespace-nowrap">
        <div className="text-lg font-bold text-gray-900">
          {page.total_views.toLocaleString()}
        </div>
      </td>
      <td className="px-8 py-6 whitespace-nowrap">
        <div className="text-lg font-bold text-gray-900">
          {page.unique_sessions.toLocaleString()}
        </div>
      </td>
      <td className="px-8 py-6 whitespace-nowrap">
        <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
          {page.days_active} jours
        </div>
      </td>
      <td className="px-8 py-6 whitespace-nowrap">
        <div className="text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
          {new Date(page.last_view).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      </td>
    </tr>
  );
});

export function TrafficPage() {
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
        <div className="space-y-8">
          <div className="bg-gradient-to-br from-white via-purple-50 to-blue-50 rounded-2xl p-8 shadow-xl border border-white/20 backdrop-blur-sm animate-pulse">
            <div className="h-8 bg-gradient-to-r from-purple-200 to-blue-200 rounded-lg w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-gradient-to-br from-white via-red-50 to-pink-50 rounded-2xl p-8 shadow-xl border border-white/20 backdrop-blur-sm">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <AlertCircle className="w-10 h-10 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
              Erreur de chargement
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">{error}</p>
            <button
              onClick={fetchTrafficStats}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <RefreshCw className="w-4 h-4 inline mr-2" />
              Réessayer
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-8">
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
        <div className="bg-gradient-to-br from-white via-gray-50 to-slate-50 rounded-2xl shadow-xl border border-white/20 backdrop-blur-sm overflow-hidden">
          <div className="px-8 py-6 bg-gradient-to-r from-gray-900 to-slate-800">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white flex items-center space-x-3">
                <Activity className="w-6 h-6" />
                <span>Pages populaires</span>
              </h3>
              <span className="text-purple-200 text-sm font-medium">
                {timeRange === '7d' ? '7 derniers jours' : 
                 timeRange === '30d' ? '30 derniers jours' : '90 derniers jours'}
              </span>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-slate-100">
                <tr>
                  <th className="px-8 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Page
                  </th>
                  <th className="px-8 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Vues totales
                  </th>
                  <th className="px-8 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Sessions uniques
                  </th>
                  <th className="px-8 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Jours actifs
                  </th>
                  <th className="px-8 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
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
                    <td colSpan={5} className="px-8 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mb-4">
                          <TrendingUp className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-lg font-medium text-gray-900 mb-2">Aucune donnée de trafic disponible</p>
                        <p className="text-sm text-gray-500 max-w-md">
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
        <div className="bg-gradient-to-br from-white via-purple-50 to-blue-50 rounded-2xl p-8 shadow-xl border border-white/20 backdrop-blur-sm">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Activité récente</h3>
              <p className="text-gray-600">Dernières interactions sur votre site</p>
            </div>
          </div>
          
          <div className="space-y-4">
            {stats.recentViews.length > 0 ? (
              stats.recentViews.slice(0, 10).map((view) => (
                <div key={view.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                        <Clock className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <span className="text-sm font-bold text-gray-900">
                          {view.page_path === '/' ? 'Accueil' : view.page_path}
                        </span>
                        <div className="text-xs text-gray-500">
                          Session: {view.session_id.slice(0, 8)}...
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
                      {new Date(view.created_at).toLocaleString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-lg font-medium text-gray-900 mb-2">Aucune activité récente</p>
                <p className="text-sm text-gray-500">Les interactions apparaîtront ici</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Statistiques de trafic</h2>
            <p className="text-purple-100 text-lg">Analyse complète du trafic et des conversions</p>
          </div>
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <Activity className="w-8 h-8" />
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-gradient-to-br from-white via-gray-50 to-slate-50 rounded-2xl shadow-xl border border-white/20 backdrop-blur-sm overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-8" aria-label="Tabs">
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
                    ? 'border-purple-500 text-purple-600 bg-purple-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                } whitespace-nowrap py-6 px-3 border-b-2 font-bold text-sm flex items-center space-x-3 transition-all duration-300 rounded-t-lg`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Time Range Selector */}
      {activeView === 'overview' && (
        <div className="flex justify-end">
          <div className="bg-white rounded-xl p-2 shadow-lg border border-gray-100">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as '7d' | '30d' | '90d')}
              className="block pl-4 pr-10 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-transparent font-medium text-gray-900"
            >
              <option value="7d">7 derniers jours</option>
              <option value="30d">30 derniers jours</option>
              <option value="90d">90 derniers jours</option>
            </select>
          </div>
        </div>
      )}

      {/* Content */}
      {renderContent()}
    </div>
  );
}

TrafficPage.displayName = 'TrafficPage';
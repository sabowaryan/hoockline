import React, { useState, useEffect, memo } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Clock, 
  Target,
  Calendar,
  Filter,
  Download,
  Sparkles,
  Activity,
  Zap
} from 'lucide-react';
import { supabase } from '../../../lib/supabase';

import { AreaChart } from '../../admin/charts/AreaChart';
import { BarChart } from '../../admin/charts/BarChart';

interface AnalyticsData {
  dailyStats: any[];
  timeSpentData: any[];
  conversionTrends: any[];
  userBehavior: any[];
}

export const AdvancedAnalytics = memo(() => {
  const [data, setData] = useState<AnalyticsData>({
    dailyStats: [],
    timeSpentData: [],
    conversionTrends: [],
    userBehavior: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);

      const daysBack = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysBack);

      // Fetch daily page views
      const { data: dailyData, error: dailyError } = await supabase
        .from('daily_page_views')
        .select('*')
        .gte('date', startDate.toISOString().split('T')[0])
        .order('date', { ascending: true });

      if (dailyError) throw dailyError;

      // Fetch time spent data
      const { data: timeData, error: timeError } = await supabase
        .from('page_time_tracking')
        .select('*')
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true });

      if (timeError) throw timeError;

      // Fetch conversion events for trends
      const { data: conversionData, error: conversionError } = await supabase
        .from('conversion_events')
        .select('*')
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true });

      if (conversionError) throw conversionError;

      setData({
        dailyStats: dailyData || [],
        timeSpentData: timeData || [],
        conversionTrends: conversionData || [],
        userBehavior: []
      });

    } catch (err: any) {
      console.error('Error fetching analytics data:', err);
      setError('Erreur lors du chargement des analytics avancées');
    } finally {
      setLoading(false);
    }
  };

  // Process data for charts
  const processedDailyData = () => {
    const groupedByDate = data.dailyStats.reduce((acc: any, curr: any) => {
      const date = curr.date;
      if (!acc[date]) {
        acc[date] = { date, views: 0, unique_sessions: 0 };
      }
      acc[date].views += curr.views;
      acc[date].unique_sessions += curr.unique_sessions;
      return acc;
    }, {});

    const sortedData = Object.values(groupedByDate).sort((a: any, b: any) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    return {
      labels: sortedData.map((item: any) => 
        new Date(item.date).toLocaleDateString('fr-FR', { 
          month: 'short', 
          day: 'numeric' 
        })
      ),
      datasets: [
        {
          label: 'Vues de pages',
          data: sortedData.map((item: any) => item.views),
          borderColor: 'rgb(147, 51, 234)',
          backgroundColor: 'rgba(147, 51, 234, 0.1)',
          fill: true,
          tension: 0.4,
        },
        {
          label: 'Sessions uniques',
          data: sortedData.map((item: any) => item.unique_sessions),
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
          tension: 0.4,
        },
      ],
    };
  };

  const processedTimeData = () => {
    const avgTimeByPage = data.timeSpentData.reduce((acc: any, curr: any) => {
      if (!acc[curr.page_path]) {
        acc[curr.page_path] = { total: 0, count: 0 };
      }
      acc[curr.page_path].total += curr.time_spent_seconds;
      acc[curr.page_path].count += 1;
      return acc;
    }, {});

    const processedData = Object.entries(avgTimeByPage)
      .map(([page, data]: [string, any]) => ({
        page: page === '/' ? 'Accueil' : page.replace('/', ''),
        avgTime: Math.round(data.total / data.count)
      }))
      .sort((a, b) => b.avgTime - a.avgTime)
      .slice(0, 8);

    return {
      labels: processedData.map(item => item.page),
      datasets: [
        {
          label: 'Temps moyen (secondes)',
          data: processedData.map(item => item.avgTime),
          backgroundColor: [
            'rgba(34, 197, 94, 0.8)',
            'rgba(59, 130, 246, 0.8)',
            'rgba(147, 51, 234, 0.8)',
            'rgba(249, 115, 22, 0.8)',
            'rgba(239, 68, 68, 0.8)',
            'rgba(107, 114, 128, 0.8)',
            'rgba(236, 72, 153, 0.8)',
            'rgba(20, 184, 166, 0.8)',
          ],
          borderColor: [
            'rgb(34, 197, 94)',
            'rgb(59, 130, 246)',
            'rgb(147, 51, 234)',
            'rgb(249, 115, 22)',
            'rgb(239, 68, 68)',
            'rgb(107, 114, 128)',
            'rgb(236, 72, 153)',
            'rgb(20, 184, 166)',
          ],
          borderWidth: 2,
        },
      ],
    };
  };

  const exportData = () => {
    const csvContent = [
      ['Date', 'Vues', 'Sessions uniques'],
      ...data.dailyStats.map(item => [
        item.date,
        item.views,
        item.unique_sessions
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${timeRange}-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Loading skeleton for header */}
          <div className="bg-gradient-to-r from-gray-200 to-gray-300 rounded-3xl p-8 animate-pulse">
            <div className="h-10 bg-gray-300 rounded-xl w-1/3 mb-4"></div>
            <div className="h-6 bg-gray-300 rounded-lg w-1/2"></div>
          </div>
          
          {/* Loading skeleton for KPI cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 animate-pulse">
                <div className="h-6 bg-gray-200 rounded-lg w-1/2 mb-3"></div>
                <div className="h-10 bg-gray-200 rounded-xl w-1/3 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
          
          {/* Loading skeleton for charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 animate-pulse">
              <div className="h-8 bg-gray-200 rounded-lg w-1/3 mb-6"></div>
              <div className="h-64 bg-gray-200 rounded-xl"></div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 animate-pulse">
              <div className="h-8 bg-gray-200 rounded-lg w-1/2 mb-6"></div>
              <div className="h-64 bg-gray-200 rounded-xl"></div>
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
              <BarChart3 className="w-10 h-10 text-red-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Erreur de chargement</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">{error}</p>
            <button
              onClick={fetchAnalyticsData}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 mx-auto"
            >
              <Activity className="w-5 h-5" />
              <span>Réessayer</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const totalViews = data.dailyStats.reduce((sum, item) => sum + item.views, 0);
  const totalSessions = data.dailyStats.reduce((sum, item) => sum + item.unique_sessions, 0);
  const avgTimeSpent = data.timeSpentData.length > 0 ? 
    Math.round(data.timeSpentData.reduce((sum, item) => sum + item.time_spent_seconds, 0) / data.timeSpentData.length) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Enhanced Header with controls */}
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
                  <h2 className="text-3xl lg:text-4xl font-bold">
                    Analytics avancées
                  </h2>
                </div>
                <p className="text-purple-100 text-lg lg:text-xl max-w-2xl leading-relaxed">
                  Analyse détaillée des performances et du comportement utilisateur en temps réel
                </p>
              </div>
              
              <div className="mt-6 lg:mt-0 flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-3">
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value as '7d' | '30d' | '90d')}
                  className="bg-white/20 backdrop-blur-sm text-white border border-white/30 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                >
                  <option value="7d">7 derniers jours</option>
                  <option value="30d">30 derniers jours</option>
                  <option value="90d">90 derniers jours</option>
                </select>
                <button
                  onClick={exportData}
                  className="bg-white/20 backdrop-blur-sm text-white border border-white/30 px-4 py-2 rounded-xl hover:bg-white/30 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Exporter</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="group relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Vues totales</p>
                <p className="text-2xl font-bold text-gray-900">{totalViews.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-green-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Sessions uniques</p>
                <p className="text-2xl font-bold text-gray-900">{totalSessions.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Temps moyen</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.floor(avgTimeSpent / 60)}m {avgTimeSpent % 60}s
                </p>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-orange-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Taux d'engagement</p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalSessions > 0 ? ((totalViews / totalSessions).toFixed(1)) : '0'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Évolution du trafic</h3>
            </div>
            <AreaChart 
              data={processedDailyData()}
              height={300}
            />
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Temps passé par page</h3>
            </div>
            <BarChart 
              data={processedTimeData()}
              height={300}
              horizontal={true}
            />
          </div>
        </div>

        {/* Enhanced Detailed insights */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Insights et recommandations</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="group relative overflow-hidden p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-16 h-16 bg-blue-200/50 rounded-full -translate-y-8 translate-x-8"></div>
              <div className="relative flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <h4 className="font-semibold text-blue-900">Performance</h4>
              </div>
              <p className="text-sm text-blue-700 leading-relaxed">
                {totalViews > 1000 ? 
                  'Excellent trafic ! Continuez sur cette lancée.' :
                  'Le trafic peut être amélioré. Considérez plus de marketing.'}
              </p>
            </div>

            <div className="group relative overflow-hidden p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border border-green-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-16 h-16 bg-green-200/50 rounded-full -translate-y-8 translate-x-8"></div>
              <div className="relative flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <h4 className="font-semibold text-green-900">Engagement</h4>
              </div>
              <p className="text-sm text-green-700 leading-relaxed">
                {avgTimeSpent > 120 ? 
                  'Bon engagement utilisateur. Le contenu intéresse.' :
                  'L\'engagement peut être amélioré. Optimisez le contenu.'}
              </p>
            </div>

            <div className="group relative overflow-hidden p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl border border-purple-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-16 h-16 bg-purple-200/50 rounded-full -translate-y-8 translate-x-8"></div>
              <div className="relative flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                  <Target className="w-4 h-4 text-white" />
                </div>
                <h4 className="font-semibold text-purple-900">Conversion</h4>
              </div>
              <p className="text-sm text-purple-700 leading-relaxed">
                Analysez le funnel de conversion pour identifier les points d'amélioration.
              </p>
            </div>
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
});

AdvancedAnalytics.displayName = 'AdvancedAnalytics';
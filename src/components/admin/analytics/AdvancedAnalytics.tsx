import React, { useState, useEffect, memo } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Clock, 
  Target,
  Calendar,
  Filter,
  Download
} from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { LineChart } from '../charts/LineChart';
import { AreaChart } from '../charts/AreaChart';
import { BarChart } from '../charts/BarChart';

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
      <div className="space-y-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Erreur de chargement</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchAnalyticsData}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  const totalViews = data.dailyStats.reduce((sum, item) => sum + item.views, 0);
  const totalSessions = data.dailyStats.reduce((sum, item) => sum + item.unique_sessions, 0);
  const avgTimeSpent = data.timeSpentData.length > 0 ? 
    Math.round(data.timeSpentData.reduce((sum, item) => sum + item.time_spent_seconds, 0) / data.timeSpentData.length) : 0;

  return (
    <div className="space-y-6">
      {/* Header with controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Analytics avancées
          </h2>
          <p className="text-gray-600">
            Analyse détaillée des performances et du comportement utilisateur
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as '7d' | '30d' | '90d')}
            className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="7d">7 derniers jours</option>
            <option value="30d">30 derniers jours</option>
            <option value="90d">90 derniers jours</option>
          </select>
          <button
            onClick={exportData}
            className="inline-flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Exporter</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Vues totales</p>
              <p className="text-2xl font-bold text-gray-900">{totalViews.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Sessions uniques</p>
              <p className="text-2xl font-bold text-gray-900">{totalSessions.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Temps moyen</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.floor(avgTimeSpent / 60)}m {avgTimeSpent % 60}s
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Taux d'engagement</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalSessions > 0 ? ((totalViews / totalSessions).toFixed(1)) : '0'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Évolution du trafic</h3>
          <AreaChart 
            data={processedDailyData()}
            height={300}
          />
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Temps passé par page</h3>
          <BarChart 
            data={processedTimeData()}
            height={300}
            horizontal={true}
          />
        </div>
      </div>

      {/* Detailed insights */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Insights et recommandations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <h4 className="font-medium text-blue-900">Performance</h4>
            </div>
            <p className="text-sm text-blue-700">
              {totalViews > 1000 ? 
                'Excellent trafic ! Continuez sur cette lancée.' :
                'Le trafic peut être amélioré. Considérez plus de marketing.'}
            </p>
          </div>

          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="w-5 h-5 text-green-600" />
              <h4 className="font-medium text-green-900">Engagement</h4>
            </div>
            <p className="text-sm text-green-700">
              {avgTimeSpent > 120 ? 
                'Bon engagement utilisateur. Le contenu intéresse.' :
                'L\'engagement peut être amélioré. Optimisez le contenu.'}
            </p>
          </div>

          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="w-5 h-5 text-purple-600" />
              <h4 className="font-medium text-purple-900">Conversion</h4>
            </div>
            <p className="text-sm text-purple-700">
              Analysez le funnel de conversion pour identifier les points d'amélioration.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});

AdvancedAnalytics.displayName = 'AdvancedAnalytics';
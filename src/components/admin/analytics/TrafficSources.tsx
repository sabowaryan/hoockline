import React, { useState, useEffect, memo } from 'react';
import { Globe, ExternalLink, TrendingUp, Users, Calendar, BarChart3, PieChart, RefreshCw, AlertCircle } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { DoughnutChart } from '../../admin/charts/DoughnutChart';
import { BarChart } from '../../admin/charts/BarChart';

interface TrafficSource {
  source: string;
  total_visits: number;
  unique_sessions: number;
  active_days: number;
  last_visit: string;
}

export const TrafficSources = memo(() => {
  const [sources, setSources] = useState<TrafficSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTrafficSources();
  }, []);

  const fetchTrafficSources = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: sourcesError } = await supabase
        .from('traffic_sources')
        .select('*');

      if (sourcesError) throw sourcesError;

      setSources(data || []);
    } catch (err: any) {
      console.error('Error fetching traffic sources:', err);
      setError('Erreur lors du chargement des sources de trafic');
    } finally {
      setLoading(false);
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source.toLowerCase()) {
      case 'google':
        return '🔍';
      case 'facebook':
        return '📘';
      case 'twitter':
        return '🐦';
      case 'linkedin':
        return '💼';
      case 'direct':
        return '🔗';
      case 'referral':
        return '🌐';
      default:
        return '📊';
    }
  };

  const getSourceColor = (index: number) => {
    const colors = [
      '#3B82F6', // Blue
      '#8B5CF6', // Purple
      '#10B981', // Green
      '#F59E0B', // Yellow
      '#EF4444', // Red
      '#6B7280', // Gray
      '#EC4899', // Pink
      '#14B8A6', // Teal
    ];
    return colors[index % colors.length];
  };

  // Prepare chart data
  const doughnutData = {
    labels: sources.map(source => source.source),
    datasets: [
      {
        data: sources.map(source => source.total_visits),
        backgroundColor: sources.map((_, index) => getSourceColor(index)),
        borderColor: sources.map((_, index) => getSourceColor(index)),
        borderWidth: 2,
      },
    ],
  };

  const barData = {
    labels: sources.slice(0, 8).map(source => source.source),
    datasets: [
      {
        label: 'Visites totales',
        data: sources.slice(0, 8).map(source => source.total_visits),
        backgroundColor: sources.slice(0, 8).map((_, index) => `${getSourceColor(index)}80`),
        borderColor: sources.slice(0, 8).map((_, index) => getSourceColor(index)),
        borderWidth: 2,
      },
    ],
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-white via-purple-50 to-blue-50 rounded-2xl p-8 shadow-xl border border-white/20 backdrop-blur-sm animate-pulse">
          <div className="h-8 bg-gradient-to-r from-purple-200 to-blue-200 rounded-lg w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="h-80 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl"></div>
            <div className="h-80 bg-gradient-to-br from-green-100 to-teal-100 rounded-xl"></div>
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
            onClick={fetchTrafficSources}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <RefreshCw className="w-4 h-4 inline mr-2" />
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  const totalVisits = sources.reduce((sum, source) => sum + source.total_visits, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Sources de Trafic</h2>
            <p className="text-purple-100 text-lg">Analyse détaillée de vos sources de trafic</p>
          </div>
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <Globe className="w-8 h-8" />
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-600">Sources totales</p>
              <p className="text-3xl font-bold text-gray-900">{sources.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-6 shadow-lg border border-green-200/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-green-600">Visites totales</p>
              <p className="text-3xl font-bold text-gray-900">{totalVisits.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-violet-100 rounded-2xl p-6 shadow-lg border border-purple-200/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-purple-600">Sessions uniques</p>
              <p className="text-3xl font-bold text-gray-900">
                {sources.reduce((sum, source) => sum + source.unique_sessions, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-amber-100 rounded-2xl p-6 shadow-lg border border-orange-200/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-orange-600">Source principale</p>
              <p className="text-3xl font-bold text-gray-900 capitalize">
                {sources[0]?.source || 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-white via-purple-50 to-blue-50 rounded-2xl p-8 shadow-xl border border-white/20 backdrop-blur-sm">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
              <PieChart className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Répartition du trafic</h3>
          </div>
          <DoughnutChart 
            data={doughnutData}
            height={300}
            showLegend={true}
          />
        </div>

        <div className="bg-gradient-to-br from-white via-green-50 to-teal-50 rounded-2xl p-8 shadow-xl border border-white/20 backdrop-blur-sm">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Top 8 des sources</h3>
          </div>
          <BarChart 
            data={barData}
            height={300}
            horizontal={true}
          />
        </div>
      </div>

      {/* Detailed Table */}
      <div className="bg-gradient-to-br from-white via-gray-50 to-slate-50 rounded-2xl shadow-xl border border-white/20 backdrop-blur-sm overflow-hidden">
        <div className="px-8 py-6 bg-gradient-to-r from-gray-900 to-slate-800">
          <h3 className="text-xl font-bold text-white flex items-center space-x-3">
            <Globe className="w-6 h-6" />
            <span>Détail des sources de trafic</span>
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-slate-100">
              <tr>
                <th className="px-8 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Source
                </th>
                <th className="px-8 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Visites totales
                </th>
                <th className="px-8 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Sessions uniques
                </th>
                <th className="px-8 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Jours actifs
                </th>
                <th className="px-8 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  % du trafic
                </th>
                <th className="px-8 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Dernière visite
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sources.map((source, index) => (
                <tr key={source.source} className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition-all duration-300">
                  <td className="px-8 py-6 whitespace-nowrap">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center shadow-sm">
                        <span className="text-2xl">{getSourceIcon(source.source)}</span>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-gray-900 capitalize">
                          {source.source}
                        </div>
                        <div className="text-sm text-gray-500">
                          {source.source === 'direct' ? 'Trafic direct' : 
                           source.source === 'referral' ? 'Sites référents' : 
                           `Trafic ${source.source}`}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap">
                    <div className="text-lg font-bold text-gray-900">
                      {source.total_visits.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap">
                    <div className="text-lg font-bold text-gray-900">
                      {source.unique_sessions.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap">
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {source.active_days} jours
                    </div>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className="flex-1 bg-gray-200 rounded-full h-3 max-w-24 shadow-inner">
                        <div 
                          className="h-3 rounded-full transition-all duration-500 shadow-sm"
                          style={{ 
                            width: `${(source.total_visits / totalVisits) * 100}%`,
                            background: `linear-gradient(90deg, ${getSourceColor(index)}, ${getSourceColor(index)}80)`
                          }}
                        ></div>
                      </div>
                      <span className="text-lg font-bold text-gray-900 min-w-[3rem]">
                        {((source.total_visits / totalVisits) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap">
                    <div className="text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
                      {new Date(source.last_visit).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
});

TrafficSources.displayName = 'TrafficSources';
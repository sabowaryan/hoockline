import React, { useState, useEffect, memo } from 'react';
import { Globe, ExternalLink, TrendingUp, Users, Calendar } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { DoughnutChart } from '../charts/DoughnutChart';
import { BarChart } from '../charts/BarChart';

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
            <Globe className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Erreur de chargement</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchTrafficSources}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  const totalVisits = sources.reduce((sum, source) => sum + source.total_visits, 0);

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Globe className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Sources totales</p>
              <p className="text-2xl font-bold text-gray-900">{sources.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Visites totales</p>
              <p className="text-2xl font-bold text-gray-900">{totalVisits.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Sessions uniques</p>
              <p className="text-2xl font-bold text-gray-900">
                {sources.reduce((sum, source) => sum + source.unique_sessions, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Source principale</p>
              <p className="text-2xl font-bold text-gray-900 capitalize">
                {sources[0]?.source || 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition du trafic</h3>
          <DoughnutChart 
            data={doughnutData}
            height={300}
            showLegend={true}
          />
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top 8 des sources</h3>
          <BarChart 
            data={barData}
            height={300}
            horizontal={true}
          />
        </div>
      </div>

      {/* Detailed Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Détail des sources de trafic</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Source
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Visites totales
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sessions uniques
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jours actifs
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  % du trafic
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dernière visite
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sources.map((source, index) => (
                <tr key={source.source} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{getSourceIcon(source.source)}</span>
                      <div>
                        <div className="text-sm font-medium text-gray-900 capitalize">
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {source.total_visits.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {source.unique_sessions.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {source.active_days}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-20">
                        <div 
                          className="h-2 rounded-full transition-all duration-500"
                          style={{ 
                            width: `${(source.total_visits / totalVisits) * 100}%`,
                            backgroundColor: getSourceColor(index)
                          }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {((source.total_visits / totalVisits) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(source.last_visit).toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
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
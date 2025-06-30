import React, { useState, useEffect, memo } from 'react';
import { TrendingDown, TrendingUp, Users, CreditCard, Zap, Home } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { BarChart } from '../charts/BarChart';

interface FunnelStep {
  step: string;
  count: number;
  conversion_rate: number;
}

export const ConversionFunnel = memo(() => {
  const [funnelData, setFunnelData] = useState<FunnelStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFunnelData();
  }, []);

  const fetchFunnelData = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: funnelError } = await supabase
        .from('conversion_funnel')
        .select('*');

      if (funnelError) throw funnelError;

      setFunnelData(data || []);
    } catch (err: any) {
      console.error('Error fetching funnel data:', err);
      setError('Erreur lors du chargement du funnel de conversion');
    } finally {
      setLoading(false);
    }
  };

  const getStepIcon = (step: string) => {
    if (step.includes('Visiteurs')) return Home;
    if (step.includes('Générateur')) return Zap;
    if (step.includes('Paiement démarré')) return CreditCard;
    if (step.includes('Paiement complété')) return TrendingUp;
    return Users;
  };

  const getStepColor = (index: number) => {
    const colors = [
      'bg-blue-500',
      'bg-purple-500', 
      'bg-orange-500',
      'bg-green-500'
    ];
    return colors[index] || 'bg-gray-500';
  };

  const chartData = {
    labels: funnelData.map(step => step.step),
    datasets: [
      {
        label: 'Nombre d\'utilisateurs',
        data: funnelData.map(step => step.count),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(147, 51, 234, 0.8)',
          'rgba(249, 115, 22, 0.8)',
          'rgba(34, 197, 94, 0.8)',
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(147, 51, 234)',
          'rgb(249, 115, 22)',
          'rgb(34, 197, 94)',
        ],
        borderWidth: 2,
      },
    ],
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingDown className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Erreur de chargement</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchFunnelData}
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
      {/* Funnel Steps */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Funnel de conversion</h3>
            <p className="text-gray-600 text-sm">Parcours utilisateur des 30 derniers jours</p>
          </div>
        </div>

        <div className="space-y-4">
          {funnelData.map((step, index) => {
            const Icon = getStepIcon(step.step);
            const isLast = index === funnelData.length - 1;
            const dropoffRate = index > 0 ? 
              ((funnelData[index - 1].count - step.count) / funnelData[index - 1].count * 100) : 0;

            return (
              <div key={step.step} className="relative">
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className={`w-12 h-12 ${getStepColor(index)} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">{step.step}</h4>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">
                          {step.count.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          {step.conversion_rate.toFixed(1)}% du total
                        </div>
                      </div>
                    </div>
                    
                    {index > 0 && (
                      <div className="mt-2 flex items-center space-x-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${step.conversion_rate}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-red-600 font-medium">
                          -{dropoffRate.toFixed(1)}% abandon
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                {!isLast && (
                  <div className="flex justify-center my-2">
                    <TrendingDown className="w-5 h-5 text-gray-400" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Chart Visualization */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Visualisation du funnel</h4>
        <BarChart 
          data={chartData}
          height={300}
          title="Nombre d'utilisateurs par étape"
        />
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Taux de conversion global</p>
              <p className="text-2xl font-bold text-gray-900">
                {funnelData.length > 0 && funnelData[funnelData.length - 1] ? 
                  `${funnelData[funnelData.length - 1].conversion_rate.toFixed(2)}%` : '0%'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Visiteurs → Générateur</p>
              <p className="text-2xl font-bold text-gray-900">
                {funnelData.length > 1 ? 
                  `${((funnelData[1]?.count || 0) / (funnelData[0]?.count || 1) * 100).toFixed(1)}%` : '0%'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Générateur → Paiement</p>
              <p className="text-2xl font-bold text-gray-900">
                {funnelData.length > 2 ? 
                  `${((funnelData[3]?.count || 0) / (funnelData[1]?.count || 1) * 100).toFixed(1)}%` : '0%'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

ConversionFunnel.displayName = 'ConversionFunnel';
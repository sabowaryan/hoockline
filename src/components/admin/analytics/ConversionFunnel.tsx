import React, { useState, useEffect, memo } from 'react';
import { TrendingDown, TrendingUp, Users, CreditCard, Zap, Home, Funnel, RefreshCw, AlertCircle, ArrowDown, Target } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { BarChart } from '../../admin/charts/BarChart';  

interface FunnelStep {
  step: string;
  count: number;
  conversion_rate: number | null;
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

      // Ensure conversion_rate is never null
      const processedData = (data || []).map(step => ({
        ...step,
        conversion_rate: step.conversion_rate ?? 0
      }));

      setFunnelData(processedData);
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
      'from-blue-500 to-indigo-600',
      'from-purple-500 to-violet-600', 
      'from-orange-500 to-amber-600',
      'from-green-500 to-emerald-600'
    ];
    return colors[index] || 'from-gray-500 to-gray-600';
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
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-white via-purple-50 to-blue-50 rounded-2xl p-8 shadow-xl border border-white/20 backdrop-blur-sm animate-pulse">
          <div className="h-8 bg-gradient-to-r from-purple-200 to-blue-200 rounded-lg w-1/3 mb-6"></div>
          <div className="space-y-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl"></div>
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
            onClick={fetchFunnelData}
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
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Funnel de Conversion</h2>
            <p className="text-purple-100 text-lg">Analyse du parcours utilisateur et des taux de conversion</p>
          </div>
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <Funnel className="w-8 h-8" />
          </div>
        </div>
      </div>

      {/* Funnel Steps */}
      <div className="bg-gradient-to-br from-white via-purple-50 to-blue-50 rounded-2xl p-8 shadow-xl border border-white/20 backdrop-blur-sm">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Parcours de conversion</h3>
            <p className="text-gray-600">Analyse des 30 derniers jours</p>
          </div>
        </div>

        <div className="space-y-6">
          {funnelData.map((step, index) => {
            const Icon = getStepIcon(step.step);
            const isLast = index === funnelData.length - 1;
            const dropoffRate = index > 0 ? 
              ((funnelData[index - 1].count - step.count) / funnelData[index - 1].count * 100) : 0;

            // Safe conversion rate handling
            const conversionRate = step.conversion_rate ?? 0;

            return (
              <div key={step.step} className="relative">
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex items-center space-x-6">
                    <div className={`w-16 h-16 bg-gradient-to-br ${getStepColor(index)} rounded-2xl flex items-center justify-center shadow-lg`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-xl font-bold text-gray-900">{step.step}</h4>
                        <div className="text-right">
                          <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                            {step.count.toLocaleString()}
                          </div>
                          <div className="text-sm font-medium text-gray-500">
                            {conversionRate.toFixed(1)}% du total
                          </div>
                        </div>
                      </div>
                      
                      {index > 0 && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Taux de conversion</span>
                            <span className="font-bold text-gray-900">{Math.max(0, Math.min(100, conversionRate)).toFixed(1)}%</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="flex-1 bg-gray-200 rounded-full h-3 shadow-inner">
                              <div 
                                className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500 shadow-sm"
                                style={{ width: `${Math.max(0, Math.min(100, conversionRate))}%` }}
                              ></div>
                            </div>
                            <div className="flex items-center space-x-1 text-red-600 font-medium">
                              <ArrowDown className="w-4 h-4" />
                              <span className="text-sm">{Math.max(0, dropoffRate).toFixed(1)}%</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {!isLast && (
                  <div className="flex justify-center my-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center shadow-lg">
                      <TrendingDown className="w-4 h-4 text-white" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Chart Visualization */}
      <div className="bg-gradient-to-br from-white via-green-50 to-teal-50 rounded-2xl p-8 shadow-xl border border-white/20 backdrop-blur-sm">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center">
            <BarChart className="w-5 h-5 text-white" />
          </div>
          <h4 className="text-xl font-bold text-gray-900">Visualisation du funnel</h4>
        </div>
        <BarChart 
          data={chartData}
          height={300}
          title="Nombre d'utilisateurs par étape"
        />
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-600">Taux de conversion global</p>
              <p className="text-3xl font-bold text-gray-900">
                {funnelData.length > 0 && funnelData[funnelData.length - 1] ? 
                  `${(funnelData[funnelData.length - 1].conversion_rate ?? 0).toFixed(2)}%` : '0%'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-violet-100 rounded-2xl p-6 shadow-lg border border-purple-200/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-purple-600">Visiteurs → Générateur</p>
              <p className="text-3xl font-bold text-gray-900">
                {funnelData.length > 1 ? 
                  `${(((funnelData[1]?.count || 0) / Math.max(1, funnelData[0]?.count || 1)) * 100).toFixed(1)}%` : '0%'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-6 shadow-lg border border-green-200/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-green-600">Générateur → Paiement</p>
              <p className="text-3xl font-bold text-gray-900">
                {funnelData.length > 2 ? 
                  `${(((funnelData[3]?.count || 0) / Math.max(1, funnelData[1]?.count || 1)) * 100).toFixed(1)}%` : '0%'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

ConversionFunnel.displayName = 'ConversionFunnel';
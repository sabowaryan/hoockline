import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Eye,
  Target,
  Activity
} from 'lucide-react';
import { AdvancedAnalytics } from '../../components/admin/analytics/AdvancedAnalytics';
import { TrafficSources } from '../../components/admin/analytics/TrafficSources';
import { ConversionFunnel } from '../../components/admin/analytics/ConversionFunnel';

interface TabItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  content: React.ReactNode;
}

export function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs: TabItem[] = [
    {
      id: 'overview',
      label: 'Vue d\'ensemble',
      icon: BarChart3,
      content: (
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Métriques principales</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Visiteurs</p>
                    <p className="text-2xl font-bold text-blue-900">12,847</p>
                    <p className="text-xs text-blue-700">+12% vs mois dernier</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Pages vues</p>
                    <p className="text-2xl font-bold text-green-900">45,123</p>
                    <p className="text-xs text-green-700">+8% vs mois dernier</p>
                  </div>
                  <Eye className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600">Taux de conversion</p>
                    <p className="text-2xl font-bold text-purple-900">3.2%</p>
                    <p className="text-xs text-purple-700">+0.5% vs mois dernier</p>
                  </div>
                  <Target className="w-8 h-8 text-purple-600" />
                </div>
              </div>
            </div>
          </div>
          
          <AdvancedAnalytics />
        </div>
      )
    },
    {
      id: 'traffic',
      label: 'Sources de trafic',
      icon: TrendingUp,
      content: (
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Analyse des sources de trafic</h3>
            <TrafficSources />
          </div>
        </div>
      )
    },
    {
      id: 'conversions',
      label: 'Conversions',
      icon: Target,
      content: (
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Entonnoir de conversion</h3>
            <ConversionFunnel />
          </div>
        </div>
      )
    },
    {
      id: 'performance',
      label: 'Performance',
      icon: Activity,
      content: (
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Métriques de performance</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Temps de chargement</h4>
                  <p className="text-2xl font-bold text-green-600">1.2s</p>
                  <p className="text-sm text-gray-500">Moyenne mobile</p>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Temps sur page</h4>
                  <p className="text-2xl font-bold text-blue-600">2m 34s</p>
                  <p className="text-sm text-gray-500">Moyenne globale</p>
                </div>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Taux de rebond</h4>
                <p className="text-2xl font-bold text-orange-600">42%</p>
                <p className="text-sm text-gray-500">-5% vs mois dernier</p>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Tabs Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {tabs.find(tab => tab.id === activeTab)?.content}
        </div>
      </div>
    </div>
  );
}

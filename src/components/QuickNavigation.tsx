import React, { useState, useEffect } from 'react';
import { Home, Wand2, CreditCard, CheckCircle, ArrowRight, Lock } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { isPaymentRequired, areFreeTrialsAllowed, getTrialLimit } from '../services/settings';
import { useTranslation } from 'react-i18next';

interface QuickNavItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  color: string;
  requiresPayment?: boolean;
  requiresGeneration?: boolean;
  disabled?: boolean;
  disabledReason?: string;
}

export function QuickNavigation() {
  const location = useLocation();
  const { state } = useApp();
  const currentPath = location.pathname;
  const [paymentSettings, setPaymentSettings] = useState({
    paymentRequired: true,
    freeTrialsAllowed: false,
    trialLimit: 1
  });
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    loadPaymentSettings();
  }, []);

  const loadPaymentSettings = async () => {
    try {
      const [paymentRequired, freeTrialsAllowed, trialLimit] = await Promise.all([
        isPaymentRequired(),
        areFreeTrialsAllowed(),
        getTrialLimit()
      ]);
      
      setPaymentSettings({
        paymentRequired,
        freeTrialsAllowed,
        trialLimit
      });
    } catch (error) {
      console.error('Error loading payment settings:', error);
    } finally {
      setLoading(false);
    }
  };

  // Vérifier si l'utilisateur peut accéder aux résultats
  const canAccessResults = () => {
    if (!paymentSettings.paymentRequired) return true;
    
    const hasPaid = localStorage.getItem('payment_completed') === 'true';
    if (hasPaid) return true;
    
    if (paymentSettings.freeTrialsAllowed) {
      const trialCount = parseInt(localStorage.getItem('trial_count') || '0');
      return trialCount > 0;
    }
    
    return false;
  };

  // Vérifier si l'utilisateur peut accéder au paiement
  const canAccessPayment = () => {
    if (!paymentSettings.paymentRequired) return false;
    
    const hasPaid = localStorage.getItem('payment_completed') === 'true';
    if (hasPaid) return false;
    
    if (paymentSettings.freeTrialsAllowed) {
      const trialCount = parseInt(localStorage.getItem('trial_count') || '0');
      return trialCount >= paymentSettings.trialLimit;
    }
    
    return true;
  };

  const quickNavItems: QuickNavItem[] = [
    {
      label: t('quicknav.home'),
      path: '/',
      icon: Home,
      description: t('quicknav.homeDesc'),
      color: 'from-blue-500 to-blue-600'
    },
    {
      label: t('quicknav.generator'),
      path: '/generator',
      icon: Wand2,
      description: t('quicknav.generatorDesc'),
      color: 'from-purple-500 to-pink-600'
    },
    {
      label: t('quicknav.payment'),
      path: '/payment',
      icon: CreditCard,
      description: t('quicknav.paymentDesc'),
      color: 'from-green-500 to-green-600',
      requiresPayment: true,
      disabled: !canAccessPayment(),
      disabledReason: !paymentSettings.paymentRequired 
        ? t('quicknav.paymentNotRequired')
        : localStorage.getItem('payment_completed') === 'true'
        ? t('quicknav.paymentAlreadyDone')
        : paymentSettings.freeTrialsAllowed && parseInt(localStorage.getItem('trial_count') || '0') < paymentSettings.trialLimit
        ? t('quicknav.freeTrialsAvailable')
        : t('quicknav.notAvailable')
    },
    {
      label: t('quicknav.results'),
      path: '/results',
      icon: CheckCircle,
      description: t('quicknav.resultsDesc'),
      color: 'from-orange-500 to-orange-600',
      requiresGeneration: true,
      disabled: !canAccessResults() || state.generatedPhrases.length === 0,
      disabledReason: state.generatedPhrases.length === 0 
        ? t('quicknav.noGenerated')
        : !canAccessResults()
        ? t('quicknav.unauthorized')
        : t('quicknav.notAvailable')
    }
  ];

  // Don't show on home page
  if (currentPath === '/') {
    return null;
  }

  // Filter out current page and disabled items
  const availableItems = quickNavItems.filter(item => 
    item.path !== currentPath && !item.disabled
  );

  if (availableItems.length === 0) {
    return null;
  }

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-3 w-32"></div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col items-center p-3">
                <div className="w-10 h-10 bg-gray-200 rounded-lg mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-16 mb-1"></div>
                <div className="h-2 bg-gray-200 rounded w-12"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900">{t('quicknav.title')}</h3>
        <ArrowRight className="w-4 h-4 text-gray-400" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {availableItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="group flex flex-col items-center p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all duration-200"
          >
            <div className={`w-10 h-10 bg-gradient-to-r ${item.color} rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
              <item.icon className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs font-medium text-gray-900 text-center">
              {item.label}
            </span>
            <span className="text-xs text-gray-500 text-center mt-1">
              {item.description}
            </span>
          </Link>
        ))}
      </div>
      
      {/* Afficher les éléments désactivés avec une indication visuelle */}
      {quickNavItems.some(item => item.disabled && item.path !== currentPath) && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <h4 className="text-xs font-medium text-gray-500 mb-2">{t('quicknav.unavailablePages')}</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {quickNavItems
              .filter(item => item.disabled && item.path !== currentPath)
              .map((item) => (
                <div
                  key={item.path}
                  className="flex flex-col items-center p-3 rounded-lg border border-gray-100 bg-gray-50 opacity-60"
                  title={item.disabledReason}
                >
                  <div className={`w-10 h-10 bg-gradient-to-r ${item.color} rounded-lg flex items-center justify-center mb-2 opacity-50`}>
                    <Lock className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs font-medium text-gray-400 text-center">
                    {item.label}
                  </span>
                  <span className="text-xs text-gray-400 text-center mt-1">
                    {item.disabledReason}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
} 
import React, { useState, useEffect } from 'react';
import { CheckCircle, Circle, ArrowRight, Lock } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useTranslation } from 'react-i18next';

interface Step {
  id: string;
  label: string;
  path: string;
  description: string;
  completed: boolean;
  current: boolean;
  available: boolean;
  disabledReason?: string;
}

export function StepNavigation() {
  const location = useLocation();
  const { state, refreshPaymentStatus } = useApp();
  const currentPath = location.pathname;
  const [paymentStatus, setPaymentStatus] = useState<{
    canGenerate: boolean;
    requiresPayment: boolean;
    trialCount?: number;
    trialLimit?: number;
    showResults: boolean;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    loadPaymentStatus();
  }, []);

  const loadPaymentStatus = async () => {
    try {
      const status = await refreshPaymentStatus();
      
      setPaymentStatus(status);
    } catch (error) {
      console.error('Error loading payment status:', error);
    } finally {
      setLoading(false);
    }
  };

  // Vérifier si l'utilisateur peut accéder aux résultats
  const canAccessResults = () => {
    if (!paymentStatus) return false;
    
    // Vérifier d'abord s'il y a des essais gratuits disponibles
    const hasTrials = paymentStatus.trialCount !== undefined && 
                     paymentStatus.trialLimit !== undefined && 
                     paymentStatus.trialCount < paymentStatus.trialLimit;
    
    
    
    // Si l'utilisateur a des essais gratuits, il peut accéder aux résultats
    if (hasTrials) return true;
    
    // Sinon, vérifier l'accès gratuit normal
    if (!paymentStatus.requiresPayment) return true;
    
    return paymentStatus.canGenerate && paymentStatus.showResults;
  };

  // Vérifier si l'utilisateur peut accéder au paiement
  const canAccessPayment = () => {
    if (!paymentStatus) return false;
    
    // Si l'utilisateur a un pendingResultId, il peut toujours accéder au paiement
    if (state.pendingResultId) return true;
    
    // Si le paiement n'est pas requis, pas d'accès au paiement
    if (!paymentStatus.requiresPayment) return false;
    
    // Si l'utilisateur a déjà accès aux résultats ET des phrases générées, pas besoin de paiement
    if (paymentStatus.canGenerate && paymentStatus.showResults && state.generatedPhrases.length > 0) return false;
    
    // L'utilisateur peut accéder au paiement s'il a épuisé ses essais gratuits
    if (paymentStatus.trialCount !== undefined && paymentStatus.trialLimit !== undefined) {
      return paymentStatus.trialCount >= paymentStatus.trialLimit;
    }
    
    return true;
  };

  const baseSteps: Omit<Step, 'completed' | 'current' | 'available'>[] = [
    {
      id: 'home',
      label: t('stepnav.home'),
      path: '/',
      description: t('stepnav.homeDesc')
    },
    {
      id: 'generator',
      label: t('stepnav.generator'),
      path: '/generator',
      description: t('stepnav.generatorDesc')
    },
    {
      id: 'payment',
      label: t('stepnav.payment'),
      path: '/payment',
      description: t('stepnav.paymentDesc')
    },
    {
      id: 'results',
      label: t('stepnav.results'),
      path: '/results',
      description: t('stepnav.resultsDesc')
    }
  ];

  // Filtrer les étapes selon les paramètres de paiement
  const getAvailableSteps = () => {
    let steps = [...baseSteps];

    // Avec le système de paiement par génération, l'étape payment est toujours disponible
    // si l'utilisateur a un pendingResultId ou si le paiement est requis
    const shouldShowPayment = state.pendingResultId || 
      (paymentStatus?.requiresPayment && !paymentStatus?.showResults);

    if (!shouldShowPayment) {
      steps = steps.filter(step => step.id !== 'payment');
    }

    return steps;
  };

  const availableSteps = getAvailableSteps();

  // Determine step states
  const updatedSteps = availableSteps.map((step, index) => {
    const stepIndex = availableSteps.findIndex(s => s.path === currentPath);
    const currentStepIndex = stepIndex === -1 ? 0 : stepIndex;
    
    let available = true;
    let disabledReason = '';

    // Vérifier la disponibilité de chaque étape
    if (step.id === 'payment') {
      available = canAccessPayment();
      if (!available) {
        disabledReason = state.pendingResultId
          ? t('stepnav.notAvailable')
          : !paymentStatus?.requiresPayment 
          ? t('stepnav.paymentNotRequired')
          : paymentStatus?.canGenerate && paymentStatus?.showResults && state.generatedPhrases.length > 0
          ? t('stepnav.paymentAlreadyDone')
          : paymentStatus?.trialCount !== undefined && paymentStatus?.trialLimit !== undefined && 
            paymentStatus.trialCount < paymentStatus.trialLimit
          ? t('stepnav.freeTrialsAvailable')
          : t('stepnav.notAvailable');
      }
    } else if (step.id === 'results') {
      available = canAccessResults() && state.generatedPhrases.length > 0;
      if (!available) {
        disabledReason = state.generatedPhrases.length === 0 
          ? t('stepnav.noGenerated')
          : !canAccessResults()
          ? t('stepnav.unauthorized')
          : t('stepnav.notAvailable');
      }
    }
    
    return {
      ...step,
      completed: index < currentStepIndex,
      current: index === currentStepIndex,
      available,
      disabledReason
    };
  });

  // Don't show on home page or admin pages
  if (currentPath === '/' || currentPath.startsWith('/admin')) {
    return null;
  }

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4 w-32"></div>
          <div className="h-2 bg-gray-200 rounded mb-6"></div>
          <div className="flex justify-between">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-8 h-8 bg-gray-200 rounded-full mb-2"></div>
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
    <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-900">{t('stepnav.title')}</h3>
        <div className="text-sm text-gray-500">
          {t('stepnav.progress', { current: updatedSteps.findIndex(s => s.current) + 1, total: updatedSteps.length })}
        </div>
      </div>
      
      <div className="relative">
        {/* Progress bar */}
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200">
          <div 
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
            style={{ 
              width: `${((updatedSteps.findIndex(s => s.current) + 1) / updatedSteps.length) * 100}%` 
            }}
          />
        </div>

        {/* Steps */}
        <div className="relative flex justify-between">
          {updatedSteps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center mb-2 transition-all duration-300
                ${step.completed 
                  ? 'bg-green-500 text-white' 
                  : step.current 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
                    : step.available
                      ? 'bg-gray-200 text-gray-400'
                      : 'bg-gray-100 text-gray-300'
                }
              `}>
                {step.completed ? (
                  <CheckCircle className="w-5 h-5" />
                ) : !step.available ? (
                  <Lock className="w-4 h-4" />
                ) : (
                  <Circle className="w-5 h-5" />
                )}
              </div>
              
              <div className="text-center max-w-20">
                <div className={`
                  text-xs font-medium mb-1
                  ${step.completed 
                    ? 'text-green-600' 
                    : step.current 
                      ? 'text-purple-600' 
                      : step.available
                        ? 'text-gray-600'
                        : 'text-gray-400'
                  }
                `}>
                  {step.label}
                </div>
                <div className={`
                  text-[10px] leading-tight
                  ${step.completed 
                    ? 'text-green-500' 
                    : step.current 
                      ? 'text-purple-500'
                      : step.available
                        ? 'text-gray-500'
                        : 'text-gray-400'
                  }
                `}>
                  {step.available ? step.description : step.disabledReason}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 
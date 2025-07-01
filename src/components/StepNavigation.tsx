import React, { useState, useEffect } from 'react';
import { CheckCircle, Circle, ArrowRight, Lock } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { isPaymentRequired, areFreeTrialsAllowed, getTrialLimit } from '../services/settings';

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
  const { state } = useApp();
  const currentPath = location.pathname;
  const [paymentSettings, setPaymentSettings] = useState({
    paymentRequired: true,
    freeTrialsAllowed: false,
    trialLimit: 1
  });
  const [loading, setLoading] = useState(true);

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

  const baseSteps: Omit<Step, 'completed' | 'current' | 'available'>[] = [
    {
      id: 'home',
      label: 'Accueil',
      path: '/',
      description: 'Découverte du service'
    },
    {
      id: 'generator',
      label: 'Générateur',
      path: '/generator',
      description: 'Configuration et génération'
    },
    {
      id: 'payment',
      label: 'Paiement',
      path: '/payment',
      description: 'Sécurisation du paiement'
    },
    {
      id: 'results',
      label: 'Résultats',
      path: '/results',
      description: 'Vos phrases d\'accroche'
    }
  ];

  // Filtrer les étapes selon les paramètres de paiement
  const getAvailableSteps = () => {
    let steps = [...baseSteps];

    // Si le paiement n'est pas requis, supprimer l'étape paiement
    if (!paymentSettings.paymentRequired) {
      steps = steps.filter(step => step.id !== 'payment');
    }

    // Si les essais gratuits sont autorisés et que l'utilisateur n'a pas atteint la limite
    if (paymentSettings.freeTrialsAllowed) {
      const trialCount = parseInt(localStorage.getItem('trial_count') || '0');
      if (trialCount < paymentSettings.trialLimit) {
        // L'étape paiement n'est pas encore nécessaire
        steps = steps.filter(step => step.id !== 'payment');
      }
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
        disabledReason = !paymentSettings.paymentRequired 
          ? 'Paiement non requis' 
          : localStorage.getItem('payment_completed') === 'true'
          ? 'Paiement déjà effectué'
          : paymentSettings.freeTrialsAllowed && parseInt(localStorage.getItem('trial_count') || '0') < paymentSettings.trialLimit
          ? 'Essais gratuits disponibles'
          : 'Non disponible';
      }
    } else if (step.id === 'results') {
      available = canAccessResults() && state.generatedPhrases.length > 0;
      if (!available) {
        disabledReason = state.generatedPhrases.length === 0 
          ? 'Aucune phrase générée' 
          : !canAccessResults()
          ? 'Accès non autorisé'
          : 'Non disponible';
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
        <h3 className="text-lg font-semibold text-gray-900">Progression</h3>
        <div className="text-sm text-gray-500">
          Étape {updatedSteps.findIndex(s => s.current) + 1} sur {updatedSteps.length}
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
                        ? 'text-gray-500'
                        : 'text-gray-400'
                  }
                `}>
                  {step.label}
                </div>
                <div className={`text-xs leading-tight ${
                  step.available ? 'text-gray-400' : 'text-gray-300'
                }`}>
                  {step.disabledReason || step.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Current step info */}
      <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">
              {updatedSteps.findIndex(s => s.current) + 1}
            </span>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">
              {updatedSteps.find(s => s.current)?.label}
            </h4>
            <p className="text-sm text-gray-600">
              {updatedSteps.find(s => s.current)?.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 
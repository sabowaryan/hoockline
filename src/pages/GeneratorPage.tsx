import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Wand2, 
  Loader2, 
  ArrowRight, 
  AlertTriangle, 
  CheckCircle, 
  Star
} from 'lucide-react';
import { AppError, ErrorManager, useApp } from '../context/AppContext';
import { PromptOptions } from '../types/PromptOptions';
import { products, formatPrice } from '../stripe-config';
import { StepNavigation } from '../components/StepNavigation';
import { useTranslation } from 'react-i18next';
import { PromptEditor } from '../components/PromptEditor';

import { formats } from '../data/formats';
import { tones } from '../data/tones';
import { languages as languagesData } from '../data/languages';

function isAppError(error: unknown): error is AppError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'type' in error &&
    'message' in error
  );
}

export function GeneratorPage() {
  const { state, generatePhrases, navigateToPayment, navigateToHome, refreshPaymentStatus } = useApp();
  const [promptOptions, setPromptOptions] = useState<PromptOptions>({
    concept: '',
    format: formats[0].value.id,
    tone: 'direct',
    targetLanguage: 'fr'
  });
  const [animateIn, setAnimateIn] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<{
    canGenerate: boolean;
    requiresPayment: boolean;
    trialCount?: number;
    trialLimit?: number;
    showResults: boolean;
    reason?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    setAnimateIn(true);
    loadPaymentStatus();
  }, []);

  const loadPaymentStatus = async () => {
    try {
      const status = await refreshPaymentStatus();
      console.log('🔍 GeneratorPage Payment Status Debug:', {
        canGenerate: status.canGenerate,
        requiresPayment: status.requiresPayment,
        showResults: status.showResults,
        trialCount: status.trialCount,
        trialLimit: status.trialLimit,
        reason: status.reason
      });
      setPaymentStatus(status);
    } catch (error) {
      console.error('Error loading payment status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!promptOptions.concept.trim()) return;
    await generatePhrases({
      ...promptOptions,
      concept: promptOptions.concept.trim()
    });
  };

  const canGenerate = promptOptions.concept.trim() && !state.isGenerating;

  const renderPaymentInfo = () => {
    if (!paymentStatus) return null;

    console.log('🔍 GeneratorPage Payment Status Debug:', {
      requiresPayment: paymentStatus.requiresPayment,
      showResults: paymentStatus.showResults,
      trialCount: paymentStatus.trialCount,
      trialLimit: paymentStatus.trialLimit,
      reason: paymentStatus.reason
    });

    // Période d'essai - Vérifier en premier
    if (paymentStatus.trialCount !== undefined && 
        paymentStatus.trialLimit !== undefined && 
        paymentStatus.trialCount < paymentStatus.trialLimit) {
      return (
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl p-6 mb-8 shadow-lg">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center">
              <Star className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-base font-semibold text-blue-900">{t('generator.form.trialTitle')}</p>
              <p className="text-sm text-blue-700">
                {t('generator.form.trialCount', { count: paymentStatus.trialCount + 1, limit: paymentStatus.trialLimit })}
              </p>
            </div>
          </div>
        </div>
      );
    }

    // Accès gratuit ou payé (après avoir vérifié les essais)
    // Pour les essais gratuits, requiresPayment est false et showResults est true
    // Donc on vérifie qu'il n'y a pas de trialCount pour être sûr que c'est vraiment gratuit
    const hasTrials = paymentStatus?.trialCount !== undefined && 
                     paymentStatus?.trialLimit !== undefined && 
                     paymentStatus.trialCount < paymentStatus.trialLimit;
    
    if ((!paymentStatus?.requiresPayment || paymentStatus?.showResults) && !hasTrials) {
      return (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 mb-8 shadow-lg">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-base font-semibold text-green-900">{t('generator.form.freeTitle')}</p>
              <p className="text-sm text-green-700">{t('generator.form.freeDescription')}</p>
            </div>
          </div>
        </div>
      );
    }

    // Accès premium requis
    return (
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-2xl p-6 mb-8 shadow-lg">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-600 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-base font-semibold text-orange-900">{t('generator.form.paymentRequired')}</p>
            <p className="text-sm text-orange-700">
              {t('generator.form.paymentDescription', { price: formatPrice(products[0].price) })}
            </p>
          </div>
        </div>
      </div>
    );
  };

  // Setter pour PromptEditor
  const setValues = (v: Partial<PromptOptions>) => {
    setPromptOptions(prev => ({ ...prev, ...v }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-6 sm:py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header amélioré */}
        <div className={`text-center mb-8 sm:mb-12 transition-all duration-1000 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex items-center justify-center mb-6">
            <button
              onClick={navigateToHome}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-all transform hover:scale-105 mr-6"
            >
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg">
                <ArrowLeft className="w-5 h-5" />
              </div>
            </button>
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                {t('generator.title')}
              </h1>
              <p className="text-lg sm:text-xl text-gray-600">
                {t('generator.description')}
              </p>
            </div>
          </div>
        </div>

        {/* Payment Info */}
        {!loading && renderPaymentInfo()}

        {/* Error Message amélioré */}
        {state.error && (
  <div className="bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-2xl p-6 mb-8 shadow-lg">
    <div className="flex items-start space-x-4">
      <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-rose-600 rounded-full flex items-center justify-center flex-shrink-0">
        <AlertTriangle className="w-6 h-6 text-white" />
      </div>
      <div className="flex-1">
        <p className="text-base font-semibold text-red-900 mb-2">{t('notifications.error')}</p>
        <p className="text-sm text-red-700 mb-4">
          {typeof state.error === 'string'
            ? state.error
            : ErrorManager.getErrorMessage(state.error)}
        </p>

        {isAppError(state.error) && state.error.type === 'PAYMENT' && (
  <button
    onClick={navigateToPayment}
    className="bg-gradient-to-r from-red-600 to-rose-600 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:shadow-lg transition-all transform hover:scale-105"
  >
    {t('generator.payment.proceed')}
  </button>
)}

      </div>
    </div>
  </div>
)}


        {/* PromptEditor intégré */}
        <PromptEditor
          values={promptOptions}
          setValues={setValues}
          formats={formats}
          tones={tones}
          languages={languagesData}
        />

        {/* Generate Button amélioré */}
        <div className={`transition-all duration-1000 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ animationDelay: '800ms' }}>
          <button
            onClick={handleGenerate}
            disabled={!canGenerate}
            className={`w-full flex items-center justify-center space-x-3 py-6 rounded-2xl text-xl font-bold transition-all duration-300 ${
              !canGenerate
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105'
            }`}
          >
            {state.isGenerating ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                <span>{t('generator.form.generating')}</span>
              </>
            ) : (
              <>
                <Wand2 className="w-6 h-6" />
                <span>{t('generator.form.generate')}</span>
                <ArrowRight className="w-6 h-6" />
              </>
            )}
          </button>
        </div>

        {/* Step Navigation */}
        <div className="mt-12">
          <StepNavigation />
        </div>
      </div>
    </div>
  );
} 
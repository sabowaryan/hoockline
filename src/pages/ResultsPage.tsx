import React, { useState, useEffect } from 'react';
import { CheckCircle, Home, RefreshCw, Globe, Sparkles, Zap, ArrowRight, Star, CreditCard } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTranslation } from 'react-i18next';
import { PromptResult } from '../components/PromptResult';
import { savePendingResults, createPaymentToken } from '../services/settings';
import { useNavigate } from 'react-router-dom';

export function ResultsPage() {
  const { state, navigateToHome, navigateToGenerator, copyPhrase, refreshPaymentStatus } = useApp();
  const [copiedPhrases, setCopiedPhrases] = useState<Set<string>>(new Set());
  const [animateIn, setAnimateIn] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<{
    canGenerate: boolean;
    requiresPayment: boolean;
    showResults: boolean;
    trialCount?: number;
    trialLimit?: number;
    reason?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    setAnimateIn(true);
    loadPaymentStatus();
  }, []);

  const loadPaymentStatus = async () => {
    try {
      const status = await refreshPaymentStatus();
      console.log('🔍 ResultsPage Payment Status Debug:', {
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

  const handleCopy = async (phrase: string, phraseId: string) => {
    await copyPhrase(phrase);
    setCopiedPhrases(prev => new Set(prev).add(phraseId));
    
    // Reset copied state after 2 seconds
    setTimeout(() => {
      setCopiedPhrases(prev => {
        const newSet = new Set(prev);
        newSet.delete(phraseId);
        return newSet;
      });
    }, 2000);
  };

  const handleProceedToPayment = async () => {
    try {
      // Sauvegarder les phrases générées existantes
      const resultId = await savePendingResults(JSON.stringify(state.generatedPhrases));
      
      // Créer un token de paiement pour cette génération
      const paymentAmount = 399; // 3.99 EUR en centimes
      const paymentToken = await createPaymentToken(resultId, paymentAmount, 'EUR');
      
      // Stocker le token de paiement dans localStorage
      localStorage.setItem('payment_token', paymentToken);
      
      // Stocker le resultId dans sessionStorage pour la page de paiement
      sessionStorage.setItem('pending_result_id', resultId);
      
      // Rediriger vers la page de paiement
      navigate('/payment');
    } catch (error) {
      console.error('Erreur lors de la préparation du paiement:', error);
      // En cas d'erreur, rediriger vers la page d'accueil
      navigateToHome();
    }
  };

  // Si on n'a pas de phrases générées, rediriger vers la page d'accueil
  if (!state.generatedPhrases.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-pink-50">
        <div className="text-center p-8">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('results.emptyTitle')}</h2>
          <p className="text-gray-600 mb-6">{t('results.emptyDesc')}</p>
          <button
            onClick={navigateToHome}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all transform hover:scale-105"
          >
            <span className="flex items-center space-x-2">
              <Zap className="w-5 h-5" />
              <span>{t('results.startGeneration')}</span>
            </span>
          </button>
        </div>
      </div>
    );
  }

  // Si on charge le statut de paiement
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-pink-50">
        <div className="text-center p-8">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">{t('results.loading')}</p>
        </div>
      </div>
    );
  }

  // Vérifier si l'utilisateur peut accéder aux résultats
  const canAccessResults = () => {
    if (!paymentStatus) return false;
    
    // Vérifier d'abord s'il y a des essais gratuits disponibles
    const hasTrials = paymentStatus.trialCount !== undefined && 
                     paymentStatus.trialLimit !== undefined && 
                     paymentStatus.trialCount < paymentStatus.trialLimit;
    
    console.log('🔍 ResultsPage canAccessResults Debug:', {
      hasTrials,
      trialCount: paymentStatus.trialCount,
      trialLimit: paymentStatus.trialLimit,
      requiresPayment: paymentStatus.requiresPayment,
      canGenerate: paymentStatus.canGenerate,
      showResults: paymentStatus.showResults
    });
    
    // Si l'utilisateur a des essais gratuits, il peut accéder aux résultats
    if (hasTrials) return true;
    
    // Sinon, vérifier l'accès gratuit normal
    if (!paymentStatus.requiresPayment) return true;
    
    return paymentStatus.canGenerate && paymentStatus.showResults;
  };

  // Si l'utilisateur n'a pas accès aux résultats
  if (!canAccessResults()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-pink-50">
        <div className="text-center p-8 max-w-lg">
          <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Star className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('results.paymentRequired')}</h2>
          <p className="text-gray-600 mb-6">{t('results.paymentDesc')}</p>
          <button
            onClick={handleProceedToPayment}
            className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-orange-500/25 transition-all transform hover:scale-105"
          >
            <span className="flex items-center space-x-2">
              <CreditCard className="w-5 h-5" />
              <span>{t('results.upgrade')}</span>
            </span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-6 sm:py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header avec animation */}
        <div className={`text-center mb-12 transition-all duration-1000 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="relative">
            {/* Cercle de fond animé */}
            <div className="absolute inset-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mx-auto blur-xl opacity-20 animate-pulse"></div>
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
            </div>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
            {t('results.readyTitle')}
          </h1>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-xl border border-white/20 mb-8">
            <p className="text-lg sm:text-xl text-gray-700 mb-4">
              {t('results.personalizedPhrases')} <span className="font-bold text-purple-600">10</span> {t('results.for')} :
            </p>
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-4 mb-4">
              <p className="text-lg sm:text-xl font-semibold text-gray-900">
                "{state.generationRequest?.concept}"
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-6 text-gray-600">
              <div className="flex items-center space-x-2 bg-purple-100 px-4 py-2 rounded-full">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span className="font-medium capitalize">
                  {t('results.tone')} {t(`generator.form.tones.${state.generationRequest?.tone}`)}
                </span>
              </div>
              <div className="flex items-center space-x-2 bg-pink-100 px-4 py-2 rounded-full">
                <Globe className="w-4 h-4 text-pink-600" />
                <span className="font-medium">
                  {t(`generator.form.languages.${state.generationRequest?.targetLanguage}`) || state.generationRequest?.targetLanguage}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Generated Phrases avec PromptResult */}
        <PromptResult
          results={state.generatedPhrases}
          onCopy={handleCopy}
          copiedPhrases={copiedPhrases}
          onDownload={() => {
            const content = state.generatedPhrases.map(r => r.text).join('\n');
            const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `accroches-${Date.now()}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }}
        />

        {/* Final Message & CTA amélioré */}
        <div className={`bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 rounded-3xl p-8 sm:p-12 text-center text-white shadow-2xl border border-purple-500/20 transition-all duration-1000 ${
          animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="relative">
            {/* Éléments décoratifs */}
            <div className="absolute top-0 left-0 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
            <div className="absolute bottom-0 right-0 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
            
            <div className="relative">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-2xl sm:text-3xl font-bold mb-6">
                {t('results.ctaTitle')}
              </h3>
              <p className="text-purple-100 mb-8 text-lg leading-relaxed max-w-2xl mx-auto">
                {t('results.ctaDesc')}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={navigateToGenerator}
                  className="group inline-flex items-center justify-center space-x-3 bg-white text-purple-600 px-6 py-4 rounded-xl font-semibold hover:bg-purple-50 transition-all transform hover:scale-105 shadow-lg"
                >
                  <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                  <span>{t('results.generateMore')}</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={navigateToHome}
                  className="inline-flex items-center justify-center space-x-3 bg-white/20 text-white px-6 py-4 rounded-xl font-semibold hover:bg-white/30 transition-all transform hover:scale-105 border border-white/30"
                >
                  <Home className="w-5 h-5" />
                  <span>{t('results.backHome')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


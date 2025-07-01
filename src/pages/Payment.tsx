import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  CreditCard, 
  Globe, 
  Loader2, 
  ArrowLeft, 
  CheckCircle, 
  Star, 
  Lock, 
  AlertCircle,
  Sparkles,
  Zap,
  Award,
  Users,
  Clock,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { createCheckoutSession } from '../services/stripe';
import { products, formatPrice } from '../stripe-config';
import { getPaymentAmount, getPaymentCurrency } from '../services/settings';
import { useTranslation } from 'react-i18next';

const languageNames: Record<string, string> = {
  'fr': 'Français',
  'en': 'English',
  'es': 'Español',
  'de': 'Deutsch',
  'it': 'Italiano',
  'pt': 'Português'
};

export function Payment() {
  const { state, navigateToGenerator } = useApp();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentAmount, setPaymentAmount] = useState(399);
  const [paymentCurrency, setPaymentCurrency] = useState('EUR');
  const [animateIn, setAnimateIn] = useState(false);
  const { t } = useTranslation();

  const product = products[0]; // Hookline product

  useEffect(() => {
    setAnimateIn(true);
    loadPaymentSettings();
  }, []);

  const loadPaymentSettings = async () => {
    try {
      const [amount, currency] = await Promise.all([
        getPaymentAmount(),
        getPaymentCurrency()
      ]);
      setPaymentAmount(amount);
      setPaymentCurrency(currency);
    } catch (error) {
      console.error('Error loading payment settings:', error);
    }
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    setError(null);
    
    try {
      const currentUrl = window.location.origin;
      const successUrl = `${currentUrl}?success=true`;
      const cancelUrl = `${currentUrl}?canceled=true`;

      const { url } = await createCheckoutSession({
        priceId: product.priceId,
        mode: product.mode,
        successUrl,
        cancelUrl,
      });

      if (url) {
        window.location.href = url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (err: any) {
      console.error('Payment error:', err);
      setError(err.message || 'Une erreur est survenue lors du paiement');
      setIsProcessing(false);
    }
  };

  const handleGoBack = () => {
    navigateToGenerator();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-6 sm:py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header amélioré */}
        <div className={`text-center mb-8 sm:mb-12 transition-all duration-1000 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex items-center justify-center mb-6">
            <button
              onClick={handleGoBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-all transform hover:scale-105 mr-6"
            >
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg">
                <ArrowLeft className="w-5 h-5" />
              </div>
            </button>
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                {t('payment.title')}
              </h1>
              <p className="text-lg sm:text-xl text-gray-600">
                {t('payment.secureStripe')}
              </p>
            </div>
          </div>
        </div>

        {/* Success Message - Phrases Generated */}
        {state.generatedPhrases.length > 0 && (
          <div className={`bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-3xl p-8 mb-8 shadow-xl transition-all duration-1000 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ animationDelay: '200ms' }}>
            <div className="flex items-center space-x-6">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-xl font-bold text-green-900 mb-2">{t('payment.successTitle')}</p>
                <p className="text-base text-green-700">
                  {t('payment.successDesc', { count: state.generatedPhrases.length })}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message amélioré */}
        {error && (
          <div className={`bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-3xl p-6 mb-8 shadow-xl transition-all duration-1000 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ animationDelay: '400ms' }}>
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-rose-600 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-base font-semibold text-red-900 mb-2">{t('payment.errorTitle')}</p>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Product Showcase amélioré */}
        <div className={`bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 rounded-3xl p-8 mb-8 text-white shadow-2xl relative overflow-hidden transition-all duration-1000 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ animationDelay: '600ms' }}>
          {/* Éléments décoratifs */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
          
          <div className="relative text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Award className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-3">{product.name}</h3>
            <p className="text-purple-100 text-lg mb-6">{t('payment.productDescription')}</p>
            <div className="text-4xl font-bold mb-4">{formatPrice(product.price)}</div>
            <div className="flex items-center justify-center space-x-2 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-300 fill-current" />
              ))}
              <span className="text-purple-100 text-base ml-3">{t('payment.satisfaction')}</span>
            </div>
          </div>
        </div>

        {/* Order Summary amélioré */}
        <div className={`bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 mb-8 transition-all duration-1000 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ animationDelay: '800ms' }}>
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{t('payment.summaryTitle')}</h3>
              <p className="text-sm text-gray-600">{t('payment.summaryDesc')}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl">
              <span className="text-base font-semibold text-gray-900">{product.name}</span>
              <span className="text-xl font-bold text-purple-600">{formatPrice(product.price)}</span>
            </div>
            
            {/* Product features */}
            <h4 className="text-lg font-semibold text-gray-900 mb-3">{t('payment.productFeatures')}</h4>
            <div className="space-y-3">
              {product.features.slice(0, 4).map((feature, index) => (
                <div key={index} className="flex items-center text-sm text-gray-600">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mr-3">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <span>{t(`payment.feature.${index}`)}</span>
                </div>
              ))}
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">{t('payment.total')}</span>
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{formatPrice(product.price)}</span>
              </div>
            </div>
          </div>

          {state.generationRequest && (
            <div className="mt-6 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold text-gray-900">{t('payment.yourGeneration')}</span>
              </div>
              <div className="text-sm text-gray-600 mb-3">{t('payment.concept')}</div>
              <div className="text-base font-semibold text-gray-900 mb-4 break-words bg-white p-3 rounded-xl">
                "{state.generationRequest.concept}"
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-3 rounded-xl">
                  <div className="text-xs text-gray-500 mb-1">{t('payment.selectedTone')}</div>
                  <div className="text-sm font-semibold text-gray-900 capitalize">
                    {t(`generator.form.tones.${state.generationRequest.tone}`)}
                  </div>
                </div>
                <div className="bg-white p-3 rounded-xl">
                  <div className="text-xs text-gray-500 mb-1">{t('payment.language')}</div>
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-gray-500" />
                    <div className="text-sm font-semibold text-gray-900">
                      {t(`generator.form.languages.${state.generationRequest.language}`) || state.generationRequest.language}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Security Notice amélioré */}
        <div className={`bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-3xl p-6 mb-8 shadow-xl transition-all duration-1000 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ animationDelay: '1000ms' }}>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-base font-semibold text-green-900 mb-1">
                {t('payment.secure100')}
              </div>
              <div className="text-sm text-green-700">
                {t('payment.sslStripe')}
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods amélioré */}
        <div className={`bg-white/80 backdrop-blur-sm rounded-3xl p-6 mb-8 shadow-xl border border-white/20 transition-all duration-1000 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ animationDelay: '1200ms' }}>
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900">{t('payment.acceptedMethods')}</h4>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {['Visa', 'Mastercard', 'American Express'].map((card, index) => (
              <div key={index} className="bg-gradient-to-r from-gray-50 to-gray-100 p-3 rounded-xl text-center">
                <CreditCard className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                <span className="text-sm font-medium text-gray-700">{t(`payment.card.${card.toLowerCase().replace(/ /g, '')}`)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Button amélioré */}
        <div className={`transition-all duration-1000 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ animationDelay: '1400ms' }}>
          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className={`group w-full flex items-center justify-center space-x-3 py-6 rounded-2xl text-lg font-bold transition-all duration-300 ${
              isProcessing
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105'
            }`}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                <span>{t('payment.redirecting')}</span>
              </>
            ) : (
              <>
                <Lock className="w-6 h-6" />
                <span>{t('payment.payNow', { price: formatPrice(product.price) })}</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>

        {/* Terms and Trust indicators améliorés */}
        <div className={`text-center mt-8 transition-all duration-1000 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ animationDelay: '1600ms' }}>
          <p className="text-sm text-gray-600 mb-6">
            {t('payment.terms1')}{' '}
            <a href="#conditions" className="text-purple-600 hover:underline font-medium">
              {t('payment.terms2')}
            </a>
          </p>

          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="font-medium">{t('payment.ssl')}</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="font-medium">{t('payment.stripe')}</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="font-medium">{t('payment.instantAccess')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
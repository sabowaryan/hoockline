import React, { useState } from 'react';
import { Shield, CreditCard, Globe, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { createCheckoutSession } from '../services/stripe';
import { products } from '../stripe-config';

const languageNames: Record<string, string> = {
  'fr': 'Français',
  'en': 'English',
  'es': 'Español',
  'de': 'Deutsch',
  'it': 'Italiano',
  'pt': 'Português'
};

export function Payment() {
  const { state } = useApp();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const product = products[0]; // Hookline product

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

  return (
    <div className="py-6 sm:py-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Finaliser votre achat
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Paiement sécurisé avec Stripe
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Order Summary */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 mb-6 sm:mb-8">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
            Récapitulatif de commande
          </h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm sm:text-base text-gray-600">{product.name}</span>
              <span className="font-semibold text-gray-900">${product.price}</span>
            </div>
            <div className="text-xs sm:text-sm text-gray-500">
              {product.description}
            </div>
            <div className="border-t pt-3">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="text-lg sm:text-xl font-bold text-purple-600">${product.price}</span>
              </div>
            </div>
          </div>

          {state.generationRequest && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="text-xs sm:text-sm text-gray-600 mb-1">Votre concept :</div>
              <div className="text-xs sm:text-sm font-medium text-gray-900 mb-2 break-words">
                {state.generationRequest.concept}
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Ton sélectionné :</div>
                  <div className="text-xs sm:text-sm font-medium text-gray-900 capitalize">
                    {state.generationRequest.tone}
                  </div>
                </div>
                <div>
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Langue :</div>
                  <div className="flex items-center space-x-2">
                    <Globe className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                    <div className="text-xs sm:text-sm font-medium text-gray-900">
                      {languageNames[state.generationRequest.language] || state.generationRequest.language}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Security Notice */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 sm:mb-8">
          <div className="flex items-center space-x-3">
            <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
            <div>
              <div className="text-sm font-medium text-green-900">
                Paiement 100% sécurisé
              </div>
              <div className="text-xs sm:text-sm text-green-700">
                Chiffrement SSL et protection Stripe
              </div>
            </div>
          </div>
        </div>

        {/* Payment Button */}
        <button
          onClick={handlePayment}
          disabled={isProcessing}
          className={`w-full flex items-center justify-center space-x-2 sm:space-x-3 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-semibold transition-all ${
            isProcessing
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/25 transform hover:scale-105'
          }`}
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
              <span>Redirection vers Stripe...</span>
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Payer ${product.price} maintenant</span>
            </>
          )}
        </button>

        <p className="text-center text-xs sm:text-sm text-gray-500 mt-4">
          En cliquant sur "Payer", vous acceptez nos conditions d'utilisation
        </p>
      </div>
    </div>
  );
}
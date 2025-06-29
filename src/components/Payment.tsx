import React, { useState } from 'react';
import { Shield, CreditCard, Globe } from 'lucide-react';
import { useApp } from '../context/AppContext';

const languageNames: Record<string, string> = {
  'fr': 'Français',
  'en': 'English',
  'es': 'Español',
  'de': 'Deutsch',
  'it': 'Italiano',
  'pt': 'Português'
};

export function Payment() {
  const { state, completePayment } = useApp();
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    completePayment();
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

        {/* Order Summary */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 mb-6 sm:mb-8">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
            Récapitulatif de commande
          </h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm sm:text-base text-gray-600">Pack de 10 phrases d'accroche</span>
              <span className="font-semibold text-gray-900">3,00 €</span>
            </div>
            <div className="border-t pt-3">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="text-lg sm:text-xl font-bold text-purple-600">3,00 €</span>
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

        {/* Payment Form (Simulated) */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 mb-6 sm:mb-8">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
            Informations de paiement
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="votre@email.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                disabled={isProcessing}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Numéro de carte
              </label>
              <input
                type="text"
                placeholder="4242 4242 4242 4242"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                disabled={isProcessing}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  MM/AA
                </label>
                <input
                  type="text"
                  placeholder="12/28"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                  disabled={isProcessing}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CVC
                </label>
                <input
                  type="text"
                  placeholder="123"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                  disabled={isProcessing}
                />
              </div>
            </div>
          </div>
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
              <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
              <span>Traitement en cours...</span>
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Payer 3,00 € maintenant</span>
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
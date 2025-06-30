import React, { useEffect, useState } from 'react';
import { CheckCircle, Home, RefreshCw, Download, Copy } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getUserOrders } from '../services/stripe';

export function SuccessPage() {
  const { navigateToHome, navigateToGenerator, state } = useApp();
  const [isLoading, setIsLoading] = useState(true);
  const [orderData, setOrderData] = useState<any>(null);

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const orders = await getUserOrders();
        if (orders.length > 0) {
          setOrderData(orders[0]); // Get the most recent order
        }
      } catch (error) {
        console.error('Error fetching order data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderData();
  }, []);

  const handleCopyPhrase = async (phrase: string) => {
    try {
      await navigator.clipboard.writeText(phrase);
    } catch (err) {
      console.error('Failed to copy phrase:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Chargement de votre commande...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 sm:py-8">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Paiement réussi !
          </h1>
          <p className="text-base sm:text-lg text-gray-600 mb-2 px-4 sm:px-0">
            Votre pack de phrases d'accroche a été débloqué avec succès.
          </p>
          {orderData && (
            <div className="text-sm text-gray-500">
              Commande #{orderData.order_id} • {new Date(orderData.order_date).toLocaleDateString('fr-FR')}
            </div>
          )}
        </div>

        {/* Order Summary */}
        {orderData && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 mb-8">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
              Récapitulatif de votre commande
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Pack de phrases d'accroche</span>
                <span className="font-semibold text-gray-900">
                  ${(orderData.amount_total / 100).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Statut du paiement</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {orderData.payment_status}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Generated Phrases */}
        {state.generatedPhrases.length > 0 && (
          <div className="mb-8 sm:mb-12">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 text-center">
              Vos phrases d'accroche personnalisées
            </h3>
            <div className="space-y-3 sm:space-y-4">
              {state.generatedPhrases.map((phrase, index) => (
                <div
                  key={phrase.id}
                  className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between space-x-3 sm:space-x-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-3">
                        <span className="text-xs sm:text-sm font-medium text-purple-600 bg-purple-100 px-2 sm:px-3 py-1 rounded-full">
                          #{index + 1}
                        </span>
                      </div>
                      <blockquote className="text-base sm:text-lg font-medium text-gray-900 leading-relaxed break-words">
                        "{phrase.text}"
                      </blockquote>
                    </div>
                    <button
                      onClick={() => handleCopyPhrase(phrase.text)}
                      className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all flex-shrink-0"
                    >
                      <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="text-xs sm:text-sm font-medium hidden sm:inline">Copier</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Next Steps */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 sm:p-8 text-center text-white">
          <h3 className="text-xl sm:text-2xl font-bold mb-4">
            Prêt à conquérir le monde !
          </h3>
          <p className="text-purple-100 mb-6 text-base sm:text-lg">
            Utilisez ces phrases pour vos titres, vos slogans ou vos posts. 
            Revenez quand vous le souhaitez pour générer de nouvelles accroches !
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <button
              onClick={navigateToGenerator}
              className="inline-flex items-center justify-center space-x-2 bg-white text-purple-600 px-4 sm:px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors"
            >
              <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Générer d'autres phrases</span>
            </button>
            <button
              onClick={navigateToHome}
              className="inline-flex items-center justify-center space-x-2 bg-purple-500/20 text-white px-4 sm:px-6 py-3 rounded-lg font-semibold hover:bg-purple-500/30 transition-colors border border-purple-400/30"
            >
              <Home className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Retour à l'accueil</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
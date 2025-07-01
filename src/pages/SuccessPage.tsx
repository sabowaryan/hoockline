import React, { useEffect, useState } from 'react';
import { CheckCircle, Home, RefreshCw, Copy, Download, Star, ArrowRight, CreditCard, Calendar, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getUserOrders } from '../services/stripe';
import { products, formatPrice } from '../stripe-config';

export function SuccessPage() {
  const { navigateToHome, navigateToGenerator, state } = useApp();
  const [isLoading, setIsLoading] = useState(true);
  const [orderData, setOrderData] = useState<any>(null);
  const [copiedPhrases, setCopiedPhrases] = useState<Set<string>>(new Set());

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

  const handleCopyPhrase = async (phrase: string, phraseId: string) => {
    try {
      await navigator.clipboard.writeText(phrase);
      setCopiedPhrases(prev => new Set(prev).add(phraseId));
      
      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopiedPhrases(prev => {
          const newSet = new Set(prev);
          newSet.delete(phraseId);
          return newSet;
        });
      }, 2000);
    } catch (err) {
      console.error('Failed to copy phrase:', err);
    }
  };

  const handleDownloadPhrases = () => {
    if (state.generatedPhrases.length === 0) return;
    
    const content = [
      '🎯 Vos phrases d\'accroche Clicklone',
      '=' .repeat(40),
      '',
      `📝 Concept: "${state.generationRequest?.concept}"`,
      `🎨 Ton: ${state.generationRequest?.tone}`,
      `🌍 Langue: ${state.generationRequest?.language}`,
      '',
      '✨ Vos 10 phrases personnalisées:',
      '',
      ...state.generatedPhrases.map((phrase, index) => `${index + 1}. "${phrase.text}"`),
      '',
      '---',
      'Généré par Clicklone - https://clicklone.com',
      `Date: ${new Date().toLocaleDateString('fr-FR')}`
    ].join('\n');
    
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `clicklone-phrases-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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

  const product = products[0]; // Hookline product

  return (
    <div className="py-6 sm:py-8">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-green-600" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            🎉 Paiement réussi !
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-4 px-4 sm:px-0">
            Votre pack <span className="font-semibold text-purple-600">{product.name}</span> a été débloqué avec succès
          </p>
          {orderData && (
            <div className="inline-flex items-center space-x-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm">
              <CheckCircle className="w-4 h-4" />
              <span>Commande #{orderData.order_id} • {new Date(orderData.order_date).toLocaleDateString('fr-FR')}</span>
            </div>
          )}
        </div>

        {/* Order Summary */}
        {orderData && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 mb-8">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                <CreditCard className="w-5 h-5 text-purple-600" />
              </div>
              Récapitulatif de votre commande
            </h3>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600 flex items-center">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Produit
                  </span>
                  <span className="font-semibold text-gray-900">{product.name}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600 flex items-center">
                    <span className="w-4 h-4 mr-2">💰</span>
                    Prix
                  </span>
                  <span className="font-semibold text-gray-900">
                    ${(orderData.amount_total / 100).toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600 flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Statut
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    ✅ Payé
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600 flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    Date
                  </span>
                  <span className="font-semibold text-gray-900">
                    {new Date(orderData.order_date).toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <Star className="w-4 h-4 text-purple-600 mr-2" />
                  Ce que vous recevez :
                </h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-center">
                    <CheckCircle className="w-3 h-3 text-green-500 mr-2" />
                    10 phrases d'accroche uniques
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-3 h-3 text-green-500 mr-2" />
                    Générées par IA Gemini
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-3 h-3 text-green-500 mr-2" />
                    Copie en un clic
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-3 h-3 text-green-500 mr-2" />
                    Téléchargement possible
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-3 h-3 text-green-500 mr-2" />
                    Accès permanent
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Generated Phrases */}
        {state.generatedPhrases.length > 0 && (
          <div className="mb-8 sm:mb-12">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  Vos phrases d'accroche personnalisées
                </h3>
                <p className="text-gray-600">
                  Générées pour : <span className="font-medium">"{state.generationRequest?.concept}"</span>
                </p>
              </div>
              <button
                onClick={handleDownloadPhrases}
                className="mt-4 sm:mt-0 inline-flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Télécharger tout</span>
              </button>
            </div>
            
            <div className="space-y-3 sm:space-y-4">
              {state.generatedPhrases.map((phrase, index) => (
                <div
                  key={phrase.id}
                  className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all group"
                >
                  <div className="flex items-start justify-between space-x-3 sm:space-x-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-3">
                        <span className="text-xs sm:text-sm font-medium text-purple-600 bg-purple-100 px-2 sm:px-3 py-1 rounded-full">
                          #{index + 1}
                        </span>
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                          ))}
                        </div>
                      </div>
                      <blockquote className="text-base sm:text-lg font-medium text-gray-900 leading-relaxed break-words group-hover:text-purple-700 transition-colors">
                        "{phrase.text}"
                      </blockquote>
                    </div>
                    <button
                      onClick={() => handleCopyPhrase(phrase.text, phrase.id)}
                      className={`flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 rounded-lg transition-all flex-shrink-0 ${
                        copiedPhrases.has(phrase.id)
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600 hover:bg-purple-100 hover:text-purple-700'
                      }`}
                    >
                      {copiedPhrases.has(phrase.id) ? (
                        <>
                          <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="text-xs sm:text-sm font-medium hidden sm:inline">Copié !</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="text-xs sm:text-sm font-medium hidden sm:inline">Copier</span>
                        </>
                      )}
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
            🚀 Prêt à conquérir le monde !
          </h3>
          <p className="text-purple-100 mb-6 text-base sm:text-lg">
            Utilisez ces phrases pour vos titres, vos slogans ou vos posts. 
            Revenez quand vous le souhaitez pour générer de nouvelles accroches dans d'autres langues !
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <button
              onClick={navigateToGenerator}
              className="inline-flex items-center justify-center space-x-2 bg-white text-purple-600 px-4 sm:px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors group"
            >
              <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-180 transition-transform duration-500" />
              <span>Générer d'autres phrases</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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

        {/* Testimonial */}
        <div className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-gray-900 font-medium mb-1">
                "Clicklone m'a fait gagner des heures de brainstorming ! Les phrases générées sont parfaites pour mes campagnes."
              </p>
              <p className="text-gray-600 text-sm">
                - Sarah M., Marketing Manager
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { CheckCircle, Star, AlertTriangle, CreditCard, Shield, Clock } from 'lucide-react';
import { products, formatPrice } from '../../stripe-config';
import { isPaymentRequired, areFreeTrialsAllowed, getTrialLimit } from '../../services/settings';

interface PaymentInfoProps {
  variant?: 'card' | 'banner' | 'inline';
  showTrustIndicators?: boolean;
  className?: string;
}

export function PaymentInfo({ 
  variant = 'card', 
  showTrustIndicators = false, 
  className = '' 
}: PaymentInfoProps) {
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

  const product = products[0];

  if (loading) {
    return (
      <div className={`bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-white/20 rounded mb-2"></div>
          <div className="h-8 bg-white/20 rounded mb-2"></div>
          <div className="h-4 bg-white/20 rounded"></div>
        </div>
      </div>
    );
  }

  // Si le paiement n'est pas requis, afficher un message gratuit
  if (!paymentSettings.paymentRequired) {
    return (
      <div className={`bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 text-white ${className}`}>
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-300" />
            <span className="font-semibold">Gratuit</span>
          </div>
          <div className="text-3xl font-bold mb-2">0€</div>
          <div className="text-green-100 text-sm mb-3">
            Générez vos phrases d'accroche gratuitement
          </div>
          {showTrustIndicators && (
            <div className="flex items-center justify-center space-x-4 text-xs text-green-200">
              <div className="flex items-center space-x-1">
                <CheckCircle className="w-3 h-3" />
                <span>Accès illimité</span>
              </div>
              <div className="flex items-center space-x-1">
                <CheckCircle className="w-3 h-3" />
                <span>Génération instantanée</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Si les essais gratuits sont autorisés
  if (paymentSettings.freeTrialsAllowed) {
    return (
      <div className={`bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white relative overflow-hidden ${className}`}>
        <div className="absolute top-0 right-0 bg-yellow-400 text-purple-900 px-3 py-1 rounded-bl-lg text-xs font-bold">
          ESSAI GRATUIT
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Star className="w-5 h-5 text-yellow-300 fill-current" />
            <span className="font-semibold">Offre de lancement</span>
            <Star className="w-5 h-5 text-yellow-300 fill-current" />
          </div>
          <div className="text-3xl font-bold mb-2">{formatPrice(product.price)}</div>
          <div className="text-purple-100 text-sm mb-3">
            Pour 10 phrases d'accroche personnalisées
          </div>
          <div className="flex items-center justify-center space-x-4 text-xs text-purple-200">
            <div className="flex items-center space-x-1">
              <CheckCircle className="w-3 h-3" />
              <span>{paymentSettings.trialLimit} essais gratuits</span>
            </div>
            <div className="flex items-center space-x-1">
              <CheckCircle className="w-3 h-3" />
              <span>Accès immédiat</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Paiement requis sans essais gratuits
  return (
    <div className={`bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white relative overflow-hidden ${className}`}>
      <div className="absolute top-0 right-0 bg-yellow-400 text-purple-900 px-3 py-1 rounded-bl-lg text-xs font-bold">
        POPULAIRE
      </div>
      <div className="text-center">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Star className="w-5 h-5 text-yellow-300 fill-current" />
          <span className="font-semibold">Offre de lancement</span>
          <Star className="w-5 h-5 text-yellow-300 fill-current" />
        </div>
        <div className="text-3xl font-bold mb-2">{formatPrice(product.price)}</div>
        <div className="text-purple-100 text-sm mb-3">
          Pour 10 phrases d'accroche personnalisées
        </div>
        <div className="flex items-center justify-center space-x-4 text-xs text-purple-200">
          <div className="flex items-center space-x-1">
            <CheckCircle className="w-3 h-3" />
            <span>Paiement unique</span>
          </div>
          <div className="flex items-center space-x-1">
            <CheckCircle className="w-3 h-3" />
            <span>Accès immédiat</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Composant pour les indicateurs de confiance
export function TrustIndicators() {
  const [paymentSettings, setPaymentSettings] = useState({
    paymentRequired: true,
    freeTrialsAllowed: false,
    trialLimit: 1
  });

  useEffect(() => {
    loadPaymentSettings();
  }, []);

  const loadPaymentSettings = async () => {
    try {
      const [paymentRequired, freeTrialsAllowed] = await Promise.all([
        isPaymentRequired(),
        areFreeTrialsAllowed()
      ]);
      
      setPaymentSettings({
        paymentRequired,
        freeTrialsAllowed,
        trialLimit: 1
      });
    } catch (error) {
      console.error('Error loading payment settings:', error);
    }
  };

  const indicators = [
    { icon: Shield, text: 'Paiement sécurisé Stripe', color: 'text-green-500', show: true },
    { icon: Clock, text: 'Accès immédiat', color: 'text-blue-500', show: true },
    { icon: CreditCard, text: 'Sans abonnement', color: 'text-orange-500', show: !paymentSettings.paymentRequired || paymentSettings.freeTrialsAllowed }
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-600">
      {indicators.filter(indicator => indicator.show).map((indicator, index) => (
        <div key={index} className="flex items-center space-x-2">
          <indicator.icon className={`w-4 h-4 ${indicator.color}`} />
          <span>{indicator.text}</span>
        </div>
      ))}
    </div>
  );
} 
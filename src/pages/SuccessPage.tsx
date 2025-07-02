import React, { useEffect, useState } from 'react';
import { CheckCircle, ArrowRight, CreditCard, Star } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getUserOrders } from '../services/stripe';
import { products } from '../stripe-config';
import { useTranslation } from 'react-i18next';

export function SuccessPage() {
  const { navigateToHome, navigateToGenerator, state } = useApp();
  const [isLoading, setIsLoading] = useState(true);
  const [orderData, setOrderData] = useState<any>(null);
  const [countdown, setCountdown] = useState(3);
  const { t } = useTranslation();

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

  // Redirection automatique vers results après 3 secondes
  useEffect(() => {
    if (!isLoading && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      // Rediriger vers la page results avec les données générées
      window.location.href = '/results';
    }
  }, [countdown, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">{t('success.loading')}</p>
        </div>
      </div>
    );
  }

  const product = products[0]; // Hookline product

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center py-6 sm:py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Confirmation */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {t('success.title')}
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            {t('success.unlocked', { product: product.name })}
          </p>
          {orderData && (
            <div className="inline-flex items-center space-x-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm">
              <CheckCircle className="w-4 h-4" />
              <span>{t('success.order', { id: orderData.order_id, date: new Date(orderData.order_date).toLocaleDateString('fr-FR') })}</span>
            </div>
          )}
        </div>

        {/* Order Summary */}
        {orderData && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                <CreditCard className="w-5 h-5 text-purple-600" />
              </div>
              {t('success.summary')}
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600 flex items-center">
                  <CreditCard className="w-4 h-4 mr-2" />
                  {t('success.product')}
                </span>
                <span className="font-semibold text-gray-900">{product.name}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600 flex items-center">
                  <span className="w-4 h-4 mr-2">💰</span>
                  {t('success.price')}
                </span>
                <span className="font-semibold text-gray-900">
                  ${(orderData.amount_total / 100).toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {t('success.status')}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  ✅ {t('success.paid')}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Redirection Info */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-center text-white">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Star className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold mb-2">
            {t('success.redirecting')}
          </h3>
          <p className="text-purple-100 mb-4">
            {t('success.redirectDesc')}
          </p>
          <div className="text-3xl font-bold mb-4">
            {countdown}
          </div>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => window.location.href = '/results'}
              className="inline-flex items-center space-x-2 bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors"
            >
              <ArrowRight className="w-5 h-5" />
              <span>{t('success.viewResults')}</span>
            </button>
            <button
              onClick={navigateToHome}
              className="inline-flex items-center space-x-2 bg-purple-500/20 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-500/30 transition-colors border border-purple-400/30"
            >
              <span>{t('success.backHome')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
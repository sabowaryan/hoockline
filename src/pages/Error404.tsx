import React from 'react';
import { Home, ArrowLeft, Search, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';

export function Error404() {
  const navigate = useNavigate();
  const { navigateToHome } = useApp();
  const { t } = useTranslation();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigateToHome();
  };

  const handleSearch = () => {
    navigate('/generator');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center py-6 sm:py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Error Icon */}
        <div className="relative mb-8">
          <div className="absolute inset-0 w-32 h-32 bg-gradient-to-r from-red-400 to-orange-500 rounded-full mx-auto blur-xl opacity-20 animate-pulse"></div>
          <div className="relative w-24 h-24 bg-gradient-to-r from-red-500 to-orange-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
            <AlertTriangle className="w-12 h-12 text-white" />
          </div>
        </div>

        {/* Error Number */}
        <div className="text-8xl sm:text-9xl font-bold bg-gradient-to-r from-red-500 to-orange-600 bg-clip-text text-transparent mb-6">
          404
        </div>

        {/* Error Title */}
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          {t('error.404.title')}
        </h1>

        {/* Error Description */}
        <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-md mx-auto">
          {t('error.404.description')}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <button
            onClick={handleGoBack}
            className="inline-flex items-center justify-center space-x-3 bg-white text-gray-700 px-6 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-all transform hover:scale-105 shadow-lg border border-gray-200"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{t('error.404.goBack')}</span>
          </button>
          
          <button
            onClick={handleGoHome}
            className="inline-flex items-center justify-center space-x-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all transform hover:scale-105"
          >
            <Home className="w-5 h-5" />
            <span>{t('error.404.goHome')}</span>
          </button>
        </div>

        {/* Search Suggestion */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center">
              <Search className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              {t('error.404.searchTitle')}
            </h3>
          </div>
          <p className="text-gray-600 mb-4">
            {t('error.404.searchDescription')}
          </p>
          <button
            onClick={handleSearch}
            className="inline-flex items-center justify-center space-x-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all transform hover:scale-105"
          >
            <Search className="w-5 h-5" />
            <span>{t('error.404.startGenerating')}</span>
          </button>
        </div>

        {/* Helpful Links */}
        <div className="mt-8 text-sm text-gray-500">
          <p className="mb-2">{t('error.404.helpfulLinks')}:</p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="text-purple-600 hover:text-purple-700 font-medium hover:underline"
            >
              {t('error.404.homePage')}
            </button>
            <button
              onClick={() => navigate('/generator')}
              className="text-purple-600 hover:text-purple-700 font-medium hover:underline"
            >
              {t('error.404.generator')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 
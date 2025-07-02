import React from 'react';
import { Home, ArrowLeft, RefreshCw, AlertTriangle, Server, Wifi, Search } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';

interface ErrorPageProps {
  errorCode?: string;
  title?: string;
  description?: string;
  showGoBack?: boolean;
  showRefresh?: boolean;
  showSearch?: boolean;
  customActions?: React.ReactNode;
}

export function ErrorPage({
  errorCode,
  title,
  description,
  showGoBack = true,
  showRefresh = true,
  showSearch = true,
  customActions
}: ErrorPageProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { navigateToHome } = useApp();
  const { t } = useTranslation();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigateToHome();
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleSearch = () => {
    navigate('/generator');
  };

  // Détecter automatiquement le type d'erreur basé sur l'URL ou les paramètres
  const detectErrorType = (): string => {
    // Si un code d'erreur est fourni en props, l'utiliser
    if (errorCode) {
      return errorCode;
    }

    // Vérifier les paramètres d'URL
    const urlParams = new URLSearchParams(location.search);
    const urlErrorCode = urlParams.get('code');
    if (urlErrorCode) {
      return urlErrorCode;
    }

    // Par défaut, afficher une erreur générique
    return 'generic';
  };

  const detectedErrorCode = detectErrorType();

  // Déterminer l'icône et la couleur selon le code d'erreur
  const getErrorStyle = () => {
    switch (detectedErrorCode) {
      case '404':
        return {
          icon: AlertTriangle,
          color: 'from-red-500 to-orange-600',
          bgColor: 'from-red-400 to-orange-500'
        };
      case '500':
        return {
          icon: Server,
          color: 'from-red-500 to-orange-600',
          bgColor: 'from-red-400 to-orange-500'
        };
      case '403':
        return {
          icon: AlertTriangle,
          color: 'from-yellow-500 to-orange-600',
          bgColor: 'from-yellow-400 to-orange-500'
        };
      case '401':
        return {
          icon: AlertTriangle,
          color: 'from-blue-500 to-cyan-600',
          bgColor: 'from-blue-400 to-cyan-500'
        };
      default:
        return {
          icon: AlertTriangle,
          color: 'from-gray-500 to-gray-600',
          bgColor: 'from-gray-400 to-gray-500'
        };
    }
  };

  const errorStyle = getErrorStyle();
  const IconComponent = errorStyle.icon;

  // Titre et description par défaut
  const defaultTitle = title || t(`error.${detectedErrorCode}.title`, { defaultValue: t('error.generic.title') });
  const defaultDescription = description || t(`error.${detectedErrorCode}.description`, { defaultValue: t('error.generic.description') });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center py-6 sm:py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Error Icon */}
        <div className="relative mb-8">
          <div className={`absolute inset-0 w-32 h-32 bg-gradient-to-r ${errorStyle.bgColor} rounded-full mx-auto blur-xl opacity-20 animate-pulse`}></div>
          <div className={`relative w-24 h-24 bg-gradient-to-r ${errorStyle.color} rounded-full flex items-center justify-center mx-auto shadow-lg`}>
            <IconComponent className="w-12 h-12 text-white" />
          </div>
        </div>

        {/* Error Number */}
        <div className={`text-8xl sm:text-9xl font-bold bg-gradient-to-r ${errorStyle.color} bg-clip-text text-transparent mb-6`}>
          {detectedErrorCode === 'generic' ? 'ERROR' : detectedErrorCode}
        </div>

        {/* Error Title */}
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          {defaultTitle}
        </h1>

        {/* Error Description */}
        <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-md mx-auto">
          {defaultDescription}
        </p>

        {/* Custom Actions */}
        {customActions && (
          <div className="mb-8">
            {customActions}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          {showGoBack && (
            <button
              onClick={handleGoBack}
              className="inline-flex items-center justify-center space-x-3 bg-white text-gray-700 px-6 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-all transform hover:scale-105 shadow-lg border border-gray-200"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>{t('error.generic.goBack')}</span>
            </button>
          )}
          
          {showRefresh && (
            <button
              onClick={handleRefresh}
              className="inline-flex items-center justify-center space-x-3 bg-white text-gray-700 px-6 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-all transform hover:scale-105 shadow-lg border border-gray-200"
            >
              <RefreshCw className="w-5 h-5" />
              <span>{t('error.generic.refresh')}</span>
            </button>
          )}
          
          <button
            onClick={handleGoHome}
            className="inline-flex items-center justify-center space-x-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all transform hover:scale-105"
          >
            <Home className="w-5 h-5" />
            <span>{t('error.generic.goHome')}</span>
          </button>
        </div>

        {/* Search Suggestion */}
        {showSearch && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center">
                <Search className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                {t('error.generic.searchTitle')}
              </h3>
            </div>
            <p className="text-gray-600 mb-4">
              {t('error.generic.searchDescription')}
            </p>
            <button
              onClick={handleSearch}
              className="inline-flex items-center justify-center space-x-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all transform hover:scale-105"
            >
              <Search className="w-5 h-5" />
              <span>{t('error.generic.startGenerating')}</span>
            </button>
          </div>
        )}

        {/* Helpful Links */}
        <div className="mt-8 text-sm text-gray-500">
          <p className="mb-2">{t('error.generic.helpfulLinks')}:</p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="text-purple-600 hover:text-purple-700 font-medium hover:underline"
            >
              {t('error.generic.homePage')}
            </button>
            <button
              onClick={() => navigate('/generator')}
              className="text-purple-600 hover:text-purple-700 font-medium hover:underline"
            >
              {t('error.generic.generator')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 
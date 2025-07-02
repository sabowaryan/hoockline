import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useErrorHandler } from '../hooks/useErrorHandler';

export function TestErrorPage() {
  const navigate = useNavigate();
  const { handleError, handleNetworkError, handleAuthError, handlePermissionError, handleServerError } = useErrorHandler();

  const testError404 = () => {
    navigate('/error?code=404');
  };

  const testError500 = () => {
    navigate('/error?code=500');
  };

  const testError403 = () => {
    navigate('/error?code=403');
  };

  const testError401 = () => {
    navigate('/error?code=401');
  };

  const testNetworkError = () => {
    handleNetworkError(new Error('Failed to fetch data from server'));
  };

  const testAuthError = () => {
    handleAuthError(new Error('User not authenticated'));
  };

  const testPermissionError = () => {
    handlePermissionError(new Error('Access denied: insufficient permissions'));
  };

  const testServerError = () => {
    handleServerError(new Error('Internal server error: database connection failed'));
  };

  const testGenericError = () => {
    handleError('This is a generic error message');
  };

  const testErrorWithDetails = () => {
    handleError({
      type: 'server',
      message: 'Custom server error',
      details: 'This is a detailed error description',
      code: 'CUSTOM_001'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Test des Pages d'Erreur
          </h1>
          <p className="text-lg text-gray-600">
            Testez les différentes pages d'erreur et la gestion d'erreurs de l'application
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Navigation Tests */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Navigation Directe</h3>
            <div className="space-y-3">
              <button
                onClick={testError404}
                className="w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                Test 404
              </button>
              <button
                onClick={testError500}
                className="w-full bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Test 500
              </button>
              <button
                onClick={testError403}
                className="w-full bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
              >
                Test 403
              </button>
              <button
                onClick={testError401}
                className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Test 401
              </button>
            </div>
          </div>

          {/* Error Handler Tests */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Gestionnaire d'Erreurs</h3>
            <div className="space-y-3">
              <button
                onClick={testNetworkError}
                className="w-full bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
              >
                Erreur Réseau
              </button>
              <button
                onClick={testAuthError}
                className="w-full bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors"
              >
                Erreur Auth
              </button>
              <button
                onClick={testPermissionError}
                className="w-full bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition-colors"
              >
                Erreur Permission
              </button>
              <button
                onClick={testServerError}
                className="w-full bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Erreur Serveur
              </button>
            </div>
          </div>

          {/* Generic Error Tests */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Erreurs Génériques</h3>
            <div className="space-y-3">
              <button
                onClick={testGenericError}
                className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                Erreur Générique
              </button>
              <button
                onClick={testErrorWithDetails}
                className="w-full bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors"
              >
                Erreur avec Détails
              </button>
            </div>
          </div>
        </div>

        {/* Error Boundary Test */}
        <div className="mt-8 bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Error Boundary</h3>
          <p className="text-gray-600 mb-4">
            Cliquez sur les boutons ci-dessous pour déclencher différents types d'erreurs qui seront capturées par l'ErrorBoundary.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => {
                throw new Error('Test error triggered by button click');
              }}
              className="bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold"
            >
              Erreur JavaScript Générique
            </button>
            <button
              onClick={() => {
                throw new Error('Network error: Failed to fetch data');
              }}
              className="bg-orange-600 text-white px-4 py-3 rounded-lg hover:bg-orange-700 transition-colors font-semibold"
            >
              Erreur Réseau
            </button>
            <button
              onClick={() => {
                throw new Error('Authentication error: User not logged in');
              }}
              className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Erreur Auth
            </button>
            <button
              onClick={() => {
                throw new Error('Permission error: Access denied');
              }}
              className="bg-yellow-600 text-white px-4 py-3 rounded-lg hover:bg-yellow-700 transition-colors font-semibold"
            >
              Erreur Permission
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 rounded-2xl p-6 border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Instructions</h3>
          <div className="text-blue-800 space-y-2">
            <p><strong>Navigation Directe :</strong> Redirige directement vers les pages d'erreur spécifiques</p>
            <p><strong>Gestionnaire d'Erreurs :</strong> Utilise le hook useErrorHandler pour gérer les erreurs et rediriger automatiquement</p>
            <p><strong>Erreurs Génériques :</strong> Teste la gestion d'erreurs avec des messages personnalisés</p>
            <p><strong>Error Boundary :</strong> Déclenche une erreur JavaScript pour tester la capture d'erreurs</p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all transform hover:scale-105"
          >
            Retour à l'Accueil
          </button>
        </div>
      </div>
    </div>
  );
} 
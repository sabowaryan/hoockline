import React from 'react';
import { Shield, AlertTriangle, Home, Mail } from 'lucide-react';

export function UnauthorizedAccess() {
  const handleSignOut = async () => {
    const { supabase } = await import('../../lib/supabase');
    await supabase.auth.signOut();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
          {/* Warning Icon */}
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-red-600" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Accès non autorisé
          </h1>

          {/* Description */}
          <div className="space-y-4 mb-8">
            <div className="flex items-start space-x-3 p-4 bg-red-50 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="text-left">
                <p className="text-sm font-medium text-red-900 mb-1">
                  Accès administrateur requis
                </p>
                <p className="text-sm text-red-700">
                  Cette application est réservée aux administrateurs. Votre compte utilisateur n'a pas les permissions nécessaires pour accéder à cette interface.
                </p>
              </div>
            </div>

            <p className="text-gray-600 text-sm">
              Si vous pensez qu'il s'agit d'une erreur, veuillez contacter l'administrateur système pour obtenir les droits d'accès appropriés.
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={handleSignOut}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-red-500/25 transition-all transform hover:scale-105"
            >
              Se déconnecter
            </button>

            <div className="flex items-center justify-center space-x-4 text-sm">
              <a
                href="mailto:admin@clicklone.com"
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>Contacter l'admin</span>
              </a>
              <span className="text-gray-300">•</span>
              <a
                href="#aide"
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Home className="w-4 h-4" />
                <span>Centre d'aide</span>
              </a>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Code d'erreur: UNAUTHORIZED_ACCESS<br />
              Si le problème persiste, contactez le support technique.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
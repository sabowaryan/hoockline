import React, { useState } from 'react';
import { Copy, CheckCircle, Home, RefreshCw, Globe } from 'lucide-react';
import { useApp } from '../context/AppContext';

const languageNames: Record<string, string> = {
  'fr': 'Français',
  'en': 'English',
  'es': 'Español',
  'de': 'Deutsch',
  'it': 'Italiano',
  'pt': 'Português'
};

export function Results() {
  const { state, navigateToHome, copyPhrase } = useApp();
  const [copiedPhrases, setCopiedPhrases] = useState<Set<string>>(new Set());

  const handleCopy = async (phrase: string, phraseId: string) => {
    await copyPhrase(phrase);
    setCopiedPhrases(prev => new Set(prev).add(phraseId));
    
    // Reset copied state after 2 seconds
    setTimeout(() => {
      setCopiedPhrases(prev => {
        const newSet = new Set(prev);
        newSet.delete(phraseId);
        return newSet;
      });
    }, 2000);
  };

  if (!state.generatedPhrases.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Aucune phrase générée</p>
          <button
            onClick={navigateToHome}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <header className="py-4 sm:py-6">
        <div className="flex items-center justify-between">
          <button
            onClick={navigateToHome}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <Home className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base">Accueil</span>
          </button>
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg">
              <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
            </div>
            <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Clicklone
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-6 sm:py-8">
        <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Vos phrases d'accroche sont prêtes !
            </h1>
            <p className="text-base sm:text-lg text-gray-600 mb-2 px-4 sm:px-0">
              Voici vos 10 phrases personnalisées pour : 
              <span className="font-semibold text-gray-900 block sm:inline">
                {state.generationRequest?.concept}
              </span>
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4 text-gray-500 text-sm sm:text-base">
              <span className="capitalize">
                Ton {state.generationRequest?.tone}
              </span>
              <span className="hidden sm:inline">•</span>
              <div className="flex items-center space-x-2">
                <Globe className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>
                  {languageNames[state.generationRequest?.language || 'fr'] || state.generationRequest?.language}
                </span>
              </div>
            </div>
          </div>

          {/* Generated Phrases */}
          <div className="space-y-3 sm:space-y-4 mb-8 sm:mb-12">
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
                    onClick={() => handleCopy(phrase.text, phrase.id)}
                    className={`flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 rounded-lg transition-all flex-shrink-0 ${
                      copiedPhrases.has(phrase.id)
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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

          {/* Final Message & CTA */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 sm:p-8 text-center text-white">
            <h3 className="text-xl sm:text-2xl font-bold mb-4">
              C'est parti pour conquérir le monde !
            </h3>
            <p className="text-purple-100 mb-6 text-base sm:text-lg">
              Utilisez ces phrases pour vos titres, vos slogans ou vos posts. 
              Revenez quand vous le souhaitez pour générer de nouvelles accroches dans d'autres langues !
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <button
                onClick={navigateToHome}
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
      </main>
    </>
  );
}
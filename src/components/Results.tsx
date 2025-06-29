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
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center">
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <button
            onClick={navigateToHome}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <Home className="w-5 h-5" />
            <span>Accueil</span>
          </button>
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Clicklone
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Vos phrases d'accroche sont prêtes !
            </h1>
            <p className="text-lg text-gray-600 mb-2">
              Voici vos 10 phrases personnalisées pour : 
              <span className="font-semibold text-gray-900">
                {state.generationRequest?.concept}
              </span>
            </p>
            <div className="flex items-center justify-center space-x-4 text-gray-500">
              <span className="capitalize">
                Ton {state.generationRequest?.tone}
              </span>
              <span>•</span>
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4" />
                <span>
                  {languageNames[state.generationRequest?.language || 'fr'] || state.generationRequest?.language}
                </span>
              </div>
            </div>
          </div>

          {/* Generated Phrases */}
          <div className="space-y-4 mb-12">
            {state.generatedPhrases.map((phrase, index) => (
              <div
                key={phrase.id}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between space-x-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <span className="text-sm font-medium text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
                        #{index + 1}
                      </span>
                    </div>
                    <blockquote className="text-lg font-medium text-gray-900 leading-relaxed">
                      "{phrase.text}"
                    </blockquote>
                  </div>
                  <button
                    onClick={() => handleCopy(phrase.text, phrase.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                      copiedPhrases.has(phrase.id)
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {copiedPhrases.has(phrase.id) ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">Copié !</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span className="text-sm font-medium">Copier</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Final Message & CTA */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-center text-white">
            <h3 className="text-2xl font-bold mb-4">
              C'est parti pour conquérir le monde !
            </h3>
            <p className="text-purple-100 mb-6 text-lg">
              Utilisez ces phrases pour vos titres, vos slogans ou vos posts. 
              Revenez quand vous le souhaitez pour générer de nouvelles accroches dans d'autres langues !
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={navigateToHome}
                className="inline-flex items-center space-x-2 bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
                <span>Générer d'autres phrases</span>
              </button>
              <button
                onClick={navigateToHome}
                className="inline-flex items-center space-x-2 bg-purple-500/20 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-500/30 transition-colors border border-purple-400/30"
              >
                <Home className="w-5 h-5" />
                <span>Retour à l'accueil</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
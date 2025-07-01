import React, { useState, useEffect } from 'react';
import { Copy, CheckCircle, Home, RefreshCw, Globe, Sparkles, Zap, ArrowRight, Star } from 'lucide-react';
import { useApp } from '../context/AppContext';

const languageNames: Record<string, string> = {
  'fr': 'Français',
  'en': 'English',
  'es': 'Español',
  'de': 'Deutsch',
  'it': 'Italiano',
  'pt': 'Português'
};

export function ResultsPage() {
  const { state, navigateToHome, copyPhrase } = useApp();
  const [copiedPhrases, setCopiedPhrases] = useState<Set<string>>(new Set());
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    // Animation d'entrée
    setAnimateIn(true);
  }, []);

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-pink-50">
        <div className="text-center p-8">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Aucune phrase générée</h2>
          <p className="text-gray-600 mb-6">Commencez par générer vos phrases d'accroche personnalisées</p>
          <button
            onClick={navigateToHome}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all transform hover:scale-105"
          >
            <span className="flex items-center space-x-2">
              <Zap className="w-5 h-5" />
              <span>Commencer la génération</span>
            </span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-6 sm:py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header avec animation */}
        <div className={`text-center mb-12 transition-all duration-1000 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="relative">
            {/* Cercle de fond animé */}
            <div className="absolute inset-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mx-auto blur-xl opacity-20 animate-pulse"></div>
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
            </div>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
            Vos phrases d'accroche sont prêtes !
          </h1>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-xl border border-white/20 mb-8">
            <p className="text-lg sm:text-xl text-gray-700 mb-4">
              Voici vos <span className="font-bold text-purple-600">10 phrases personnalisées</span> pour :
            </p>
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-4 mb-4">
              <p className="text-lg sm:text-xl font-semibold text-gray-900">
                "{state.generationRequest?.concept}"
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-6 text-gray-600">
              <div className="flex items-center space-x-2 bg-purple-100 px-4 py-2 rounded-full">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span className="font-medium capitalize">
                  Ton {state.generationRequest?.tone}
                </span>
              </div>
              <div className="flex items-center space-x-2 bg-pink-100 px-4 py-2 rounded-full">
                <Globe className="w-4 h-4 text-pink-600" />
                <span className="font-medium">
                  {languageNames[state.generationRequest?.language || 'fr'] || state.generationRequest?.language}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Generated Phrases avec animations */}
        <div className="space-y-4 sm:space-y-6 mb-12">
          {state.generatedPhrases.map((phrase, index) => (
            <div
              key={phrase.id}
              className={`bg-white/90 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-500 transform hover:scale-[1.02] ${
                animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between space-x-4 sm:space-x-6">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-md">
                      #{index + 1}
                    </div>
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < 3 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                      ))}
                    </div>
                  </div>
                  <blockquote className="text-lg sm:text-xl font-semibold text-gray-900 leading-relaxed break-words relative">
                    <span className="absolute -left-2 top-0 text-4xl text-purple-200">"</span>
                    <span className="pl-4">{phrase.text}</span>
                    <span className="absolute -right-2 bottom-0 text-4xl text-purple-200">"</span>
                  </blockquote>
                </div>
                <button
                  onClick={() => handleCopy(phrase.text, phrase.id)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-xl transition-all duration-300 flex-shrink-0 transform hover:scale-105 ${
                    copiedPhrases.has(phrase.id)
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                      : 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 hover:from-purple-200 hover:to-pink-200'
                  }`}
                >
                  {copiedPhrases.has(phrase.id) ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-semibold">Copié !</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5" />
                      <span className="font-semibold">Copier</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Final Message & CTA amélioré */}
        <div className={`bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 rounded-3xl p-8 sm:p-12 text-center text-white shadow-2xl border border-purple-500/20 transition-all duration-1000 ${
          animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="relative">
            {/* Éléments décoratifs */}
            <div className="absolute top-0 left-0 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
            <div className="absolute bottom-0 right-0 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
            
            <div className="relative">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-2xl sm:text-3xl font-bold mb-6">
                C'est parti pour conquérir le monde ! 🚀
              </h3>
              <p className="text-purple-100 mb-8 text-lg leading-relaxed max-w-2xl mx-auto">
                Utilisez ces phrases pour vos titres, vos slogans ou vos posts. 
                Revenez quand vous le souhaitez pour générer de nouvelles accroches dans d'autres langues !
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={navigateToHome}
                  className="group inline-flex items-center justify-center space-x-3 bg-white text-purple-600 px-6 py-4 rounded-xl font-semibold hover:bg-purple-50 transition-all transform hover:scale-105 shadow-lg"
                >
                  <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                  <span>Générer d'autres phrases</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={navigateToHome}
                  className="inline-flex items-center justify-center space-x-3 bg-white/20 text-white px-6 py-4 rounded-xl font-semibold hover:bg-white/30 transition-all transform hover:scale-105 border border-white/30"
                >
                  <Home className="w-5 h-5" />
                  <span>Retour à l'accueil</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


import React, { useState } from 'react';
import { ArrowLeft, Wand2, Loader2, ArrowRight, AlertTriangle, Globe } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Tone } from '../types';

const tones: { value: Tone; label: string; description: string }[] = [
  { value: 'humoristique', label: 'Humoristique', description: 'Amusant et décalé' },
  { value: 'inspirant', label: 'Inspirant', description: 'Motivant et positif' },
  { value: 'direct', label: 'Direct et Bref', description: 'Efficace et percutant' },
  { value: 'mysterieux', label: 'Mystérieux', description: 'Intriguant et curieux' },
  { value: 'luxueux', label: 'Luxueux', description: 'Élégant et premium' },
  { value: 'techy', label: 'Technologique', description: 'Innovant et moderne' },
];

const languages = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
];

export function Generator() {
  const { state, navigateToHome, generatePhrases, navigateToPayment } = useApp();
  const [concept, setConcept] = useState('');
  const [selectedTone, setSelectedTone] = useState<Tone>('inspirant');
  const [selectedLanguage, setSelectedLanguage] = useState('fr');

  const handleGenerate = async () => {
    if (!concept.trim()) return;
    
    await generatePhrases({
      concept: concept.trim(),
      tone: selectedTone,
      language: selectedLanguage,
    });
  };

  const canGenerate = concept.trim() && !state.isGenerating;
  const hasGenerated = state.generatedPhrases.length > 0 && !state.isGenerating;

  return (
    <>
      {/* Header */}
      <header className="py-4 sm:py-6">
        <div className="flex items-center justify-between">
          <button
            onClick={navigateToHome}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base">Retour</span>
          </button>
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg">
              <Wand2 className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
            </div>
            <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Clicklone
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-6 sm:py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Créons vos phrases d'accroche
            </h1>
            <p className="text-base sm:text-lg text-gray-600 px-4 sm:px-0">
              Décrivez votre concept et choisissez le ton qui vous correspond
            </p>
            
            {/* AI Status Indicator */}
            <div className="mt-4 flex justify-center">
              <div className="flex items-center space-x-2 bg-green-100 text-green-700 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm">
                <Wand2 className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Générateur IA intelligent</span>
              </div>
            </div>
          </div>

          <div className="space-y-6 sm:space-y-8">
            {/* Error Message */}
            {state.error && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 sm:p-6">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 flex-shrink-0" />
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-red-900 mb-1">
                      Erreur de génération
                    </h3>
                    <p className="text-sm sm:text-base text-red-700">{state.error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Concept Input */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
              <label className="block text-base sm:text-lg font-semibold text-gray-900 mb-4">
                Décrivez votre concept ou produit
              </label>
              <textarea
                value={concept}
                onChange={(e) => setConcept(e.target.value)}
                placeholder="Ex: Application de gestion de projet avec IA, Service de livraison ultra-rapide, Plateforme de formation en ligne..."
                className="w-full h-24 sm:h-32 px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-500 text-sm sm:text-base"
                disabled={state.isGenerating}
                maxLength={200}
              />
              <div className="text-xs sm:text-sm text-gray-500 mt-2">
                {concept.length}/200 caractères
              </div>
            </div>

            {/* Language Selection */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
              <label className="block text-base sm:text-lg font-semibold text-gray-900 mb-4">
                <Globe className="w-4 h-4 sm:w-5 sm:h-5 inline mr-2" />
                Choisissez votre langue
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {languages.map((language) => (
                  <button
                    key={language.code}
                    onClick={() => setSelectedLanguage(language.code)}
                    disabled={state.isGenerating}
                    className={`text-left p-3 sm:p-4 rounded-xl border-2 transition-all ${
                      selectedLanguage === language.code
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    } ${state.isGenerating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <span className="text-lg sm:text-2xl">{language.flag}</span>
                      <div>
                        <div className="font-semibold text-gray-900 text-sm sm:text-base">
                          {language.name}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Tone Selection */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
              <label className="block text-base sm:text-lg font-semibold text-gray-900 mb-4">
                Choisissez votre ton
              </label>
              <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-3">
                {tones.map((tone) => (
                  <button
                    key={tone.value}
                    onClick={() => setSelectedTone(tone.value)}
                    disabled={state.isGenerating}
                    className={`text-left p-3 sm:p-4 rounded-xl border-2 transition-all ${
                      selectedTone === tone.value
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    } ${state.isGenerating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <div className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">
                      {tone.label}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600">
                      {tone.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <div className="text-center">
              <button
                onClick={handleGenerate}
                disabled={!canGenerate}
                className={`inline-flex items-center space-x-2 sm:space-x-3 px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-semibold transition-all ${
                  canGenerate
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/25 transform hover:scale-105'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                {state.isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                    <span>L'IA génère vos phrases...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline">Générer 10 phrases d'accroche avec IA</span>
                    <span className="sm:hidden">Générer avec IA</span>
                  </>
                )}
              </button>
            </div>

            {/* Success Message & Payment Button */}
            {hasGenerated && (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-6 sm:p-8 text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Wand2 className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-green-900 mb-2">
                  Vos 10 phrases d'accroche sont prêtes !
                </h3>
                <p className="text-sm sm:text-base text-green-700 mb-6">
                  Générées par notre IA - Débloquez votre pack personnalisé pour seulement 3€
                </p>
                <button
                  onClick={navigateToPayment}
                  className="inline-flex items-center space-x-2 sm:space-x-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all transform hover:scale-105"
                >
                  <span className="hidden sm:inline">Payer 3€ pour voir et copier les phrases</span>
                  <span className="sm:hidden">Payer 3€ pour débloquer</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
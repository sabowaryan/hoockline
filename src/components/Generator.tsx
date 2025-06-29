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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <button
            onClick={navigateToHome}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Retour</span>
          </button>
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg">
              <Wand2 className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Clicklone
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Créons vos phrases d'accroche
            </h1>
            <p className="text-lg text-gray-600">
              Décrivez votre concept et choisissez le ton qui vous correspond
            </p>
            
            {/* AI Status Indicator */}
            <div className="mt-4 flex justify-center">
              <div className="flex items-center space-x-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm">
                <Wand2 className="w-4 h-4" />
                <span>Générateur IA intelligent</span>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {/* Error Message */}
            {state.error && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                  <div>
                    <h3 className="text-lg font-semibold text-red-900 mb-1">
                      Erreur de génération
                    </h3>
                    <p className="text-red-700">{state.error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Concept Input */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <label className="block text-lg font-semibold text-gray-900 mb-4">
                Décrivez votre concept ou produit
              </label>
              <textarea
                value={concept}
                onChange={(e) => setConcept(e.target.value)}
                placeholder="Ex: Application de gestion de projet avec IA, Service de livraison ultra-rapide, Plateforme de formation en ligne..."
                className="w-full h-32 px-4 py-3 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                disabled={state.isGenerating}
                maxLength={200}
              />
              <div className="text-sm text-gray-500 mt-2">
                {concept.length}/200 caractères
              </div>
            </div>

            {/* Language Selection */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <label className="block text-lg font-semibold text-gray-900 mb-4">
                <Globe className="w-5 h-5 inline mr-2" />
                Choisissez votre langue
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {languages.map((language) => (
                  <button
                    key={language.code}
                    onClick={() => setSelectedLanguage(language.code)}
                    disabled={state.isGenerating}
                    className={`text-left p-4 rounded-xl border-2 transition-all ${
                      selectedLanguage === language.code
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    } ${state.isGenerating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{language.flag}</span>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {language.name}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Tone Selection */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <label className="block text-lg font-semibold text-gray-900 mb-4">
                Choisissez votre ton
              </label>
              <div className="grid md:grid-cols-2 gap-3">
                {tones.map((tone) => (
                  <button
                    key={tone.value}
                    onClick={() => setSelectedTone(tone.value)}
                    disabled={state.isGenerating}
                    className={`text-left p-4 rounded-xl border-2 transition-all ${
                      selectedTone === tone.value
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    } ${state.isGenerating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <div className="font-semibold text-gray-900 mb-1">
                      {tone.label}
                    </div>
                    <div className="text-sm text-gray-600">
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
                className={`inline-flex items-center space-x-3 px-8 py-4 rounded-xl text-lg font-semibold transition-all ${
                  canGenerate
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/25 transform hover:scale-105'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                {state.isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>L'IA génère vos phrases...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5" />
                    <span>Générer 10 phrases d'accroche avec IA</span>
                  </>
                )}
              </button>
            </div>

            {/* Success Message & Payment Button */}
            {hasGenerated && (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Wand2 className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-green-900 mb-2">
                  Vos 10 phrases d'accroche sont prêtes !
                </h3>
                <p className="text-green-700 mb-6">
                  Générées par notre IA - Débloquez votre pack personnalisé pour seulement 3€
                </p>
                <button
                  onClick={navigateToPayment}
                  className="inline-flex items-center space-x-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all transform hover:scale-105"
                >
                  <span>Payer 3€ pour voir et copier les phrases</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
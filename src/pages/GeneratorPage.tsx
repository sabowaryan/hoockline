import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Wand2, 
  Loader2, 
  ArrowRight, 
  AlertTriangle, 
  Globe, 
  CheckCircle, 
  Star,
  Sparkles,
  Zap,
  Crown,
  Brain,
  Target,
  Eye,
  Rocket,
  Laugh,
  Heart,
  Search,
  Palette,
  Languages
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Tone } from '../types';
import { products, formatPrice } from '../stripe-config';
import { StepNavigation } from '../components/StepNavigation';

const tones: { value: Tone; label: string; description: string; icon: React.ComponentType<any>; color: string }[] = [
  { 
    value: 'humoristique', 
    label: 'Humoristique', 
    description: 'Amusant et décalé', 
    icon: Laugh,
    color: 'from-yellow-400 to-orange-500'
  },
  { 
    value: 'inspirant', 
    label: 'Inspirant', 
    description: 'Motivant et positif', 
    icon: Heart,
    color: 'from-pink-400 to-rose-500'
  },
  { 
    value: 'direct', 
    label: 'Direct et Bref', 
    description: 'Efficace et percutant', 
    icon: Zap,
    color: 'from-blue-400 to-cyan-500'
  },
  { 
    value: 'mysterieux', 
    label: 'Mystérieux', 
    description: 'Intriguant et curieux', 
    icon: Eye,
    color: 'from-purple-400 to-indigo-500'
  },
  { 
    value: 'luxueux', 
    label: 'Luxueux', 
    description: 'Élégant et premium', 
    icon: Crown,
    color: 'from-amber-400 to-yellow-500'
  },
  { 
    value: 'techy', 
    label: 'Technologique', 
    description: 'Innovant et moderne', 
    icon: Rocket,
    color: 'from-emerald-400 to-teal-500'
  },
];

const languages = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
];

export function GeneratorPage() {
  const { state, generatePhrases, navigateToPayment, navigateToHome, checkPaymentStatus } = useApp();
  const [concept, setConcept] = useState('');
  const [selectedTone, setSelectedTone] = useState<Tone>('humoristique');
  const [selectedLanguage, setSelectedLanguage] = useState('fr');
  const [animateIn, setAnimateIn] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState<{
    paymentRequired: boolean;
    freeTrialsAllowed: boolean;
    trialLimit: number;
    trialCount: number;
  }>({
    paymentRequired: true,
    freeTrialsAllowed: false,
    trialLimit: 1,
    trialCount: 0
  });

  useEffect(() => {
    setAnimateIn(true);
    loadPaymentInfo();
  }, []);

  const loadPaymentInfo = async () => {
    try {
      const { canGenerate, reason } = await checkPaymentStatus();
      
      // Charger les informations de paiement depuis localStorage
      const trialCount = parseInt(localStorage.getItem('trial_count') || '0');
      const hasPaid = localStorage.getItem('payment_completed') === 'true';
      
      // Ces valeurs seront utilisées pour l'affichage, la logique réelle est dans checkPaymentStatus
      setPaymentInfo({
        paymentRequired: !canGenerate && !hasPaid,
        freeTrialsAllowed: trialCount > 0,
        trialLimit: 1, // Valeur par défaut, sera mise à jour si nécessaire
        trialCount
      });
    } catch (error) {
      console.error('Error loading payment info:', error);
    }
  };

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

  // Afficher les informations de paiement
  const renderPaymentInfo = () => {
    if (!paymentInfo.paymentRequired) {
      return (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 mb-8 shadow-lg">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-base font-semibold text-green-900">Génération gratuite</p>
              <p className="text-sm text-green-700">Vous pouvez générer vos phrases gratuitement</p>
            </div>
          </div>
        </div>
      );
    }

    if (paymentInfo.freeTrialsAllowed && paymentInfo.trialCount < paymentInfo.trialLimit) {
      return (
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl p-6 mb-8 shadow-lg">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center">
              <Star className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-base font-semibold text-blue-900">Essai gratuit disponible</p>
              <p className="text-sm text-blue-700">
                {paymentInfo.trialCount + 1}/{paymentInfo.trialLimit} essais gratuits
              </p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-2xl p-6 mb-8 shadow-lg">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-600 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-base font-semibold text-orange-900">Paiement requis pour voir les résultats</p>
            <p className="text-sm text-orange-700">
              Générez vos phrases maintenant, puis payez {formatPrice(products[0].price)} pour les débloquer
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-6 sm:py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header amélioré */}
        <div className={`text-center mb-8 sm:mb-12 transition-all duration-1000 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex items-center justify-center mb-6">
            <button
              onClick={navigateToHome}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-all transform hover:scale-105 mr-6"
            >
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg">
                <ArrowLeft className="w-5 h-5" />
              </div>
            </button>
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                Générateur IA
              </h1>
              <p className="text-lg sm:text-xl text-gray-600">
                Créez vos phrases d'accroche personnalisées avec l'intelligence artificielle
              </p>
            </div>
          </div>
        </div>

        {/* Payment Info */}
        {renderPaymentInfo()}

        {/* Error Message amélioré */}
        {state.error && (
          <div className="bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-2xl p-6 mb-8 shadow-lg">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-rose-600 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-base font-semibold text-red-900 mb-2">Erreur</p>
                <p className="text-sm text-red-700 mb-4">{state.error}</p>
                {state.error.includes('paiement') && (
                  <button
                    onClick={navigateToPayment}
                    className="bg-gradient-to-r from-red-600 to-rose-600 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:shadow-lg transition-all transform hover:scale-105"
                  >
                    Procéder au paiement
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Concept Input amélioré */}
        <div className={`bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 mb-8 transition-all duration-1000 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <label className="block text-lg font-semibold text-gray-900">
                Votre concept ou produit
              </label>
              <p className="text-sm text-gray-600">Décrivez ce que vous voulez promouvoir</p>
            </div>
          </div>
          <textarea
            value={concept}
            onChange={(e) => setConcept(e.target.value)}
            placeholder="Ex: Application de méditation, Service de livraison, Plateforme de freelancing..."
            className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 resize-none text-lg transition-all"
            rows={4}
          />
          <p className="text-sm text-gray-500 mt-3 flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-purple-500" />
            <span>Décrivez votre concept en quelques mots pour que l'IA puisse créer des phrases adaptées</span>
          </p>
        </div>

        {/* Tone Selection amélioré */}
        <div className={`bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 mb-8 transition-all duration-1000 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ animationDelay: '200ms' }}>
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
              <Palette className="w-6 h-6 text-white" />
            </div>
            <div>
              <label className="block text-lg font-semibold text-gray-900">
                Choisissez votre ton
              </label>
              <p className="text-sm text-gray-600">Sélectionnez l'ambiance de vos phrases</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {tones.map((tone) => {
              const IconComponent = tone.icon;
              const isSelected = selectedTone === tone.value;
              return (
                <button
                  key={tone.value}
                  onClick={() => setSelectedTone(tone.value)}
                  className={`group p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                    isSelected
                      ? `border-purple-500 bg-gradient-to-r ${tone.color} text-white shadow-lg`
                      : 'border-gray-200 hover:border-gray-300 text-gray-700 bg-white hover:shadow-md'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      isSelected 
                        ? 'bg-white/20' 
                        : `bg-gradient-to-r ${tone.color} text-white`
                    }`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-semibold">{tone.label}</div>
                      <div className={`text-xs mt-1 ${isSelected ? 'text-white/80' : 'text-gray-500'}`}>
                        {tone.description}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Language Selection amélioré */}
        <div className={`bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 mb-8 transition-all duration-1000 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ animationDelay: '400ms' }}>
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
              <Languages className="w-6 h-6 text-white" />
            </div>
            <div>
              <label className="block text-lg font-semibold text-gray-900">
                Langue de génération
              </label>
              <p className="text-sm text-gray-600">Choisissez la langue de vos phrases</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setSelectedLanguage(lang.code)}
                className={`group p-4 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                  selectedLanguage === lang.code
                    ? 'border-purple-500 bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700 bg-white hover:shadow-md'
                }`}
              >
                <div className="flex flex-col items-center space-y-2">
                  <div className="text-2xl">{lang.flag}</div>
                  <div className="text-sm font-semibold">{lang.name}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button amélioré */}
        <div className={`transition-all duration-1000 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ animationDelay: '600ms' }}>
          <button
            onClick={handleGenerate}
            disabled={!canGenerate}
            className={`w-full flex items-center justify-center space-x-3 py-6 rounded-2xl text-xl font-bold transition-all duration-300 ${
              canGenerate
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            {state.isGenerating ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                <span>Génération en cours...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-6 h-6" />
                <span>Générer mes phrases d'accroche</span>
                <ArrowRight className="w-6 h-6" />
              </>
            )}
          </button>
        </div>

        {/* Step Navigation */}
        <div className="mt-12">
          <StepNavigation />
        </div>
      </div>
    </div>
  );
} 
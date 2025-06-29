import React from 'react';
import { Zap, ArrowRight, Sparkles, Target, Lightbulb } from 'lucide-react';
import { useApp } from '../context/AppContext';

const examples = [
  {
    concept: "Application de méditation",
    tone: "audacieux",
    hookline: "Détendez-vous ou la vie vous mordra."
  },
  {
    concept: "Application de méditation",
    tone: "minimaliste",
    hookline: "Respirez. Créez. Répétez."
  },
  {
    concept: "Plateforme de freelancing",
    tone: "inspirant",
    hookline: "Transformez vos compétences en liberté financière."
  },
  {
    concept: "Service de livraison",
    tone: "direct",
    hookline: "Votre commande. Chez vous. En 30 minutes."
  }
];

export function HomePage() {
  const { navigateToGenerator } = useApp();

  return (
    <>
      {/* Header */}
      <header className="py-4 sm:py-6">
        <div className="flex items-center space-x-2">
          <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg">
            <Zap className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
          </div>
          <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Clicklone
          </span>
        </div>
      </header>

      {/* Hero Section */}
      <main className="py-8 sm:py-12">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="flex items-center space-x-2 bg-purple-100 px-3 sm:px-4 py-2 rounded-full">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="text-xs sm:text-sm font-medium text-purple-700">
                Générateur IA de phrases d'accroche
              </span>
            </div>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
            Trouvez votre
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent block">
              slogan parfait
            </span>
            en 1 clic
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed px-4 sm:px-0">
            Fini les heures passées à chercher LA phrase qui accroche. Notre IA génère 10 slogans percutants 
            adaptés à votre concept et votre ton en quelques secondes.
          </p>

          <button
            onClick={navigateToGenerator}
            className="group inline-flex items-center space-x-2 sm:space-x-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-200 transform hover:scale-105"
          >
            <span>Générer ma phrase d'accroche</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Examples Section */}
        <div className="mt-16 sm:mt-20">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Voici ce que Clicklone peut faire pour vous
            </h2>
            <p className="text-gray-600 text-base sm:text-lg">
              Des exemples réels générés par notre IA
            </p>
          </div>

          <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
            {examples.map((example, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      {index % 2 === 0 ? (
                        <Target className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      ) : (
                        <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      )}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-3">
                      <span className="text-xs sm:text-sm font-medium text-gray-500 bg-gray-100 px-2 sm:px-3 py-1 rounded-full">
                        {example.concept}
                      </span>
                      <span className="text-xs sm:text-sm font-medium text-purple-600 bg-purple-100 px-2 sm:px-3 py-1 rounded-full">
                        Ton {example.tone}
                      </span>
                    </div>
                    <blockquote className="text-base sm:text-lg font-semibold text-gray-900 leading-relaxed">
                      "{example.hookline}"
                    </blockquote>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="mt-16 sm:mt-20 grid sm:grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
              Génération instantanée
            </h3>
            <p className="text-sm sm:text-base text-gray-600">
              10 phrases d'accroche uniques générées en moins de 5 secondes
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Target className="w-6 h-6 sm:w-8 sm:h-8 text-pink-600" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
              Tons personnalisés
            </h3>
            <p className="text-sm sm:text-base text-gray-600">
              6 tons différents pour s'adapter parfaitement à votre marque
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
              Prêt à l'emploi
            </h3>
            <p className="text-sm sm:text-base text-gray-600">
              Copiez-collez directement vos phrases favorites où vous voulez
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
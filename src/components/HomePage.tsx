import React from 'react';
import { Zap, ArrowRight, Sparkles, Target, Lightbulb, CheckCircle, Star, Shield, Clock, Globe, CreditCard } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { products, formatPrice } from '../stripe-config';

const examples = [
  {
    concept: "Application de méditation",
    tone: "humoristique",
    hookline: "Détendez-vous ou la vie vous mordra."
  },
  {
    concept: "Application de méditation",
    tone: "inspirant",
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

const features = [
  {
    icon: Zap,
    title: "Génération instantanée",
    description: "10 phrases d'accroche uniques générées en moins de 5 secondes",
    color: "purple"
  },
  {
    icon: Target,
    title: "Tons personnalisés",
    description: "6 tons différents pour s'adapter parfaitement à votre marque",
    color: "pink"
  },
  {
    icon: Globe,
    title: "Multi-langues",
    description: "Génération native dans 6 langues avec adaptation culturelle",
    color: "blue"
  },
  {
    icon: Sparkles,
    title: "Prêt à l'emploi",
    description: "Copiez-collez directement vos phrases favorites où vous voulez",
    color: "indigo"
  },
  {
    icon: Shield,
    title: "Paiement sécurisé",
    description: "Transaction protégée par Stripe avec chiffrement SSL",
    color: "green"
  },
  {
    icon: Clock,
    title: "Accès immédiat",
    description: "Débloquez vos phrases instantanément après le paiement",
    color: "orange"
  }
];

const testimonials = [
  {
    name: "Sarah M.",
    role: "Marketing Manager",
    content: "Clicklone m'a fait gagner des heures de brainstorming ! Les phrases générées sont parfaites pour mes campagnes.",
    rating: 5
  },
  {
    name: "Thomas L.",
    role: "Entrepreneur",
    content: "Interface intuitive et résultats bluffants. J'ai trouvé mon slogan parfait en 2 minutes !",
    rating: 5
  },
  {
    name: "Marie D.",
    role: "Freelance Copywriter",
    content: "Un outil indispensable pour débloquer ma créativité. Les 6 tons disponibles couvrent tous mes besoins.",
    rating: 5
  }
];

export function HomePage() {
  const { navigateToGenerator } = useApp();
  const product = products[0]; // Hookline product

  return (
    <>
      {/* Hero Section */}
      <section className="py-12 sm:py-16 lg:py-20">
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

          {/* Enhanced Pricing highlight */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 mb-8 text-white max-w-md mx-auto relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-yellow-400 text-purple-900 px-3 py-1 rounded-bl-lg text-xs font-bold">
              POPULAIRE
            </div>
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Star className="w-5 h-5 text-yellow-300 fill-current" />
              <span className="font-semibold">Offre de lancement</span>
              <Star className="w-5 h-5 text-yellow-300 fill-current" />
            </div>
            <div className="text-3xl font-bold mb-2">{formatPrice(product.price)}</div>
            <div className="text-purple-100 text-sm mb-3">
              Pour 10 phrases d'accroche personnalisées
            </div>
            <div className="flex items-center justify-center space-x-4 text-xs text-purple-200">
              <div className="flex items-center space-x-1">
                <CheckCircle className="w-3 h-3" />
                <span>Paiement unique</span>
              </div>
              <div className="flex items-center space-x-1">
                <CheckCircle className="w-3 h-3" />
                <span>Accès immédiat</span>
              </div>
            </div>
          </div>

          <button
            onClick={navigateToGenerator}
            className="group inline-flex items-center space-x-2 sm:space-x-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-200 transform hover:scale-105"
          >
            <span>Générer ma phrase d'accroche</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Enhanced trust indicators */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-green-500" />
              <span>Paiement sécurisé Stripe</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-blue-500" />
              <span>Accès immédiat</span>
            </div>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span>IA Gemini</span>
            </div>
            <div className="flex items-center space-x-2">
              <CreditCard className="w-4 h-4 text-orange-500" />
              <span>Sans abonnement</span>
            </div>
          </div>
        </div>
      </section>

      {/* Examples Section */}
      <section className="py-12 sm:py-16">
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
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Pourquoi choisir Clicklone ?
          </h2>
          <p className="text-gray-600 text-base sm:text-lg">
            La solution complète pour vos phrases d'accroche
          </p>
        </div>

        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const colorClasses = {
              purple: 'bg-purple-100 text-purple-600',
              pink: 'bg-pink-100 text-pink-600',
              blue: 'bg-blue-100 text-blue-600',
              indigo: 'bg-indigo-100 text-indigo-600',
              green: 'bg-green-100 text-green-600',
              orange: 'bg-orange-100 text-orange-600'
            };

            return (
              <div key={index} className="text-center">
                <div className={`w-12 h-12 sm:w-16 sm:h-16 ${colorClasses[feature.color]} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <feature.icon className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 sm:py-16">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Ce que disent nos utilisateurs
          </h2>
          <p className="text-gray-600 text-base sm:text-lg">
            Rejoignez des centaines d'entrepreneurs satisfaits
          </p>
        </div>

        <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <blockquote className="text-gray-900 mb-4 leading-relaxed">
                "{testimonial.content}"
              </blockquote>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 sm:py-16">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Questions fréquentes
          </h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {[
            {
              question: "Comment fonctionne le paiement ?",
              answer: "Le paiement est sécurisé par Stripe. Vous payez une seule fois $3.99 et accédez immédiatement à vos 10 phrases personnalisées. Aucun abonnement, aucun frais caché."
            },
            {
              question: "Puis-je utiliser les phrases commercialement ?",
              answer: "Oui, absolument ! Une fois achetées, les phrases vous appartiennent et vous pouvez les utiliser librement pour vos projets commerciaux, publicités, sites web, etc."
            },
            {
              question: "Dans quelles langues puis-je générer des phrases ?",
              answer: "Clicklone supporte 6 langues : français, anglais, espagnol, allemand, italien et portugais. L'IA s'adapte aux nuances culturelles de chaque langue."
            },
            {
              question: "Que se passe-t-il si je ne suis pas satisfait ?",
              answer: "Nous garantissons votre satisfaction. Si les phrases générées ne vous conviennent pas, contactez-nous dans les 24h pour un remboursement complet."
            }
          ].map((faq, index) => (
            <details key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <summary className="font-semibold text-gray-900 cursor-pointer hover:text-purple-600 transition-colors">
                {faq.question}
              </summary>
              <p className="mt-3 text-gray-600 leading-relaxed">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 sm:p-12 text-center text-white max-w-4xl mx-auto relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-4 left-4 w-8 h-8 border-2 border-white rounded-full"></div>
            <div className="absolute top-8 right-8 w-4 h-4 bg-white rounded-full"></div>
            <div className="absolute bottom-8 left-8 w-6 h-6 border-2 border-white rounded-full"></div>
            <div className="absolute bottom-4 right-4 w-3 h-3 bg-white rounded-full"></div>
          </div>
          <div className="relative z-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              Prêt à créer des phrases qui convertissent ?
            </h2>
            <p className="text-purple-100 text-lg mb-8">
              Rejoignez les entrepreneurs qui utilisent déjà Clicklone pour booster leurs ventes
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button
                onClick={navigateToGenerator}
                className="bg-white text-purple-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-purple-50 transition-colors transform hover:scale-105"
              >
                Commencer maintenant - {formatPrice(product.price)}
              </button>
              <div className="flex items-center space-x-2 text-purple-200 text-sm">
                <Shield className="w-4 h-4" />
                <span>Paiement sécurisé • Satisfaction garantie</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  ArrowRight, 
  Sparkles, 
  Target, 
  Lightbulb, 
  CheckCircle, 
  Star, 
  Shield, 
  Clock, 
  Globe, 
  CreditCard,
  Brain,
  Rocket,
  Heart,
  Eye,
  Crown,
  Laugh,
  Users,
  TrendingUp,
  Award
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { products, formatPrice } from '../stripe-config';
import { isPaymentRequired, areFreeTrialsAllowed, getTrialLimit } from '../services/settings';

const examples = [
  {
    concept: "Application de méditation",
    tone: "humoristique",
    hookline: "Détendez-vous ou la vie vous mordra.",
    icon: Laugh,
    color: "from-yellow-400 to-orange-500"
  },
  {
    concept: "Application de méditation",
    tone: "inspirant",
    hookline: "Respirez. Créez. Répétez.",
    icon: Heart,
    color: "from-pink-400 to-rose-500"
  },
  {
    concept: "Plateforme de freelancing",
    tone: "inspirant",
    hookline: "Transformez vos compétences en liberté financière.",
    icon: Rocket,
    color: "from-blue-400 to-cyan-500"
  },
  {
    concept: "Service de livraison",
    tone: "direct",
    hookline: "Votre commande. Chez vous. En 30 minutes.",
    icon: Zap,
    color: "from-purple-400 to-indigo-500"
  }
];

const features = [
  {
    icon: Brain,
    title: "IA  avancée",
    description: "Technologie de pointe pour des phrases créatives et percutantes",
    color: "from-purple-500 to-pink-600"
  },
  {
    icon: Target,
    title: "6 tons personnalisés",
    description: "Humoristique, inspirant, direct, mystérieux, luxueux, technologique",
    color: "from-pink-500 to-rose-600"
  },
  {
    icon: Globe,
    title: "6 langues natives",
    description: "Français, anglais, espagnol, allemand, italien, portugais",
    color: "from-blue-500 to-cyan-600"
  },
  {
    icon: Zap,
    title: "Génération instantanée",
    description: "10 phrases uniques générées en moins de 5 secondes",
    color: "from-indigo-500 to-purple-600"
  },
  {
    icon: Shield,
    title: "Paiement sécurisé",
    description: "Transaction protégée par Stripe avec chiffrement SSL",
    color: "from-green-500 to-emerald-600"
  },
  {
    icon: Clock,
    title: "Accès immédiat",
    description: "Débloquez vos phrases instantanément après le paiement",
    color: "from-orange-500 to-amber-600"
  }
];

const testimonials = [
  {
    name: "Sarah M.",
    role: "Marketing Manager",
    content: "Clicklone m'a fait gagner des heures de brainstorming ! Les phrases générées sont parfaites pour mes campagnes.",
    rating: 5,
    avatar: "SM"
  },
  {
    name: "Thomas L.",
    role: "Entrepreneur",
    content: "Interface intuitive et résultats bluffants. J'ai trouvé mon slogan parfait en 2 minutes !",
    rating: 5,
    avatar: "TL"
  },
  {
    name: "Marie D.",
    role: "Freelance Copywriter",
    content: "Un outil indispensable pour débloquer ma créativité. Les 6 tons disponibles couvrent tous mes besoins.",
    rating: 5,
    avatar: "MD"
  }
];

const stats = [
  { number: "10K+", label: "Phrases générées", icon: Sparkles },
  { number: "2K+", label: "Utilisateurs satisfaits", icon: Users },
  { number: "98%", label: "Taux de satisfaction", icon: TrendingUp },
  { number: "6", label: "Langues disponibles", icon: Globe }
];

export function HomePage() {
  const { navigateToGenerator } = useApp();
  const [paymentSettings, setPaymentSettings] = useState({
    paymentRequired: true,
    freeTrialsAllowed: false,
    trialLimit: 1
  });
  const [loading, setLoading] = useState(true);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    setAnimateIn(true);
    loadPaymentSettings();
  }, []);

  const loadPaymentSettings = async () => {
    try {
      const [paymentRequired, freeTrialsAllowed, trialLimit] = await Promise.all([
        isPaymentRequired(),
        areFreeTrialsAllowed(),
        getTrialLimit()
      ]);
      
      setPaymentSettings({
        paymentRequired,
        freeTrialsAllowed,
        trialLimit
      });
    } catch (error) {
      console.error('Error loading payment settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const product = products[0]; // Hookline product

  // Fonction pour afficher conditionnellement les informations de paiement
  const renderPaymentInfo = () => {
    if (loading) {
      return (
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-8 mb-12 text-white max-w-lg mx-auto relative overflow-hidden shadow-2xl">
          <div className="animate-pulse">
            <div className="h-8 bg-white/20 rounded mb-3"></div>
            <div className="h-12 bg-white/20 rounded mb-3"></div>
            <div className="h-6 bg-white/20 rounded mb-4"></div>
            <div className="h-4 bg-white/20 rounded"></div>
          </div>
        </div>
      );
    }

    if (!paymentSettings.paymentRequired) {
      return (
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl p-8 mb-12 text-white max-w-lg mx-auto relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-bl-3xl text-sm font-bold">
            GRATUIT
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">Génération gratuite</span>
            </div>
            <div className="text-5xl font-bold mb-4">0€</div>
            <div className="text-green-100 text-lg mb-6">
              Générez vos phrases d'accroche gratuitement
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm text-green-200">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4" />
                <span>Accès illimité</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4" />
                <span>Génération instantanée</span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (paymentSettings.freeTrialsAllowed) {
      return (
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-8 mb-12 text-white max-w-lg mx-auto relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 bg-yellow-400 text-purple-900 px-4 py-2 rounded-bl-3xl text-sm font-bold">
            ESSAI GRATUIT
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-300 fill-current" />
              </div>
              <span className="text-xl font-bold">Offre de lancement</span>
            </div>
            <div className="text-5xl font-bold mb-4">{formatPrice(product.price)}</div>
            <div className="text-purple-100 text-lg mb-6">
              Pour 10 phrases d'accroche personnalisées
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm text-purple-200">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4" />
                <span>{paymentSettings.trialLimit} essais gratuits</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4" />
                <span>Accès immédiat</span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Paiement requis sans essais gratuits
    return (
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-8 mb-12 text-white max-w-lg mx-auto relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 bg-yellow-400 text-purple-900 px-4 py-2 rounded-bl-3xl text-sm font-bold">
          POPULAIRE
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Award className="w-6 h-6 text-yellow-300" />
            </div>
            <span className="text-xl font-bold">Offre premium</span>
          </div>
          <div className="text-5xl font-bold mb-4">{formatPrice(product.price)}</div>
          <div className="text-purple-100 text-lg mb-6">
            Pour 10 phrases d'accroche personnalisées
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm text-purple-200">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <span>Paiement unique</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <span>Accès immédiat</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Fonction pour afficher conditionnellement les indicateurs de confiance
  const renderTrustIndicators = () => {
    const indicators = [
      { icon: Shield, text: 'Paiement sécurisé Stripe', color: 'text-green-500', show: true },
      { icon: Clock, text: 'Accès immédiat', color: 'text-blue-500', show: true },
      { icon: Brain, text: 'IA Avancée', color: 'text-purple-500', show: true },
      { icon: CreditCard, text: 'Sans abonnement', color: 'text-orange-500', show: !paymentSettings.paymentRequired || paymentSettings.freeTrialsAllowed }
    ];

    return (
      <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600">
        {indicators.filter(indicator => indicator.show).map((indicator, index) => (
          <div key={index} className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
            <indicator.icon className={`w-4 h-4 ${indicator.color}`} />
            <span className="font-medium">{indicator.text}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Hero Section */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="text-center max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`transition-all duration-1000 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="flex justify-center mb-6">
              <div className="flex items-center space-x-3 bg-gradient-to-r from-purple-100 to-pink-100 px-6 py-3 rounded-full border border-purple-200">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-semibold text-purple-700">
                  Générateur IA de phrases d'accroche
                </span>
              </div>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Trouvez votre
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent block">
                slogan parfait
              </span>
              en 1 clic
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Fini les heures passées à chercher LA phrase qui accroche. Notre IA génère 10 slogans percutants 
              adaptés à votre concept et votre ton en quelques secondes.
            </p>

            {/* Enhanced Pricing highlight */}
            {renderPaymentInfo()}

            <button
              onClick={navigateToGenerator}
              className="group inline-flex items-center space-x-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-2xl text-lg font-bold hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105"
            >
              <span>Générer ma phrase d'accroche</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
            </button>

            {/* Enhanced trust indicators */}
            {renderTrustIndicators()}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className={`text-center transition-all duration-1000 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ animationDelay: `${index * 200}ms` }}>
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Examples Section */}
      <section className="py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-12 transition-all duration-1000 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ animationDelay: '400ms' }}>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Voici ce que Clicklone peut faire pour vous
            </h2>
            <p className="text-gray-600 text-lg sm:text-xl max-w-2xl mx-auto">
              Des exemples réels générés par notre IA
            </p>
          </div>

          <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-8">
            {examples.map((example, index) => {
              const IconComponent = example.icon;
              return (
                <div
                  key={index}
                  className={`bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-500 transform hover:scale-105 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                  style={{ animationDelay: `${600 + index * 200}ms` }}
                >
                  <div className="flex items-start space-x-6">
                    <div className="flex-shrink-0">
                      <div className={`w-16 h-16 bg-gradient-to-r ${example.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {example.concept}
                      </h3>
                      <p className="text-sm text-gray-500 mb-4 capitalize font-medium">
                        Ton {example.tone}
                      </p>
                      <blockquote className="text-lg text-gray-700 italic leading-relaxed">
                        "{example.hookline}"
                      </blockquote>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-12 transition-all duration-1000 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ animationDelay: '600ms' }}>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Pourquoi choisir Clicklone ?
            </h2>
            <p className="text-gray-600 text-lg sm:text-xl max-w-2xl mx-auto">
              Tout ce dont vous avez besoin pour créer des phrases d'accroche percutantes
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-500 transform hover:scale-105 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ animationDelay: `${800 + index * 100}ms` }}
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-12 transition-all duration-1000 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ animationDelay: '800ms' }}>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Ce que disent nos utilisateurs
            </h2>
            <p className="text-gray-600 text-lg sm:text-xl max-w-2xl mx-auto">
              Des milliers de professionnels nous font confiance
            </p>
          </div>

          <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-500 transform hover:scale-105 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ animationDelay: `${1000 + index * 200}ms` }}
              >
                <div className="flex items-center mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-gray-700 mb-6 text-lg leading-relaxed">
                  "{testimonial.content}"
                </blockquote>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">
                      {testimonial.name}
                    </div>
                    <div className="text-gray-500 text-sm">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center transition-all duration-1000 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ animationDelay: '1200ms' }}>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Prêt à créer vos phrases d'accroche ?
            </h2>
            <p className="text-gray-600 text-lg sm:text-xl mb-10 max-w-2xl mx-auto">
              Rejoignez des milliers de professionnels qui utilisent Clicklone pour leurs campagnes
            </p>
            <button
              onClick={navigateToGenerator}
              className="group inline-flex items-center space-x-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-2xl text-lg font-bold hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105"
            >
              <span>Commencer maintenant</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
} 
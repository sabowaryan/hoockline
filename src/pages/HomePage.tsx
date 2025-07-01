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
import { useTranslation } from 'react-i18next';

const examples = [
  {
    concept: "home.examples.meditation.concept",
    tone: "humoristique",
    hookline: "home.examples.meditation.humorous",
    icon: Laugh,
    color: "from-yellow-400 to-orange-500"
  },
  {
    concept: "home.examples.meditation.concept",
    tone: "inspirant",
    hookline: "home.examples.meditation.inspiring",
    icon: Heart,
    color: "from-pink-400 to-rose-500"
  },
  {
    concept: "home.examples.freelancing.concept",
    tone: "inspirant",
    hookline: "home.examples.freelancing.inspiring",
    icon: Rocket,
    color: "from-blue-400 to-cyan-500"
  },
  {
    concept: "home.examples.delivery.concept",
    tone: "direct",
    hookline: "home.examples.delivery.direct",
    icon: Zap,
    color: "from-purple-400 to-indigo-500"
  }
];

const features = [
  {
    icon: Brain,
    title: "home.features.ai.title",
    description: "home.features.ai.description",
    color: "from-purple-500 to-pink-600"
  },
  {
    icon: Target,
    title: "home.features.tones.title",
    description: "home.features.tones.description",
    color: "from-pink-500 to-rose-600"
  },
  {
    icon: Globe,
    title: "home.features.languages.title",
    description: "home.features.languages.description",
    color: "from-blue-500 to-cyan-600"
  },
  {
    icon: Zap,
    title: "home.features.instant.title",
    description: "home.features.instant.description",
    color: "from-indigo-500 to-purple-600"
  },
  {
    icon: Shield,
    title: "home.features.secure.title",
    description: "home.features.secure.description",
    color: "from-green-500 to-emerald-600"
  },
  {
    icon: Clock,
    title: "home.features.access.title",
    description: "home.features.access.description",
    color: "from-orange-500 to-amber-600"
  }
];

// Témoignages mockés multilingues
const testimonialsMock = {
  fr: [
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
  ],
  en: [
    {
      name: "Sarah M.",
      role: "Marketing Manager",
      content: "Clicklone saved me hours of brainstorming! The generated phrases are perfect for my campaigns.",
      rating: 5,
      avatar: "SM"
    },
    {
      name: "Thomas L.",
      role: "Entrepreneur",
      content: "Intuitive interface and amazing results. I found my perfect slogan in 2 minutes!",
      rating: 5,
      avatar: "TL"
    },
    {
      name: "Marie D.",
      role: "Freelance Copywriter",
      content: "An essential tool to unlock my creativity. The 6 available tones cover all my needs.",
      rating: 5,
      avatar: "MD"
    }
  ]
};

const stats = [
  { number: "10K+", label: "home.stats.phrases", icon: Sparkles },
  { number: "2K+", label: "home.stats.users", icon: Users },
  { number: "98%", label: "home.stats.satisfaction", icon: TrendingUp },
  { number: "6", label: "home.stats.languages", icon: Globe }
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
  const { t, i18n } = useTranslation();
  const lang = (i18n.language === 'fr' || i18n.language === 'en') ? i18n.language : 'en';
  const testimonials: Array<{ name: string; role: string; content: string; rating: number; avatar: string }> = testimonialsMock[lang];

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
            {t('home.payment.free')}
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">{t('home.payment.freeTitle')}</span>
            </div>
            <div className="text-5xl font-bold mb-4">0€</div>
            <div className="text-green-100 text-lg mb-6">
              {t('home.payment.freeDescription')}
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm text-green-200">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4" />
                <span>{t('home.payment.unlimited')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4" />
                <span>{t('home.features.instant.title')}</span>
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
            {t('home.payment.trial')}
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-300 fill-current" />
              </div>
              <span className="text-xl font-bold">{t('home.payment.trialTitle')}</span>
            </div>
            <div className="text-5xl font-bold mb-4">{formatPrice(product.price)}</div>
            <div className="text-purple-100 text-lg mb-6">
              {t('home.payment.trialDescription')}
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm text-purple-200">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4" />
                <span>{paymentSettings.trialLimit} {t('home.payment.trialCount')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4" />
                <span>{t('home.trust.instantAccess')}</span>
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
          {t('home.payment.popular')}
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Award className="w-6 h-6 text-yellow-300" />
            </div>
            <span className="text-xl font-bold">{t('home.payment.premiumTitle')}</span>
          </div>
          <div className="text-5xl font-bold mb-4">{formatPrice(product.price)}</div>
          <div className="text-purple-100 text-lg mb-6">
            {t('home.payment.premiumDescription')}
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm text-purple-200">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <span>{t('home.payment.oneTime')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <span>{t('home.trust.instantAccess')}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Fonction pour afficher conditionnellement les indicateurs de confiance
  const renderTrustIndicators = () => {
    const indicators = [
      { icon: Shield, text: t('home.trust.securePayment'), color: 'text-green-500', show: true },
      { icon: Clock, text: t('home.trust.instantAccess'), color: 'text-blue-500', show: true },
      { icon: Brain, text: t('home.trust.advancedAI'), color: 'text-purple-500', show: true },
      { icon: CreditCard, text: t('home.trust.noSubscription'), color: 'text-orange-500', show: !paymentSettings.paymentRequired || paymentSettings.freeTrialsAllowed }
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
                  {t('home.hero.subtitle')}
                </span>
              </div>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              {t('home.hero.title')}
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent block">
                {t('home.hero.cta')}
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              {t('home.hero.description')}
            </p>

            {/* Enhanced Pricing highlight */}
            {renderPaymentInfo()}

            <button
              onClick={navigateToGenerator}
              className="group inline-flex items-center space-x-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-2xl text-lg font-bold hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105"
            >
              <span>{t('home.hero.cta')}</span>
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
                  <div className="text-gray-600 font-medium">{t(stat.label)}</div>
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
              {t('home.examples.title')}
            </h2>
            <p className="text-gray-600 text-lg sm:text-xl max-w-2xl mx-auto">
              {t('home.examples.subtitle')}
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
                        {t(example.concept)}
                      </h3>
                      <p className="text-sm text-gray-500 mb-4 capitalize font-medium">
                        {t('home.examples.tone', { tone: example.tone })}
                      </p>
                      <blockquote className="text-lg text-gray-700 italic leading-relaxed">
                        "{t(example.hookline)}"
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
              {t('home.features.title')}
            </h2>
            <p className="text-gray-600 text-lg sm:text-xl max-w-2xl mx-auto">
              {t('home.features.subtitle')}
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
                  {t(feature.title)}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {t(feature.description)}
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
              {t('home.testimonials.title')}
            </h2>
            <p className="text-gray-600 text-lg sm:text-xl max-w-2xl mx-auto">
              {t('home.testimonials.subtitle')}
            </p>
          </div>

          <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial: typeof testimonials[0], index: number) => (
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
              {t('home.cta.title')}
            </h2>
            <p className="text-gray-600 text-lg sm:text-xl mb-10 max-w-2xl mx-auto">
              {t('home.cta.subtitle')}
            </p>
            <button
              onClick={navigateToGenerator}
              className="group inline-flex items-center space-x-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-2xl text-lg font-bold hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105"
            >
              <span>{t('home.cta.button')}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
} 
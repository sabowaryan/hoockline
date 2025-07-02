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
  Award,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { products, formatPrice } from '../stripe-config';
import { useTranslation } from 'react-i18next';
import { getAppStats, AppStats,  } from '../services/analytic';
import { tones } from '../data/tones';
import { languages } from '../data/languages';
import { Analytics } from '../services/analytics';

// Interface pour le statut de paiement (cohérente avec GenerationStatus)
interface PaymentStatus {
  canGenerate: boolean;
  requiresPayment: boolean;
  reason?: string;
  trialCount?: number;
  trialLimit?: number;
  showResults: boolean;
}

// Interface pour les features
interface Feature {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  color: string;
  badge: ((appStats: AppStats | null) => string) | string | null;
}

// Exemples d'utilisation
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

// Fonction pour générer les features dynamiquement
const getFeatures = (appStats: AppStats | null): Feature[] => [
  {
    icon: Brain,
    title: "home.features.ai.title",
    description: "home.features.ai.description",
    color: "from-purple-500 to-pink-600",
    badge: null
  },
  {
    icon: Target,
    title: "home.features.tones.title",
    description: "home.features.tones.description",
    color: "from-pink-500 to-rose-600",
    badge: (appStats: AppStats | null) => appStats ? `${appStats.tonesCount}` : `${tones.length}`
  },
  {
    icon: Globe,
    title: "home.features.languages.title",
    description: "home.features.languages.description",
    color: "from-blue-500 to-cyan-600",
    badge: (appStats: AppStats | null) => appStats ? `${appStats.languagesCount}` : `${languages.length}`
  },
  {
    icon: Zap,
    title: "home.features.instant.title",
    description: "home.features.instant.description",
    color: "from-indigo-500 to-purple-600",
    badge: null
  },
  {
    icon: Shield,
    title: "home.features.secure.title",
    description: "home.features.secure.description",
    color: "from-green-500 to-emerald-600",
    badge: null
  },
  {
    icon: Clock,
    title: "home.features.access.title",
    description: "home.features.access.description",
    color: "from-orange-500 to-amber-600",
    badge: null
  }
];

// Témoignages multilingues
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
      content: `Un outil indispensable pour débloquer ma créativité. Les ${tones.length} tons disponibles couvrent tous mes besoins.`,
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
      content: `An essential tool to unlock my creativity. The ${tones.length} available tones cover all my needs.`,
      rating: 5,
      avatar: "MD"
    }
  ]
};



export function HomePage() {
  // Hooks et état
  const { navigateToGenerator, refreshPaymentStatus, isLoading: contextLoading, clearError } = useApp();
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(true);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [animateIn, setAnimateIn] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [appStats, setAppStats] = useState<AppStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  
  const { t, i18n } = useTranslation();
  const lang = (i18n.language === 'fr' || i18n.language === 'en') ? i18n.language : 'en';
  const testimonials = testimonialsMock[lang];
  
  // État de loading combiné
  const isLoading = contextLoading || paymentLoading || statsLoading;
  
  // Produit pour le pricing
  const product = products[0]; // Hookline product

  // Chargement du statut de paiement avec retry
  const loadPaymentStatus = async (isRetry = false) => {
    if (!isRetry) {
      setPaymentLoading(true);
      setPaymentError(null);
    }
    
    try {
      const status = await refreshPaymentStatus();
     
      setPaymentStatus(status);
      setPaymentError(null);
      setRetryCount(0);
    } catch (error) {
      console.error('Error loading payment status:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      setPaymentError(errorMessage);
      
      // Fallback vers un état restrictif par défaut
      setPaymentStatus({
        canGenerate: false,
        requiresPayment: true,
        reason: 'error.payment_check_failed',
        trialCount: 0,
        trialLimit: 3,
        showResults: false
      });
    } finally {
      setPaymentLoading(false);
    }
  };

  // Fonction pour charger les statistiques
  const loadStats = async () => {
    try {
      
      
      setStatsLoading(true);
      
     
      
      const stats = await getAppStats();
      
      
      setAppStats(stats);
    } catch (error) {
      
      // Fallback vers des valeurs par défaut
      const fallbackStats = {
        totalPhrases: 0,
        uniqueUsers: 0,
        satisfactionRate: 98,
        languagesCount: 7,
        tonesCount: 6
      };
     
      setAppStats(fallbackStats);
    } finally {
      setStatsLoading(false);
      
    }
  };

  // Fonction de retry
  const handleRetry = () => {
    if (retryCount < 3) {
      setRetryCount(prev => prev + 1);
      loadPaymentStatus(true);
    }
  };

  // Effets
  useEffect(() => {
    // Délai réduit pour éviter les conflits de défilement
    const timer = setTimeout(() => {
      setAnimateIn(true);
    }, 50);
    
    loadPaymentStatus();
    loadStats();
    clearError(); // Clear any existing errors when component mounts
    Analytics.trackPageView('/');
    
    return () => clearTimeout(timer);
  }, [clearError]);

  // Fonction pour afficher les informations de paiement
  const renderPaymentInfo = () => {
    // État de chargement
    if (isLoading) {
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

    // État d'erreur avec retry
    if (paymentError && (!paymentStatus || retryCount > 0)) {
      return (
        <div className="bg-gradient-to-r from-red-500 to-rose-600 rounded-3xl p-8 mb-12 text-white max-w-lg mx-auto relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-bl-3xl text-sm font-bold">
            {t('home.error.title')}
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">{t('home.error.title')}</span>
            </div>
            <div className="text-red-100 text-lg mb-6">{t('home.error.paymentCheck')}</div>
            {retryCount < 3 && (
              <button
                onClick={handleRetry}
                className="bg-white text-red-600 px-8 py-4 rounded-xl font-semibold hover:bg-red-50 transition-all transform hover:scale-105 shadow-lg inline-flex items-center space-x-3"
              >
                <RefreshCw className="w-5 h-5" />
                <span>{t('home.error.retry')}</span>
              </button>
            )}
            {retryCount >= 3 && (
              <button
                onClick={navigateToGenerator}
                className="bg-white text-red-600 px-8 py-4 rounded-xl font-semibold hover:bg-red-50 transition-all transform hover:scale-105 shadow-lg inline-flex items-center space-x-3"
              >
                <ArrowRight className="w-5 h-5" />
                <span>{t('home.error.continue')}</span>
              </button>
            )}
          </div>
        </div>
      );
    }

    if (!paymentStatus) return null;

    // Période d'essai - Vérifier en premier
    if (paymentStatus.trialCount !== undefined && 
        paymentStatus.trialLimit !== undefined && 
        paymentStatus.trialCount < paymentStatus.trialLimit) {
      const remainingTrials = paymentStatus.trialLimit - paymentStatus.trialCount;
      
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
              <span className="text-xl font-bold">{t('home.trialTitle')}</span>
            </div>
            <div className="text-5xl font-bold mb-4">{formatPrice(product.price)}</div>
            <div className="text-purple-100 text-lg mb-6">
              {t('home.trialDescription', { 
                count: remainingTrials, 
                limit: paymentStatus.trialLimit 
              })}
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm text-purple-200 mb-6">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4" />
                <span>{paymentStatus.trialLimit} {t('home.payment.trialCount')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4" />
                <span>{t('home.trust.instantAccess')}</span>
              </div>
            </div>
            <button
              onClick={navigateToGenerator}
              className="bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold hover:bg-purple-50 transition-all transform hover:scale-105 shadow-lg inline-flex items-center space-x-3"
            >
              <Sparkles className="w-5 h-5" />
              <span>{t('home.startTrial')}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      );
    }

    // Accès gratuit ou payé (après avoir vérifié les essais)
    // Vérifier s'il y a des essais gratuits disponibles
    const hasTrials = paymentStatus.trialCount !== undefined && 
                     paymentStatus.trialLimit !== undefined && 
                     paymentStatus.trialCount < paymentStatus.trialLimit;
    
    // Accès gratuit : paiement non requis OU résultats visibles (et pas d'essais en cours)
    if ((!paymentStatus.requiresPayment || paymentStatus.showResults) && !hasTrials) {
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
              <span className="text-xl font-bold">{t('home.freeAccess')}</span>
            </div>
            <div className="text-5xl font-bold mb-4">0 USD</div>
            <div className="text-green-100 text-lg mb-6">
              {t('home.freeDescription')}
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm text-green-200 mb-6">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4" />
                <span>{t('home.payment.unlimited')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4" />
                <span>{t('home.features.instant.title')}</span>
              </div>
            </div>
            <button
              onClick={navigateToGenerator}
              className="bg-white text-green-600 px-8 py-4 rounded-xl font-semibold hover:bg-green-50 transition-all transform hover:scale-105 shadow-lg inline-flex items-center space-x-3"
            >
              <Sparkles className="w-5 h-5" />
              <span>{t('home.startNow')}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      );
    }

    // Accès premium requis
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
            <span className="text-xl font-bold">{t('home.premiumTitle')}</span>
          </div>
          <div className="text-5xl font-bold mb-4">{formatPrice(product.price)}</div>
          <div className="text-purple-100 text-lg mb-6">
            {t('home.premiumDescription')}
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm text-purple-200 mb-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <span>{t('home.payment.oneTime')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <span>{t('home.trust.instantAccess')}</span>
            </div>
          </div>
          <button
            onClick={navigateToGenerator}
            className="bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold hover:bg-purple-50 transition-all transform hover:scale-105 shadow-lg inline-flex items-center space-x-3"
          >
            <CreditCard className="w-5 h-5" />
            <span>{t('home.startPremium')}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  };

  // Fonction pour formater les statistiques
  const formatStats = () => {
    if (statsLoading) {
      return [
        { number: "...", label: "home.stats.phrases", icon: Sparkles },
        { number: "...", label: "home.stats.users", icon: Users },
        { number: "...", label: "home.stats.satisfaction", icon: TrendingUp },
        { number: "...", label: "home.stats.languages", icon: Globe }
      ];
    }
    
    if (!appStats) {
       return [
        { number: "0+", label: "home.stats.phrases", icon: Sparkles },
        { number: "0+", label: "home.stats.users", icon: Users },
        { number: "98%", label: "home.stats.satisfaction", icon: TrendingUp },
        { number: "7", label: "home.stats.languages", icon: Globe }
      ];
    }
    
    const formattedStats = [
      { 
        number: appStats.totalPhrases > 1000 ? `${Math.round(appStats.totalPhrases / 1000)}K+` : `${appStats.totalPhrases}+`, 
        label: "home.stats.phrases", 
        icon: Sparkles 
      },
      { 
        number: appStats.uniqueUsers > 1000 ? `${Math.round(appStats.uniqueUsers / 1000)}K+` : `${appStats.uniqueUsers}+`, 
        label: "home.stats.users", 
        icon: Users 
      },
      { 
        number: `${appStats.satisfactionRate}%`, 
        label: "home.stats.satisfaction", 
        icon: TrendingUp 
      },
      { 
        number: `${appStats.languagesCount}`, 
        label: "home.stats.languages", 
        icon: Globe 
      }
    ];
     return formattedStats;
  };

  // Fonction pour afficher les indicateurs de confiance
  const renderTrustIndicators = () => {
    const indicators = [
      { 
        icon: Shield, 
        text: t('home.trust.securePayment'), 
        color: 'text-green-500', 
        show: true 
      },
      { 
        icon: Clock, 
        text: t('home.trust.instantAccess'), 
        color: 'text-blue-500', 
        show: true 
      },
      { 
        icon: Brain, 
        text: t('home.trust.advancedAI'), 
        color: 'text-purple-500', 
        show: true 
      },
      { 
        icon: CreditCard, 
        text: t('home.trust.noSubscription'), 
        color: 'text-orange-500', 
        show: !paymentStatus?.requiresPayment || paymentStatus?.showResults 
      }
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
      <section className="relative py-20 sm:py-24 lg:py-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-pink-50"></div>
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`transition-all duration-1000 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            
            {/* Badge */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center space-x-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full border border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></div>
                <Sparkles className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-semibold text-purple-700">
                  {t('home.hero.subtitle')}
                </span>
              </div>
            </div>
            
            {/* Main Heading */}
            <div className="text-center mb-12">
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-gray-900 mb-6 leading-tight tracking-tight">
                {t('home.hero.title')}
                <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 bg-clip-text text-transparent block mt-2">
                  {t('home.hero.cta')}
                </span>
              </h1>
              
              <p className="text-xl sm:text-2xl md:text-3xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-medium">
                {t('home.hero.description')}
              </p>
            </div>

            {/* Payment Info Card */}
            <div className="mb-12">
              {renderPaymentInfo()}
            </div>

            {/* Trust Indicators */}
            <div className="mb-16">
              {renderTrustIndicators()}
            </div>

            {/* Quick Stats Preview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {formatStats().map((stat, index) => {
                const IconComponent = stat.icon;
                const isLoading = statsLoading && stat.number === "...";
                
                return (
                  <div 
                    key={index} 
                    className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className={`text-2xl font-bold text-gray-900 mb-1 ${isLoading ? 'animate-pulse' : ''}`}>
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                          <span>...</span>
                        </div>
                      ) : (
                        stat.number
                      )}
                    </div>
                    <div className="text-sm text-gray-600 font-medium">{t(stat.label)}</div>
                  </div>
                );
              })}
            </div>
            
      
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
            {getFeatures(appStats).map((feature, index) => (
              <div
                key={index}
                className={`bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-500 transform hover:scale-105 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ animationDelay: `${800 + index * 100}ms` }}
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg relative`}>
                  <feature.icon className="w-8 h-8 text-white" />
                  {/* Badge pour les tons et langues */}
                  {feature.badge && (
                    <div className="absolute -top-2 -right-2 bg-white text-purple-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-lg border-2 border-purple-200">
                      {typeof feature.badge === 'function' ? feature.badge(appStats) : feature.badge}
                    </div>
                  )}
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
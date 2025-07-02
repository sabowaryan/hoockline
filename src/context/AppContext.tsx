import React, { createContext, useContext, useReducer, ReactNode, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppState, GenerationRequest, GeneratedPhrase, PaymentStatus } from '../types';
import { Analytics } from '../services/analytics';
import { checkPaymentStatus as checkSettings } from '../services/settings';
import { Format, Language } from '../types/PromptOptions';
import { useGenerateHook } from '../hooks/useGenerateHook';

import { markPaymentTokenAsUsed, getPaymentTokenByResultId } from '../services/settings';
import { handleNavigationWithScroll } from '../utils/scrollUtils';
import { getPendingResultById } from '../services/settings';

interface GenerationResult {
  success: boolean;
  phrases?: GeneratedPhrase[];
  resultId?: string;
  requiresPayment?: boolean;
  error?: string;
}

interface AppContextType {
  state: AppState;
  navigateToGenerator: () => void;
  generatePhrases: (request: GenerationRequest) => Promise<void>;
  navigateToPayment: () => void;
  completePayment: () => void;
  navigateToHome: () => void;
  navigateToSuccess: () => void;
  copyPhrase: (phrase: string) => Promise<void>;
  checkPaymentStatus: () => Promise<PaymentStatus>;
  refreshPaymentStatus: () => Promise<PaymentStatus>;
  isLoading: boolean;
  clearError: () => void;
}

// Types d'erreurs centralisées
enum ErrorType {
  VALIDATION = 'VALIDATION',
  GENERATION = 'GENERATION',
  PAYMENT = 'PAYMENT',
  NAVIGATION = 'NAVIGATION',
  COPY = 'COPY',
  NETWORK = 'NETWORK'
}

interface AppError {
  type: ErrorType;
  message: string;
  details?: string;
  timestamp: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

type Action =
  | { type: 'NAVIGATE_TO_GENERATOR' }
  | { type: 'START_GENERATION'; payload: GenerationRequest }
  | { type: 'COMPLETE_GENERATION'; payload: GeneratedPhrase[] }
  | { type: 'SET_ERROR'; payload: AppError }
  | { type: 'NAVIGATE_TO_PAYMENT'; payload: string }
  | { type: 'COMPLETE_PAYMENT' }
  | { type: 'NAVIGATE_TO_HOME' }
  | { type: 'NAVIGATE_TO_SUCCESS' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_PAYMENT_STATUS_LOADING'; payload: boolean }
  | { type: 'CLEAR_ERROR' };

// État étendu avec gestion améliorée du loading
interface ExtendedAppState extends Omit<AppState, 'error'> {
  isLoading: boolean;
  isPaymentStatusLoading: boolean;
  error: AppError | null;
}

const initialState: ExtendedAppState = {
  currentStep: 'home',
  generationRequest: null,
  generatedPhrases: [],
  isGenerating: false,
  isPaymentComplete: false,
  error: null,
  pendingResultId: null,
  isLoading: false,
  isPaymentStatusLoading: false
};

function appReducer(state: ExtendedAppState, action: Action): ExtendedAppState {
  switch (action.type) {
    case 'NAVIGATE_TO_GENERATOR':
      return { ...state, currentStep: 'generator', error: null };
    
    case 'START_GENERATION':
      return {
        ...state,
        generationRequest: action.payload,
        isGenerating: true,
        isLoading: true,
        error: null,
        generatedPhrases: [], // Reset previous results
      };
    
    case 'COMPLETE_GENERATION':
      return {
        ...state,
        generatedPhrases: action.payload,
        isGenerating: false,
        isLoading: false,
        error: null,
      };
    
    case 'SET_ERROR':
      return {
        ...state,
        isGenerating: false,
        isLoading: false,
        isPaymentStatusLoading: false,
        error: action.payload,
        generatedPhrases: action.payload.type === ErrorType.GENERATION ? [] : state.generatedPhrases,
      };
    
    case 'NAVIGATE_TO_PAYMENT':
      return { 
        ...state, 
        currentStep: 'payment',
        pendingResultId: action.payload,
        isGenerating: false,
        isLoading: false,
      };
    
    case 'COMPLETE_PAYMENT':
      return {
        ...state,
        currentStep: 'results',
        isPaymentComplete: true,
        pendingResultId: null,
        error: null,
      };
    
    case 'NAVIGATE_TO_HOME':
      return { ...initialState };
    
    case 'NAVIGATE_TO_SUCCESS':
      return { ...state, currentStep: 'success', error: null };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_PAYMENT_STATUS_LOADING':
      return { ...state, isPaymentStatusLoading: action.payload };
    
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    
    default:
      return state;
  }
}

// Gestionnaire d'erreurs centralisé
class ErrorManager {
  static createError(type: ErrorType, message: string, details?: string): AppError {
    return {
      type,
      message,
      details,
      timestamp: Date.now()
    };
  }

  static getErrorMessage(error: AppError): string {
    const baseMessages = {
      [ErrorType.VALIDATION]: 'Erreur de validation',
      [ErrorType.GENERATION]: 'Erreur de génération',
      [ErrorType.PAYMENT]: 'Erreur de paiement',
      [ErrorType.NAVIGATION]: 'Erreur de navigation',
      [ErrorType.COPY]: 'Erreur de copie',
      [ErrorType.NETWORK]: 'Erreur réseau'
    };

    return error.message || baseMessages[error.type] || 'Une erreur est survenue';
  }

  static shouldRetry(error: AppError): boolean {
    return [ErrorType.NETWORK, ErrorType.GENERATION].includes(error.type);
  }
}

// Hook personnalisé pour la gestion du cache de statut de paiement
function usePaymentStatusCache() {
  const cacheRef = useRef<PaymentStatus & { lastCheck: number } | null>(null);
  const CACHE_DURATION = 60000; // 1 minute

  const getCachedStatus = useCallback((): PaymentStatus | null => {
    if (!cacheRef.current) return null;
    
    const isExpired = Date.now() - cacheRef.current.lastCheck > CACHE_DURATION;
    return isExpired ? null : cacheRef.current;
  }, []);

  const setCachedStatus = useCallback((status: PaymentStatus) => {
    cacheRef.current = { ...status, lastCheck: Date.now() };
  }, []);

  const clearCache = useCallback(() => {
    cacheRef.current = null;
  }, []);

  return { getCachedStatus, setCachedStatus, clearCache };
}

// Hook pour la gestion des erreurs avec retry
function useErrorHandler(dispatch: React.Dispatch<Action>) {
  const handleError = useCallback((type: ErrorType, message: string, details?: string) => {
    const error = ErrorManager.createError(type, message, details);
    dispatch({ type: 'SET_ERROR', payload: error });
    
    // Log pour debugging
    console.error(`[${type}] ${message}`, details);
    
    // Analytics tracking pour les erreurs critiques
    if ([ErrorType.GENERATION, ErrorType.PAYMENT].includes(type)) {
      // Utilisation de trackConversionEvent pour les erreurs
      Analytics.trackError(type, message, details);
    }
  }, [dispatch]);

  return { handleError };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const navigate = useNavigate();
  const { generate, loading, error: generateError, results, resultId } = useGenerateHook();
  const { getCachedStatus, setCachedStatus, clearCache } = usePaymentStatusCache();
  const { handleError } = useErrorHandler(dispatch);

  // Synchronisation du loading avec le hook de génération
  useEffect(() => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  }, [loading]);

  // Gestion des paramètres d'URL au montage
  useEffect(() => {
    const handleUrlParams = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        
        if (urlParams.get('success') === 'true') {
          const paymentId = urlParams.get('payment_id') || 'unknown';
          const resultId = urlParams.get('result_id');
          
          // Si on a un resultId, restaurer les données générées et marquer le token comme utilisé
          if (resultId) {
            try {
              // Récupérer le token de paiement associé à ce resultId
              const paymentToken = await getPaymentTokenByResultId(resultId);
              
              if (paymentToken) {
                // Marquer le token comme utilisé
                await markPaymentTokenAsUsed(paymentToken);
                
                // Stocker le token dans localStorage pour cette session
                localStorage.setItem('payment_token', paymentToken);
              }
              
              // Restaurer les données générées de manière sécurisée
              const result = await getPendingResultById(resultId);
              
              if (result?.content) {
                const phrases = JSON.parse(result.content);
                dispatch({ type: 'COMPLETE_GENERATION', payload: phrases });
              }
            } catch (error) {
              console.error('Error restoring results:', error);
            }
          }
          
          navigate('/success', { replace: true });
          Analytics.trackPaymentComplete(paymentId, 3.99);
          clearCache(); // Clear payment status cache after successful payment
        } else if (urlParams.get('canceled') === 'true') {
          navigate('/payment', { replace: true });
        }
      } catch (error) {
        handleError(
          ErrorType.NAVIGATION,
          'Erreur lors du traitement des paramètres URL',
          error instanceof Error ? error.message : 'Unknown error'
        );
      }
    };

    handleUrlParams();
  }, [navigate, clearCache, handleError]);

  // Fonction centralisée de vérification du paiement avec cache
  const checkPaymentStatus = useCallback(async (): Promise<PaymentStatus> => {
    // Vérifier le cache d'abord
    const cached = getCachedStatus();
    if (cached) {
      return cached;
    }

    dispatch({ type: 'SET_PAYMENT_STATUS_LOADING', payload: true });

    try {
      const status = await checkSettings();
      
      // S'assurer que les essais ne sont disponibles que si le paiement n'est pas requis
      const paymentStatus: PaymentStatus = {
        canGenerate: status.canGenerate,
        requiresPayment: status.requiresPayment,
        reason: status.reason,
        trialCount: status.trialCount,
        trialLimit: status.trialLimit,
        showResults: status.showResults ?? false
      };

      // Mettre à jour le cache
      setCachedStatus(paymentStatus);
      
      return paymentStatus;
    } catch (error) {
      handleError(
        ErrorType.PAYMENT,
        'Erreur lors de la vérification du statut de paiement',
        error instanceof Error ? error.message : 'Unknown error'
      );
      
      // En cas d'erreur, retourner un état restrictif par défaut
      const errorStatus: PaymentStatus = { 
        canGenerate: false,
        requiresPayment: true,
        reason: 'error.payment_check_failed',
        trialCount: undefined,
        trialLimit: undefined,
        showResults: false
      };
      
      setCachedStatus(errorStatus);
      return errorStatus;
    } finally {
      dispatch({ type: 'SET_PAYMENT_STATUS_LOADING', payload: false });
    }
  }, [getCachedStatus, setCachedStatus, handleError]);

  // Fonction pour forcer le rafraîchissement du statut de paiement
  const refreshPaymentStatus = useCallback(async (): Promise<PaymentStatus> => {
    // Vider le cache pour forcer un rechargement
    clearCache();
    
    dispatch({ type: 'SET_PAYMENT_STATUS_LOADING', payload: true });

    try {
      const status = await checkSettings();
      
      // S'assurer que les essais ne sont disponibles que si le paiement n'est pas requis
      const paymentStatus: PaymentStatus = {
        canGenerate: status.canGenerate,
        requiresPayment: status.requiresPayment,
        reason: status.reason,
        trialCount: status.trialCount,
        trialLimit: status.trialLimit,
        showResults: status.showResults ?? false
      };

      // Mettre à jour le cache
      setCachedStatus(paymentStatus);
      
      return paymentStatus;
    } catch (error) {
      handleError(
        ErrorType.PAYMENT,
        'Erreur lors de la vérification du statut de paiement',
        error instanceof Error ? error.message : 'Unknown error'
      );
      
      // En cas d'erreur, retourner un état restrictif par défaut
      const errorStatus: PaymentStatus = { 
        canGenerate: false,
        requiresPayment: true,
        reason: 'error.payment_check_failed',
        trialCount: undefined,
        trialLimit: undefined,
        showResults: false
      };
      
      setCachedStatus(errorStatus);
      return errorStatus;
    } finally {
      dispatch({ type: 'SET_PAYMENT_STATUS_LOADING', payload: false });
    }
  }, [clearCache, setCachedStatus, handleError]);

  // Gestion des résultats de génération
  const handleGenerationResult = useCallback((result: GenerationResult) => {
    if (!result.success) {
      handleError(
        ErrorType.GENERATION,
        result.error || 'Une erreur est survenue lors de la génération.'
      );
      return;
    }

    if (result.requiresPayment && result.resultId) {
      dispatch({ type: 'NAVIGATE_TO_PAYMENT', payload: result.resultId });
      navigate('/payment');
      return;
    }

    if (result.phrases && result.phrases.length > 0) {
      dispatch({ type: 'COMPLETE_GENERATION', payload: result.phrases });
      navigate('/results');
    } else {
      handleError(
        ErrorType.GENERATION,
        'Aucune phrase générée. Veuillez réessayer.'
      );
    }
  }, [navigate, handleError]);

  // Validation des données de génération
  const validateGenerationRequest = (request: GenerationRequest): string | null => {
    if (!request.concept?.trim()) {
      return 'Le concept est requis';
    }
    if (!request.tone?.trim()) {
      return 'Le ton est requis';
    }
    if (!request.targetLanguage?.trim()) {
      return 'La langue cible est requise';
    }
    return null;
  };

  // Fonction principale de génération avec logique séparée
  const generatePhrases = useCallback(async (request: GenerationRequest): Promise<void> => {
    // Validation des données d'entrée
    const validationError = validateGenerationRequest(request);
    if (validationError) {
      handleError(ErrorType.VALIDATION, validationError);
      return;
    }

    dispatch({ type: 'START_GENERATION', payload: request });
    
    try {
      // Tracking analytics
      Analytics.trackGeneratorStart(request.concept, request.tone, request.targetLanguage);
      
      // Conversion des types pour l'API
      const promptOptions = {
        ...request,
        format: 'tagline' as Format,
        language: request.targetLanguage as Language
      };
      
      const referenceText = request.concept?.trim() || '';
      
      // Appel de l'API de génération
      const validatedResults = await generate(promptOptions, referenceText);


      // Gestion des erreurs de génération
      if (generateError) {
        console.log('❌ Erreur de génération détectée');
        handleGenerationResult({
          success: false,
          requiresPayment: false,
          error: generateError
        });
        return;
      }

      // Gestion du cas où un paiement est requis
      if (resultId) {
        handleGenerationResult({
          success: true,
          requiresPayment: true,
          resultId
        });
        return;
      }

      // NOUVELLE LOGIQUE : validatedResults est maintenant un objet avec success, requiresPayment, etc.
      if (validatedResults && typeof validatedResults === 'object' && 'success' in validatedResults) {
        handleGenerationResult(validatedResults);
        return;
      }

      // Si on arrive ici, c'est un cas d'erreur
      console.log('❌ Aucun résultat valide trouvé');
      handleGenerationResult({
        success: false,
        requiresPayment: false,
        error: 'Aucune phrase générée. Veuillez réessayer.'
      });
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la génération';
      
      handleError(
        ErrorType.GENERATION,
        errorMessage,
        error instanceof Error ? error.stack : undefined
      );
    }
  }, [generate, generateError, resultId, handleGenerationResult, handleError]);

  // Fonctions de navigation avec gestion d'erreurs améliorée
  const navigateToGenerator = useCallback(() => {
    try {
      dispatch({ type: 'CLEAR_ERROR' });
      handleNavigationWithScroll(() => {
        navigate('/generator');
      }, 50);
    } catch (error) {
      handleError(
        ErrorType.NAVIGATION,
        'Erreur lors de la navigation vers le générateur',
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }, [navigate, handleError]);

  const navigateToPayment = useCallback(() => {
    if (!state.pendingResultId) {
      handleError(
        ErrorType.NAVIGATION,
        'Erreur de navigation vers le paiement. Veuillez réessayer.',
        'No pending result ID found'
      );
      return;
    }
    
    try {
      handleNavigationWithScroll(() => {
        navigate('/payment');
      }, 50);
    } catch (error) {
      handleError(
        ErrorType.NAVIGATION,
        'Erreur lors de la navigation vers le paiement',
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }, [state.pendingResultId, navigate, handleError]);

  const completePayment = useCallback(() => {
    try {
      dispatch({ type: 'COMPLETE_PAYMENT' });
      clearCache(); // Clear payment status cache after payment
      
      // Nettoyer le token de paiement pour forcer un nouveau paiement à la prochaine génération
      localStorage.removeItem('payment_token');
      
      handleNavigationWithScroll(() => {
        navigate('/results');
      }, 50);
    } catch (error) {
      handleError(
        ErrorType.PAYMENT,
        'Erreur lors de la finalisation du paiement',
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }, [navigate, clearCache, handleError]);

  const navigateToHome = useCallback(() => {
    try {
      dispatch({ type: 'NAVIGATE_TO_HOME' });
      clearCache(); // Clear cache when going home
      
      // Nettoyer le token de paiement pour forcer un nouveau paiement
      localStorage.removeItem('payment_token');
      
      handleNavigationWithScroll(() => {
        navigate('/');
      }, 50);
    } catch (error) {
      handleError(
        ErrorType.NAVIGATION,
        'Erreur lors du retour à l\'accueil',
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }, [navigate, clearCache, handleError]);

  const navigateToSuccess = useCallback(() => {
    try {
      dispatch({ type: 'NAVIGATE_TO_SUCCESS' });
      handleNavigationWithScroll(() => {
        navigate('/success');
      }, 50);
    } catch (error) {
      handleError(
        ErrorType.NAVIGATION,
        'Erreur lors de la navigation vers la page de succès',
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }, [navigate, handleError]);

  // Fonction de copie avec gestion d'erreurs améliorée
  const copyPhrase = useCallback(async (phrase: string): Promise<void> => {
    if (!phrase?.trim()) {
      handleError(ErrorType.COPY, 'Impossible de copier une phrase vide');
      return;
    }

    try {
      // Vérifier si l'API clipboard est disponible
      if (!navigator.clipboard) {
        // Fallback pour les anciens navigateurs
        const textArea = document.createElement('textarea');
        textArea.value = phrase;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        const success = document.execCommand('copy');
        document.body.removeChild(textArea);
        
        if (!success) {
          throw new Error('Fallback copy failed');
        }
      } else {
        await navigator.clipboard.writeText(phrase);
      }
      
      Analytics.trackPhraseCopy(phrase);
    } catch (error) {
      handleError(
        ErrorType.COPY,
        'Erreur lors de la copie de la phrase',
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }, [handleError]);

  // Fonction pour effacer les erreurs
  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const value: AppContextType = {
    state: state as AppState, // Cast pour maintenir la compatibilité
    navigateToGenerator,
    generatePhrases,
    navigateToPayment,
    completePayment,
    navigateToHome,
    navigateToSuccess,
    copyPhrase,
    checkPaymentStatus,
    refreshPaymentStatus,
    isLoading: state.isLoading || state.isGenerating || state.isPaymentStatusLoading,
    clearError,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

// Export du gestionnaire d'erreurs pour utilisation externe
export { ErrorManager, ErrorType };
export type { AppError };
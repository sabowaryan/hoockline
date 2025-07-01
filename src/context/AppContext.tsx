import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppState, GenerationRequest, GeneratedPhrase } from '../types';
import { Analytics } from '../services/analytics';
import { isPaymentRequired, areFreeTrialsAllowed, getTrialLimit } from '../services/settings';

interface AppContextType {
  state: AppState;
  navigateToGenerator: () => void;
  generatePhrases: (request: GenerationRequest) => void;
  navigateToPayment: () => void;
  completePayment: () => void;
  navigateToHome: () => void;
  navigateToSuccess: () => void;
  copyPhrase: (phrase: string) => void;
  checkPaymentStatus: () => Promise<{ canGenerate: boolean; reason?: string; freeTrialsAllowed?: boolean }>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

type Action =
  | { type: 'NAVIGATE_TO_GENERATOR' }
  | { type: 'START_GENERATION'; payload: GenerationRequest }
  | { type: 'COMPLETE_GENERATION'; payload: GeneratedPhrase[] }
  | { type: 'GENERATION_ERROR'; payload: string }
  | { type: 'NAVIGATE_TO_PAYMENT' }
  | { type: 'COMPLETE_PAYMENT' }
  | { type: 'NAVIGATE_TO_HOME' }
  | { type: 'NAVIGATE_TO_SUCCESS' };

const initialState: AppState = {
  currentStep: 'home',
  generationRequest: null,
  generatedPhrases: [],
  isGenerating: false,
  isPaymentComplete: false,
  error: null,
};

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'NAVIGATE_TO_GENERATOR':
      return { ...state, currentStep: 'generator', error: null };
    case 'START_GENERATION':
      return {
        ...state,
        generationRequest: action.payload,
        isGenerating: true,
        error: null,
      };
    case 'COMPLETE_GENERATION':
      return {
        ...state,
        generatedPhrases: action.payload,
        isGenerating: false,
        error: null,
      };
    case 'GENERATION_ERROR':
      return {
        ...state,
        isGenerating: false,
        error: action.payload,
      };
    case 'NAVIGATE_TO_PAYMENT':
      return { ...state, currentStep: 'payment' };
    case 'COMPLETE_PAYMENT':
      return {
        ...state,
        currentStep: 'results',
        isPaymentComplete: true,
      };
    case 'NAVIGATE_TO_HOME':
      return { ...initialState };
    case 'NAVIGATE_TO_SUCCESS':
      return { ...state, currentStep: 'success' };
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const navigate = useNavigate();

  // Check for success parameter on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
      navigate('/success', { replace: true });
      Analytics.trackPaymentComplete('order_id', 3.99);
    } else if (urlParams.get('canceled') === 'true') {
      navigate('/payment', { replace: true });
    }
  }, [navigate]);

  const navigateToGenerator = () => {
    navigate('/generator');
  };

  // Fonction pour vérifier le statut de paiement
  const checkPaymentStatus = async (): Promise<{ canGenerate: boolean; reason?: string; freeTrialsAllowed?: boolean }> => {
    try {
      const [paymentRequired, freeTrialsAllowed, trialLimit] = await Promise.all([
        isPaymentRequired(),
        areFreeTrialsAllowed(),
        getTrialLimit()
      ]);

      // Si le paiement n'est pas requis, on peut générer
      if (!paymentRequired) {
        return { canGenerate: true, freeTrialsAllowed: false };
      }

      // Vérifier si l'utilisateur a déjà payé (session ou localStorage)
      const hasPaid = localStorage.getItem('payment_completed') === 'true';
      if (hasPaid) {
        return { canGenerate: true, freeTrialsAllowed: false };
      }

      // Vérifier les essais gratuits
      if (freeTrialsAllowed) {
        const trialCount = parseInt(localStorage.getItem('trial_count') || '0');
        if (trialCount < trialLimit) {
          return { canGenerate: true, freeTrialsAllowed: true };
        } else {
          return { 
            canGenerate: false, 
            reason: `Vous avez utilisé vos ${trialLimit} essais gratuits. Veuillez effectuer un paiement pour continuer.`,
            freeTrialsAllowed: true
          };
        }
      }

      // Paiement requis et pas d'essais gratuits
      return { 
        canGenerate: false, 
        reason: 'Un paiement est requis pour utiliser le générateur.',
        freeTrialsAllowed: false
      };
    } catch (error) {
      console.error('Error checking payment status:', error);
      return { 
        canGenerate: false, 
        reason: 'Erreur lors de la vérification du statut de paiement.',
        freeTrialsAllowed: false
      };
    }
  };

  const generatePhrases = async (request: GenerationRequest) => {
    // Permettre la génération même si le paiement est requis
    dispatch({ type: 'START_GENERATION', payload: request });
    Analytics.trackGeneratorStart(request.concept, request.tone, request.language);
    
    try {
      const { generateCatchphrasesWithAI } = await import('../services/gemini');
      const phraseTexts = await generateCatchphrasesWithAI(request.concept, request.tone, request.language);
      const phrases: GeneratedPhrase[] = phraseTexts.map((text, index) => ({
        id: `phrase-${Date.now()}-${index + 1}`,
        text,
        tone: request.tone
      }));
      
      // Stocker les phrases générées dans le state
      dispatch({ type: 'COMPLETE_GENERATION', payload: phrases });
      
      // Vérifier le statut de paiement après génération
      const [paymentRequired, freeTrialsAllowed, trialLimit] = await Promise.all([
        isPaymentRequired(),
        areFreeTrialsAllowed(),
        getTrialLimit()
      ]);
      
      const hasPaid = localStorage.getItem('payment_completed') === 'true';
      
      // Si le paiement n'est pas requis, aller directement aux résultats
      if (!paymentRequired) {
        navigate('/results');
        return;
      }
      
      // Si l'utilisateur a déjà payé, aller directement aux résultats
      if (hasPaid) {
        navigate('/results');
        return;
      }
      
      // Si les essais gratuits sont autorisés et que l'utilisateur n'a pas atteint la limite
      if (freeTrialsAllowed) {
        const trialCount = parseInt(localStorage.getItem('trial_count') || '0');
        if (trialCount < trialLimit) {
          // Incrémenter le compteur d'essais
          localStorage.setItem('trial_count', (trialCount + 1).toString());
          // L'utilisateur peut voir les résultats gratuitement
          navigate('/results');
          return;
        }
      }
      
      // Si le paiement est requis et pas d'essais gratuits disponibles,
      // rediriger vers la page de paiement (les résultats sont déjà stockés)
      navigate('/payment');
      
    } catch (error) {
      console.error('Error generating phrases with Gemini:', error);
      dispatch({ 
        type: 'GENERATION_ERROR', 
        payload: 'Erreur lors de la génération. Veuillez vérifier votre connexion et réessayer.' 
      });
    }
  };

  const navigateToPayment = () => {
    navigate('/payment');
    Analytics.trackPaymentStart('hookline', 3.99);
  };

  const completePayment = () => {
    // Marquer le paiement comme terminé
    localStorage.setItem('payment_completed', 'true');
    // Rediriger vers les résultats (les phrases sont déjà générées)
    navigate('/results');
  };

  const navigateToHome = () => {
    navigate('/');
  };

  const navigateToSuccess = () => {
    navigate('/success');
  };

  const copyPhrase = async (phrase: string) => {
    try {
      await navigator.clipboard.writeText(phrase);
    } catch (err) {
      console.error('Failed to copy phrase:', err);
      const textArea = document.createElement('textarea');
      textArea.value = phrase;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
      } catch (fallbackErr) {
        console.error('Fallback copy failed:', fallbackErr);
      }
      document.body.removeChild(textArea);
    }
  };

  return (
    <AppContext.Provider
      value={{
        state,
        navigateToGenerator,
        generatePhrases,
        navigateToPayment,
        completePayment,
        navigateToHome,
        navigateToSuccess,
        copyPhrase,
        checkPaymentStatus,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    // En mode développement, retourner un contexte par défaut pour éviter les erreurs de hot reload
    if (import.meta.env.DEV) {
      return {
        state: {
          currentStep: 'home',
          generationRequest: null,
          generatedPhrases: [],
          isGenerating: false,
          isPaymentComplete: false,
          error: null,
        },
        navigateToGenerator: () => {},
        generatePhrases: async () => {},
        navigateToPayment: () => {},
        completePayment: () => {},
        navigateToHome: () => {},
        navigateToSuccess: () => {},
        copyPhrase: async () => {},
        checkPaymentStatus: async () => ({ canGenerate: false, reason: 'Context not available' }),
      };
    }
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
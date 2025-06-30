import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { AppState, GenerationRequest, GeneratedPhrase } from '../types';

interface AppContextType {
  state: AppState;
  navigateToGenerator: () => void;
  generatePhrases: (request: GenerationRequest) => void;
  navigateToPayment: () => void;
  completePayment: () => void;
  navigateToHome: () => void;
  navigateToSuccess: () => void;
  copyPhrase: (phrase: string) => void;
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

  // Check for success parameter on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
      dispatch({ type: 'NAVIGATE_TO_SUCCESS' });
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const navigateToGenerator = () => {
    dispatch({ type: 'NAVIGATE_TO_GENERATOR' });
  };

  const generatePhrases = async (request: GenerationRequest) => {
    dispatch({ type: 'START_GENERATION', payload: request });
    
    try {
      // Import Gemini service
      const { generateCatchphrasesWithAI } = await import('../services/gemini');
      
      // Use Gemini AI exclusively for generation with language support
      const phraseTexts = await generateCatchphrasesWithAI(request.concept, request.tone, request.language);
      
      // Convert to GeneratedPhrase objects
      const phrases: GeneratedPhrase[] = phraseTexts.map((text, index) => ({
        id: `phrase-${index + 1}`,
        text,
        tone: request.tone
      }));
      
      dispatch({ type: 'COMPLETE_GENERATION', payload: phrases });
      
    } catch (error) {
      console.error('Error generating phrases with Gemini:', error);
      dispatch({ 
        type: 'GENERATION_ERROR', 
        payload: 'Erreur lors de la génération. Veuillez réessayer.' 
      });
    }
  };

  const navigateToPayment = () => {
    dispatch({ type: 'NAVIGATE_TO_PAYMENT' });
  };

  const completePayment = () => {
    dispatch({ type: 'COMPLETE_PAYMENT' });
  };

  const navigateToHome = () => {
    dispatch({ type: 'NAVIGATE_TO_HOME' });
  };

  const navigateToSuccess = () => {
    dispatch({ type: 'NAVIGATE_TO_SUCCESS' });
  };

  const copyPhrase = async (phrase: string) => {
    try {
      await navigator.clipboard.writeText(phrase);
    } catch (err) {
      console.error('Failed to copy phrase:', err);
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
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
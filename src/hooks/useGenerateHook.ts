import { useState, useCallback } from 'react';
import { buildPrompt } from '../lib/buildPrompt';
import { validateOutput, validateOutputWithSimilarity } from '../lib/validateOutput';
import { llmClient } from '../services/gptClient';
import { PromptOptions, GeneratedPhrase } from '../types/PromptOptions';
import { 
  checkPaymentStatus, 
  incrementTrialCount, 
  savePendingResults,
  createPaymentToken,
  markPaymentTokenAsUsed,
  getPaymentTokenByResultId
} from '../services/settings';

interface GenerateState {
  loading: boolean;
  error: string | null;
  results: GeneratedPhrase[];
  resultId: string | null;
}

interface PaymentStatus {
  canGenerate: boolean;
  requiresPayment: boolean;
  showResults: boolean;
  trialCount?: number;
  reason?: string;
}

export function useGenerateHook() {
  const [state, setState] = useState<GenerateState>({
    loading: false,
    error: null,
    results: [],
    resultId: null,
  });

  const resetState = useCallback(() => {
    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
      resultId: null,
      results: [],
    }));
  }, []);

  const setError = useCallback((error: string) => {
    setState(prev => ({
      ...prev,
      loading: false,
      error,
    }));
  }, []);

  const setSuccess = useCallback((results: GeneratedPhrase[], resultId?: string) => {
    setState(prev => ({
      ...prev,
      loading: false,
      error: null,
      results,
      resultId: resultId || null,
    }));
  }, []);

  const handlePaymentRequired = useCallback(async (
    results: GeneratedPhrase[], 
    paymentStatus: PaymentStatus
  ) => {
    try {
      const id = await savePendingResults(JSON.stringify(results));
      
      // Créer un token de paiement pour cette génération
      const paymentAmount = 399; // 3.99 EUR en centimes
      const token = await createPaymentToken(id, paymentAmount, 'EUR');
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: paymentStatus.reason || 'payment.required',
        resultId: id,
        results: [],
      }));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des résultats:', error);
      setError('error.save_failed');
    }
  }, [setError]);

  const processGeneration = useCallback(async (options: PromptOptions, referenceText: string) => {
    try {
      // Construction du prompt
      const prompt = buildPrompt(options);
      
      // Génération des phrases
      const rawResponse = await llmClient.generate(prompt, options);
     console.log('Réponse brute du LLM:', rawResponse);
      // Validation et formatage
      const validatedResults = validateOutputWithSimilarity(rawResponse, referenceText, 10);
      console.log('Résultats validés:', validatedResults);
      return validatedResults;
    } catch (error) {
      console.error('Erreur lors de la génération:', error);
      throw new Error(error instanceof Error ? error.message : 'Erreur de génération');
    }
  }, []);

  const handlePostGeneration = useCallback(async (
    results: GeneratedPhrase[],
    wasFreeTrial: boolean
  ) => {
    try {
      // Vérification du statut de paiement post-génération
      const postPaymentStatus = await checkPaymentStatus();
      
      // Normaliser le statut de paiement pour garantir showResults comme boolean
      const normalizedPaymentStatus: PaymentStatus = {
        ...postPaymentStatus,
        showResults: postPaymentStatus.showResults ?? false
      };
      
      // Gérer l'affichage des résultats selon le statut de paiement
      if (normalizedPaymentStatus.requiresPayment || !normalizedPaymentStatus.showResults) {
        await handlePaymentRequired(results, normalizedPaymentStatus);
      } else if (normalizedPaymentStatus.showResults) {
        // Incrémenter le compteur d'essai APRÈS avoir décidé d'afficher les résultats
        if (wasFreeTrial && normalizedPaymentStatus.trialCount !== undefined) {
          await incrementTrialCount();
        }
        setSuccess(results);
        return results;
      }
    } catch (error) {
      console.error('Erreur post-génération:', error);
      setError('error.post_generation');
    }
  }, [handlePaymentRequired, setSuccess, setError]);

  const generate = useCallback(async (options: PromptOptions, referenceText: string) => {
    resetState();
    
    try {
      // Vérification initiale du statut de paiement
      const initialPaymentStatus = await checkPaymentStatus();
      
      if (!initialPaymentStatus.canGenerate) {
        setError('error.cannot_generate');
        return;
      }
      
      // Traitement de la génération
      const results = await processGeneration(options, referenceText);
      
      // Gestion post-génération
      const wasFreeTrial = !initialPaymentStatus.requiresPayment;
      return await handlePostGeneration(results, wasFreeTrial);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      console.error('Erreur dans generate:', errorMessage);
      setError(errorMessage);
    }
  }, [resetState, setError, processGeneration, handlePostGeneration]);

  return {
    loading: state.loading,
    error: state.error,
    results: state.results,
    resultId: state.resultId,
    generate: (options: PromptOptions, referenceText: string) => generate(options, referenceText),
    checkPaymentStatus,
  };
}
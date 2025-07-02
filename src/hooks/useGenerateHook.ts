import { useState, useCallback } from 'react';
import { buildPrompt } from '../lib/buildPrompt';
import {  validateOutputWithSimilarity } from '../lib/validateOutput';
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
  trialLimit?: number;
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
      
      return {
        success: true,
        requiresPayment: true,
        resultId: id
      };
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des résultats:', error);
      setError('error.save_failed');
      
      return {
        success: false,
        requiresPayment: true,
        error: 'error.save_failed'
      };
    }
  }, [setError]);

  const processGeneration = useCallback(async (options: PromptOptions, referenceText: string) => {
    try {
      // Construction du prompt
      const prompt = buildPrompt(options);
      
      // Génération des phrases
      const rawResponse = await llmClient.generate(prompt, options);
    
      // Validation et formatage
      const validatedResults = validateOutputWithSimilarity(rawResponse, referenceText, 10);
      
      return validatedResults;
    } catch (error) {
      console.error('Erreur lors de la génération:', error);
      throw new Error(error instanceof Error ? error.message : 'Erreur de génération');
    }
  }, []);

  const handlePostGeneration = useCallback(async (
    results: GeneratedPhrase[],
    wasFreeTrial: boolean,
    options: PromptOptions
  ) => {
    try {
      // Incrémenter le compteur d'essai AVANT de vérifier le statut de paiement
      if (wasFreeTrial) {
        await incrementTrialCount();
      }

      // Vérification du statut de paiement post-génération
      const postPaymentStatus = await checkPaymentStatus();
      
      // Normaliser le statut de paiement pour garantir showResults comme boolean
      const normalizedPaymentStatus: PaymentStatus = {
        ...postPaymentStatus,
        showResults: postPaymentStatus.showResults ?? false
      };
      
      // Si l'utilisateur vient d'utiliser son dernier essai gratuit
      if (wasFreeTrial && 
          normalizedPaymentStatus.trialCount !== undefined && 
          normalizedPaymentStatus.trialLimit !== undefined &&
          normalizedPaymentStatus.trialCount >= normalizedPaymentStatus.trialLimit) {
        // Sauvegarder les résultats et rediriger vers le paiement
        return await handlePaymentRequired(results, {
          ...normalizedPaymentStatus,
          requiresPayment: true,
          showResults: false,
          reason: 'payment.trial_limit_reached'
        });
      }
      
      // Gérer l'affichage des résultats selon le statut de paiement
      if (normalizedPaymentStatus.requiresPayment || !normalizedPaymentStatus.showResults) {
        return await handlePaymentRequired(results, normalizedPaymentStatus);
      } else {
        setSuccess(results);
        return { 
          success: true, 
          requiresPayment: false, 
          phrases: results.map(phrase => ({
            ...phrase,
            tone: options.tone
          }))
        };
      }
    } catch (error) {
      console.error('Erreur post-génération:', error);
      setError('error.post_generation');
      return { success: false, error: 'error.post_generation' };
    }
  }, [handlePaymentRequired, setSuccess, setError]);

  const generate = useCallback(async (options: PromptOptions, referenceText: string) => {
    resetState();
    
    try {
      // Vérification initiale du statut de paiement
      const initialPaymentStatus = await checkPaymentStatus();
      
      if (!initialPaymentStatus.canGenerate) {
        setError('error.cannot_generate');
        return { success: false, error: 'error.cannot_generate' };
      }
      
      // Traitement de la génération
      const results = await processGeneration(options, referenceText);
      
      // Gestion post-génération
      const wasFreeTrial = !initialPaymentStatus.requiresPayment;
      return await handlePostGeneration(results, wasFreeTrial, options);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      console.error('Erreur dans generate:', errorMessage);
      setError(errorMessage);
      return { success: false, error: errorMessage };
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
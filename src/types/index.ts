import type { PromptOptions, Tone, GeneratedPhrase as BaseGeneratedPhrase } from './PromptOptions';

export type GenerationRequest = Omit<PromptOptions, 'format'>;

export type GeneratedPhrase = BaseGeneratedPhrase & { tone: Tone };

export interface AppState {
  currentStep: 'home' | 'generator' | 'payment' | 'results' | 'success';
  generationRequest: GenerationRequest | null;
  generatedPhrases: GeneratedPhrase[];
  isGenerating: boolean;
  isPaymentComplete: boolean;
  error: string | null;
  pendingResultId: string | null;
}

// Interface centralisée pour le statut de paiement
export interface PaymentStatus {
  canGenerate: boolean;
  requiresPayment: boolean;
  reason?: string;
  trialCount?: number;
  trialLimit?: number;
  showResults: boolean;
}
export type Tone = 'humoristique' | 'inspirant' | 'direct' | 'mysterieux' | 'luxueux' | 'techy';

export interface GenerationRequest {
  concept: string;
  tone: Tone;
  language: string;
}

export interface GeneratedPhrase {
  id: string;
  text: string;
  tone: Tone;
}

export interface AppState {
  currentStep: 'home' | 'generator' | 'payment' | 'results';
  generationRequest: GenerationRequest | null;
  generatedPhrases: GeneratedPhrase[];
  isGenerating: boolean;
  isPaymentComplete: boolean;
  error: string | null;
}
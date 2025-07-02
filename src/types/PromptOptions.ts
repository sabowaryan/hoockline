export type Format = 
  | 'tagline'
  | 'formation'
  | 'app_store'
  | 'hero_banner'
  | 'cta'
  | 'slogan'
  | 'ad_copy'
  | 'tweet'
  | 'email'
  | 'onboarding'
  | 'faq';

export type Tone = 
  | 'humoristique'
  | 'inspirant'
  | 'direct'
  | 'mysterieux'
  | 'luxueux'
  | 'techy'
  | 'émotionnel'
  | 'éducatif'
  | 'urgent'
  | 'provocateur'
  | 'minimaliste'
  | 'chaleureux'
  | 'autoritaire'
  | 'créatif'
  | 'motivant'
  | 'jeune'
  | 'professionnel'
  | 'ironique'
  | 'bienveillant';

export type Language = 'fr' | 'en' | 'en-US' | 'en-GB' | 'es' | 'de' | 'ar' | 'pt-BR';

export interface PromptOptions {
  concept: string;
  format: Format;
  tone: Tone;
  targetLanguage: Language;
  platform?: string;
  role?: string;
}

export interface GeneratedPhrase {
  id: string;
  text: string;
  score?: number;
  metadata?: {
    tone?: string;
    format?: string;
    platform?: string;
  };
}

export type FormatType = {
  id: Format;
  name: string;
  description: string;
  platforms: string[];
  roles: string[];
  maxLength?: number;
};

export type ToneType = {
  id: string;
  name: string;
  description: string;
  verbs: string[];
};

export type LanguageType = {
  code: Language;
  name: string;
  flag: string;
  culturalNotes: string[];
  formalityLevel: 'formal' | 'informal' | 'mixed';
};

export interface PaymentStatus {
  canGenerate: boolean;
  reason?: string;
  trialCount?: number;
  trialLimit?: number;
} 
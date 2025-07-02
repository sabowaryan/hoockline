// Contraintes globales par défaut
export const globalConstraints = {
    minWords: 2,
    maxWords: 8,
    noCliches: true,
    actionOriented: true,
    idiomatic: true,
    memorable: true,
    maxPunctuation: 2,
    avoidSuperlatives: ['très', 'plutôt', 'assez', 'vraiment'],
    forbiddenWords: ['meilleur', 'solution', 'révolutionnaire', 'innovant'],
    requiresEmotionalTrigger: true
  };
  
  // Contraintes spécifiques par format
  export const formatConstraints = {
    tagline: {
      minWords: 3,
      maxWords: 6,
      requiresAction: true,
      allowsEmojis: false,
      mustBeUnique: true,
      preferAlliteration: true,
      maxSyllables: 12,
      requiresBenefit: true
    },
    
    tweet: {
      minWords: 5,
      maxWords: 15,
      requiresHashtags: false,
      allowsEmojis: true,
      casualTone: true,
      maxCharacters: 100, // Pour laisser place aux hashtags
      requiresEngagement: true,
      allowsQuestions: true
    },
    
    cta: {
      minWords: 1,
      maxWords: 4,
      mustStartWithVerb: true,
      requiresUrgency: true,
      allowsEmojis: false,
      forcedImperative: true,
      maxSyllables: 8,
      requiresAction: true
    },
    
    email: {
      minWords: 4,
      maxWords: 8,
      personalTone: true,
      requiresCuriosity: true,
      allowsEmojis: true,
      avoidSpamWords: true,
      maxPunctuation: 1,
      requiresPersonalization: false
    },
    
    ad_copy: {
      minWords: 4,
      maxWords: 10,
      requiresBenefit: true,
      allowsEmojis: false,
      requiresProof: false,
      maxClaims: 1,
      requiresTargeting: true,
      allowsNumbers: true
    },
    
    hero_banner: {
      minWords: 3,
      maxWords: 7,
      impactful: true,
      requiresClearValue: true,
      allowsEmojis: false,
      mustBeVisuallyStrong: true,
      maxSyllables: 15,
      requiresBenefit: true
    },
    
    formation: {
      minWords: 4,
      maxWords: 8,
      educational: true,
      requiresLearningOutcome: true,
      allowsEmojis: false,
      professionalTone: true,
      requiresCredibility: true,
      maxJargon: 1
    },
    
    app_store: {
      minWords: 5,
      maxWords: 10,
      requiresFeatures: true,
      allowsEmojis: true,
      requiresUserBenefit: true,
      competitiveAngle: true,
      maxTechnicalTerms: 2,
      requiresDownloadTrigger: true
    },
    
    slogan: {
      minWords: 2,
      maxWords: 5,
      mustBeRhythmic: true,
      requiresMemorability: true,
      allowsEmojis: false,
      preferAlliteration: true,
      maxSyllables: 10,
      timeless: true
    },
    
    onboarding: {
      minWords: 4,
      maxWords: 8,
      welcoming: true,
      requiresGuidance: true,
      allowsEmojis: true,
      reassuring: true,
      maxComplexity: 'simple',
      requiresNextStep: true
    },
    
    faq: {
      minWords: 5,
      maxWords: 12,
      reassuring: true,
      requiresClarification: true,
      allowsEmojis: false,
      helpfulTone: true,
      mustAnswerObjection: true,
      maxTechnicalTerms: 1
    }
  };
  
  // Contraintes culturelles par langue
  export const culturalConstraints = {
    'fr': {
      avoidAnglicisms: true,
      preferFormalRegister: false,
      allowsContractions: true,
      prefersConcision: true,
      culturalReferences: ['cuisine', 'art de vivre', 'savoir-faire'],
      avoidedTerms: ['digital', 'insights', 'challenges'],
      preferredPunctuation: ['.', '!'],
      maxExclamations: 1
    },
    
    'en': {
      allowContractions: true,
      preferActiveForms: true,
      casualFriendly: true,
      allowsSlang: false,
      culturalReferences: ['hustle', 'game-changer', 'next-level'],
      preferredPunctuation: ['.', '!', '?'],
      maxExclamations: 2
    },
    
    'es': {
      expressiveTone: true,
      allowsEmphasis: true,
      familialApproach: true,
      allowsExclamations: true,
      culturalReferences: ['familia', 'comunidad', 'pasión'],
      preferredPunctuation: ['.', '!', '¿', '¡'],
      maxExclamations: 2
    },
    
    'de': {
      precisionFocused: true,
      prefersClarIty: true,
      allowsCompounds: true,
      formalDefault: true,
      culturalReferences: ['qualität', 'effizienz', 'innovation'],
      maxCompoundWords: 1,
      preferredPunctuation: ['.', '!']
    },
    
    'it': {
      passionateTone: true,
      allowsGesture: true,
      familyOriented: true,
      expressiveLanguage: true,
      culturalReferences: ['bella vita', 'tradizione', 'famiglia'],
      preferredPunctuation: ['.', '!', '...'],
      maxExclamations: 2
    }
  };
  
  // Contraintes par ton
  export const toneConstraints = {
    professional: {
      avoidSlang: true,
      formalLanguage: true,
      credibilityFocus: true,
      maxEmojis: 0,
      requiresExpertise: true
    },
    
    casual: {
      allowSlang: true,
      informalLanguage: true,
      friendlyApproach: true,
      maxEmojis: 2,
      conversational: true
    },
    
    urgent: {
      requiresTimeLimit: true,
      actionOriented: true,
      scarcityFocus: true,
      maxEmojis: 1,
      impactfulWords: true
    },
    
    playful: {
      allowsWordplay: true,
      humorAccepted: true,
      creativeLanguage: true,
      maxEmojis: 3,
      allowsRhymes: true
    },
    
    empathetic: {
      understandingTone: true,
      supportiveLanguage: true,
      reassuringApproach: true,
      maxEmojis: 2,
      warmVocabulary: true
    }
  };
  
  // Fonction pour obtenir les contraintes combinées
  export function getConstraints(format: string, language: string, tone: string) {
    const global = globalConstraints;
    const formatSpecific = formatConstraints[format as keyof typeof formatConstraints] || {};
    const cultural = culturalConstraints[language.split('-')[0] as keyof typeof culturalConstraints] || {};
    const toneSpecific = toneConstraints[tone as keyof typeof toneConstraints] || {};
    
    return {
      ...global,
      ...formatSpecific,
      ...cultural,
      ...toneSpecific
    };
  }
  
  // Fonction de validation
  export function validateContent(content: string, constraints: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    const words = content.split(' ').filter(word => word.length > 0);
    
    // Validation du nombre de mots
    if (words.length < constraints.minWords) {
      errors.push(`Trop peu de mots: ${words.length}/${constraints.minWords} minimum`);
    }
    
    if (words.length > constraints.maxWords) {
      errors.push(`Trop de mots: ${words.length}/${constraints.maxWords} maximum`);
    }
    
    // Validation des mots interdits
    if (constraints.forbiddenWords) {
      const foundForbidden = words.filter(word => 
        constraints.forbiddenWords.some((forbidden: string) => 
          word.toLowerCase().includes(forbidden.toLowerCase())
        )
      );
      if (foundForbidden.length > 0) {
        errors.push(`Mots interdits trouvés: ${foundForbidden.join(', ')}`);
      }
    }
    
    // Validation des superlatifs
    if (constraints.avoidSuperlatives) {
      const foundSuperlatives = words.filter(word => 
        constraints.avoidSuperlatives.some((sup: string) => 
          word.toLowerCase().includes(sup.toLowerCase())
        )
      );
      if (foundSuperlatives.length > 0) {
        errors.push(`Superlatifs à éviter: ${foundSuperlatives.join(', ')}`);
      }
    }
    
    // Validation du verbe en début (pour CTA)
    if (constraints.mustStartWithVerb) {
      const firstWord = words[0]?.toLowerCase();
      const commonVerbs = ['commencez', 'démarrez', 'essayez', 'téléchargez', 'obtenez', 'réservez', 'découvrez'];
      if (!commonVerbs.some(verb => firstWord?.startsWith(verb.slice(0, 4)))) {
        errors.push('Doit commencer par un verbe d\'action');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  // Export des types pour TypeScript
  export type FormatConstraints = typeof formatConstraints;
  export type CulturalConstraints = typeof culturalConstraints;
  export type ToneConstraints = typeof toneConstraints;
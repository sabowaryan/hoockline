import { LanguageType } from '../types/PromptOptions';

export const languages: LanguageType[] = [
  {
    code: 'fr',
    name: 'Français',
    flag: '🇫🇷',
    culturalNotes: [
      'Éviter les anglicismes',
      'Respecter le vouvoiement dans les contextes pro',
      'Adapter à la culture latine/romane'
    ],
    formalityLevel: 'formal'
  },
  {
    code: 'en-US',
    name: 'English (US)',
    flag: '🇺🇸',
    culturalNotes: [
      'Ton direct et énergique',
      'Idiomes et références américaines',
      'Formules orientées action'
    ],
    formalityLevel: 'informal'
  },
  {
    code: 'en-GB',
    name: 'English (UK)',
    flag: '🇬🇧',
    culturalNotes: [
      'Plus formel',
      'Références culturelles locales',
      'Humour subtil'
    ],
    formalityLevel: 'formal'
  },
  {
    code: 'es',
    name: 'Español',
    flag: '🇪🇸',
    culturalNotes: [
      'Ton émotionnel et chaleureux',
      'Idiomes typiques',
      'Importance de la famille et du ressenti'
    ],
    formalityLevel: 'mixed'
  },
  {
    code: 'de',
    name: 'Deutsch',
    flag: '🇩🇪',
    culturalNotes: [
      'Ton structuré et crédible',
      'Peu de superlatifs',
      'Précision et fiabilité mises en avant'
    ],
    formalityLevel: 'formal'
  },
  {
    code: 'ar',
    name: 'العربية',
    flag: '🇸🇦',
    culturalNotes: [
      'Respect du registre formel',
      'Références à la réussite',
      'Respect des normes culturelles et religieuses'
    ],
    formalityLevel: 'formal'
  },
  {
    code: 'pt-BR',
    name: 'Português (BR)',
    flag: '🇧🇷',
    culturalNotes: [
      'Ton détendu',
      'Affectif',
      'Culturellement vivant',
      'Éviter l\'excès de formalisme'
    ],
    formalityLevel: 'informal'
  }
];

import { PromptOptions } from '../types/PromptOptions';
import { formats } from '../data/formats';
import { tones } from '../data/tones';
import { languages } from '../data/languages';
import { getConstraints, validateContent } from '../data/constraints';

// Cache pour éviter les recherches répétées
const formatCache = new Map(formats.map(f => [f.value.id, f]));
const toneCache = new Map(tones.map(t => [t.value, t]));
const languageCache = new Map(languages.map(l => [l.code, l]));

// Mapping spécifique pour les noms dans les prompts (pluriels naturels en français)
const formatNameMapping = {
  'tagline': 'slogans de startup',
  'formation': 'titres de formation',
  'app_store': 'descriptions d\'application',
  'hero_banner': 'titres principaux',
  'cta': 'boutons d\'action (CTA)',
  'slogan': 'accroches publicitaires',
  'ad_copy': 'publicités persuasives',
  'tweet': 'tweets',
  'email': 'phrases d\'introduction',
  'onboarding': 'messages de bienvenue',
  'faq': 'réponses aux objections'
} as const;

// Fonction pour obtenir le nom optimisé pour le prompt
function getFormatNameForPrompt(formatId: string): string {
  return formatNameMapping[formatId as keyof typeof formatNameMapping] || formatId;
}

// Fonction pour générer les contraintes dynamiques basées sur les règles
function generateConstraintsText(constraints: any, language: string): string[] {
  const constraintsList: string[] = [];
  
  // Contraintes de base
  constraintsList.push(`1. ${constraints.minWords}-${constraints.maxWords} mots maximum par phrase`);
  constraintsList.push('2. Chaque mot doit être stratégique, aucun mot inutile');
  constraintsList.push('3. Phrases ultra-mémorables, faciles à répéter');
  constraintsList.push(`4. Parfaitement naturelles et idiomatiques en ${language}`);
  
  // Contraintes spécifiques au format
  if (constraints.mustStartWithVerb) {
    constraintsList.push('5. OBLIGATOIRE: Commencer par un verbe d\'action à l\'impératif');
  }
  
  if (constraints.requiresBenefit) {
    constraintsList.push('5. Inclure un bénéfice client clair et tangible');
  }
  
  if (constraints.requiresUrgency) {
    constraintsList.push('6. Créer un sentiment d\'urgence subtil mais efficace');
  }
  
  if (constraints.noCliches) {
    constraintsList.push('7. Zéro cliché, pas de blabla marketing générique');
  }
  
  if (constraints.preferAlliteration) {
    constraintsList.push('8. Privilégier les allitérations et sons impactants');
  }
  
  if (constraints.maxSyllables) {
    constraintsList.push(`9. Maximum ${constraints.maxSyllables} syllabes au total`);
  }
  
  // Contraintes culturelles
  if (constraints.avoidAnglicisms) {
    constraintsList.push('10. Éviter les anglicismes, utiliser du français pur');
  }
  
  if (constraints.allowsEmojis) {
    constraintsList.push('11. Emojis autorisés si ils renforcent le message');
  } else {
    constraintsList.push('11. Aucun emoji, texte pur uniquement');
  }
  
  return constraintsList;
}

// Fonction pour générer les techniques spécifiques au format
function generateTechniques(constraints: any): string[] {
  const techniques: string[] = [
    '- Sons impactants : allitérations, répétitions',
    '- Rythme fluide : mots courts/longs alternés',
    '- Vocabulaire émotionnel et bénéfices clairs'
  ];
  
  if (constraints.requiresUrgency) {
    techniques.push('- Urgence subtile et moderne');
  }
  
  if (constraints.allowsWordplay) {
    techniques.push('- Jeux de mots créatifs et mémorables');
  }
  
  if (constraints.preferAlliteration) {
    techniques.push('- Allitérations pour un impact sonore');
  }
  
  if (constraints.requiresPersonalization) {
    techniques.push('- Personnalisation et proximité avec le lecteur');
  }
  
  if (constraints.requiresEngagement) {
    techniques.push('- Déclencheurs d\'engagement et d\'interaction');
  }
  
  techniques.push('- Références culturelles pertinentes');
  
  return techniques;
}

// Fonction pour générer les exemples spécifiques au format
function generateExamples(formatId: string): { good: string; bad: string } {
  const examples = {
    tagline: {
      good: 'Gérez votre argent en un geste',
      bad: 'La meilleure application pour tous vos besoins financiers'
    },
    cta: {
      good: 'Commencez maintenant',
      bad: 'Cliquez ici pour découvrir notre solution révolutionnaire'
    },
    tweet: {
      good: 'Stop aux emails perdus 📧',
      bad: 'Notre plateforme révolutionnaire va changer votre façon de travailler'
    },
    email: {
      good: 'Votre productivité va exploser',
      bad: 'Nous avons une solution innovante à vous présenter'
    },
    ad_copy: {
      good: 'Économisez 3h par jour',
      bad: 'La meilleure solution du marché pour optimiser votre temps'
    },
    hero_banner: {
      good: 'Créez sans limites',
      bad: 'Notre plateforme innovante vous permet de créer tout ce que vous voulez'
    }
  };
  
  return examples[formatId as keyof typeof examples] || examples.tagline;
}

// Version optimisée pour la performance avec contraintes dynamiques
export function buildPrompt(options: PromptOptions): string {
  const format = formatCache.get(options.format);
  const tone = toneCache.get(options.tone);
  const language = languageCache.get(options.targetLanguage);
  
  if (!format || !tone || !language) {
    throw new Error(`Invalid options: format=${!!format}, tone=${!!tone}, language=${!!language}`);
  }

  // Récupération des contraintes combinées
  const constraints = getConstraints(options.format, options.targetLanguage, options.tone);
  
  const languageCode = options.targetLanguage.split('-')[0];
  const verbs = tone.verbs[languageCode] ?? tone.verbs['fr'];
  const formatNameForPrompt = getFormatNameForPrompt(options.format);
  
  // Génération dynamique des contraintes et techniques
  const constraintsList = generateConstraintsText(constraints, language.name);
  const techniques = generateTechniques(constraints);
  const examples = generateExamples(options.format);
  
  // Mots interdits spécifiques
  const forbiddenWords = constraints.forbiddenWords || [];
  const avoidSuperlatives = constraints.avoidSuperlatives || [];
  
  // Utilisation d'un array puis join() pour éviter les concaténations multiples
  const parts = [
    `Tu es un ${format.role} expert de haut niveau, spécialisé dans la création de contenu pour ${format.platform}.`,
    `${format.roleDescription}, multilingue, expert en psychologie du consommateur et en nuances culturelles locales. Tu crées des phrases d'accroche qui convertissent immédiatement.`,
    '',
    '🎯 OBJECTIF :',
    `Génère exactement 10 ${formatNameForPrompt} irrésistibles pour le concept suivant :`,
    `"${options.concept}"`,
    '',
    `🗣️ LANGUE DE SORTIE : ${language.name.toUpperCase()}`,
    `🎭 TON REQUIS : ${tone.label.toUpperCase()}`,
    `Utilisez les verbes d'action : ${verbs.join(', ')}`,
    '',
    '📏 CONTRAINTES STRICTES :',
    ...constraintsList,
    `Culturellement adaptées à la langue cible (${language.culturalNotes.join(', ')})`,
    '',
    '💡 TECHNIQUES À UTILISER :',
    ...techniques,
    '',
    '🧪 EXEMPLES :',
    `✅ Bon : "${examples.good}"`,
    `❌ Mauvais : "${examples.bad}"`,
    '',
    '🚫 À ÉVITER ABSOLUMENT :',
    '- Généralités sans impact ("La meilleure solution", etc.)',
    ...(avoidSuperlatives.length > 0 ? [`- Superlatifs vagues (${avoidSuperlatives.join(', ')})`] : []),
    ...(forbiddenWords.length > 0 ? [`- Mots interdits (${forbiddenWords.join(', ')})`] : []),
    '- Jargon technique froid',
    '- Traductions maladroites',
    ...(constraints?.avoidAnglicisms ? ['- Anglicismes et termes non-français'] : []),
    '',
    '✅ TEST FINAL POUR CHAQUE PHRASE :',
    `> "Est-ce que cette phrase me donne vraiment envie d'agir (cliquer, acheter, tester), dans la culture ${language.name} ?"`,
    ...(constraints?.mustStartWithVerb ? ['> "Est-ce que ça commence bien par un verbe d\'action à l\'impératif ?"'] : []),
    ...(constraints?.requiresBenefit ? ['> "Le bénéfice client est-il clair et immédiat ?"'] : []),
    '',
    '📤 FORMAT DE SORTIE OBLIGATOIRE :',
    `Réponds UNIQUEMENT avec les 10 ${formatNameForPrompt}, en ${language.name}, un par ligne, sans numérotation, sans commentaires ni balises.`,
    '',
    'GÉNÈRE MAINTENANT :'
  ];
  
  return parts.join('\n');
}

// Fonction pour valider le concept avant génération
export function validateConcept(options: PromptOptions): { isValid: boolean; errors: string[]; warnings: string[] } {
  const constraints = getConstraints(options.format, options.targetLanguage, options.tone);
  const validation = validateContent(options.concept, constraints);
  
  const warnings: string[] = [];
  
  // Avertissements spécifiques
  if (options.concept.length < 10) {
    warnings.push('Concept très court - considérez ajouter plus de contexte');
  }
  
  if (options.concept.includes('startup') && options.format === 'formation') {
    warnings.push('Format "formation" peu adapté pour une startup');
  }
  
  if (constraints?.mustStartWithVerb && options.format === 'cta') {
    warnings.push('N\'oubliez pas: les CTA doivent commencer par un verbe d\'action');
  }
  
  return {
    isValid: validation.isValid,
    errors: validation.errors,
    warnings
  };
}

// Export du mapping et fonctions utilitaires
export { 
  formatNameMapping, 
  getFormatNameForPrompt, 
  generateConstraintsText,
  generateTechniques,
  generateExamples
};
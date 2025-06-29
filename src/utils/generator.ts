import { Tone, GeneratedPhrase } from '../types';

const phraseTemplates: Record<Tone, string[]> = {
  humoristique: [
    "{{concept}} : Parce que {emotion} c'est surfait",
    "{{concept}} qui ne vous fera pas {action} (promis)",
    "L'{{concept}} qui {action} mieux que votre {object}",
    "{{concept}} : {emotion} garantie ou remboursé",
    "Enfin une {{concept}} qui ne vous {action} pas",
    "{{concept}} : Comme {comparison}, mais en {adjective}",
    "L'{{concept}} qui {action} pendant que vous {activity}",
    "{{concept}} : {emotion} niveau expert",
    "Votre {{concept}} préférée (après {popular_thing})",
    "{{concept}} : {action} sans {negative_consequence}"
  ],
  inspirant: [
    "{{concept}} : Transformez vos {dreams} en {reality}",
    "L'{{concept}} qui libère votre {potential}",
    "{{concept}} : Parce que vous méritez {achievement}",
    "Révolutionnez votre {life_area} avec {{concept}}",
    "{{concept}} : Votre partenaire vers {success}",
    "L'{{concept}} qui fait de vos {obstacles} des {opportunities}",
    "{{concept}} : Créez l'impact que vous souhaitez",
    "Évoluez. Grandissez. Réussissez avec {{concept}}",
    "{{concept}} : Votre voyage vers {excellence} commence ici",
    "L'{{concept}} qui transforme {challenges} en {victories}"
  ],
  direct: [
    "{{concept}} qui {action}. Point.",
    "{{concept}} : {benefit}. C'est tout.",
    "L'{{concept}} qui {action} vraiment",
    "{{concept}} : {result} garanti",
    "Plus besoin de {struggle}. {{concept}} est là",
    "{{concept}} : {action} en {time_frame}",
    "L'{{concept}} qui {solves} votre problème",
    "{{concept}} : {benefit}. Immédiatement",
    "Fini les {problems}. Place à {{concept}}",
    "{{concept}} : {action}. Efficacement."
  ],
  mysterieux: [
    "Le secret derrière {{concept}} que {authority} ne veulent pas révéler",
    "{{concept}} : Ce que {experts} savent et vous ignorez",
    "L'{{concept}} cachée qui change tout",
    "Découvrez le mystère de {{concept}}",
    "{{concept}} : La méthode secrète des {successful_people}",
    "Ce que {{concept}} révèle sur {hidden_truth}",
    "L'{{concept}} interdite qui {transformative_action}",
    "{{concept}} : Le code secret pour {desired_outcome}",
    "Pourquoi {{concept}} est le secret le mieux gardé",
    "L'{{concept}} que {competition} espère que vous n'utiliserez jamais"
  ],
  luxueux: [
    "{{concept}} : L'excellence à l'état pur",
    "L'{{concept}} premium que vous méritez",
    "{{concept}} : Raffinement et {quality} exceptionnelle",
    "L'art de {{concept}} redéfini",
    "{{concept}} : Quand {luxury} rencontre {innovation}",
    "L'{{concept}} exclusive pour les {connoisseurs}",
    "{{concept}} : Créée pour l'élite",
    "L'expérience {{concept}} haut de gamme",
    "{{concept}} : Luxe, élégance et {sophistication}",
    "L'{{concept}} signature des {elite_group}"
  ],
  techy: [
    "{{concept}} powered by {advanced_tech}",
    "L'{{concept}} next-gen qui {disrupts} tout",
    "{{concept}} : Intelligence artificielle meets {domain}",
    "L'{{concept}} smart qui s'adapte à vous",
    "{{concept}} 2.0 : {innovation} réinventée",
    "L'{{concept}} connectée qui {connects} votre {ecosystem}",
    "{{concept}} : Algorithmes {advanced} pour {optimization}",
    "L'{{concept}} automatisée qui {automates} votre {workflow}",
    "{{concept}} : Machine learning pour {personalization}",
    "L'{{concept}} intelligente qui prédit vos {needs}"
  ]
};

const conceptVariables: Record<string, string[]> = {
  emotion: ['le stress', 'l\'ennui', 'la frustration', 'l\'anxiété', 'la peur'],
  action: ['décevoir', 'perdre du temps', 'compliquer', 'vous embêter', 'vous ralentir'],
  object: ['concurrent', 'chat', 'café', 'smartphone', 'ordinateur'],
  activity: ['dormez', 'mangez', 'regardez Netflix', 'travaillez', 'rêvez'],
  comparison: ['Netflix', 'Google', 'Tesla', 'Apple', 'Amazon'],
  adjective: ['mieux', 'plus rapide', 'plus simple', 'plus smart', 'plus cool'],
  dreams: ['rêves', 'ambitions', 'objectifs', 'aspirations', 'visions'],
  reality: ['réalité', 'succès', 'résultats', 'accomplissements', 'victoires'],
  potential: ['potentiel', 'talent', 'créativité', 'génie', 'force'],
  achievement: ['le succès', 'la réussite', 'l\'excellence', 'la reconnaissance', 'l\'impact'],
  life_area: ['vie', 'carrière', 'business', 'quotidien', 'futur'],
  success: ['le succès', 'l\'excellence', 'la réussite', 'l\'accomplissement', 'la victoire'],
  obstacles: ['défis', 'problèmes', 'obstacles', 'difficultés', 'barrières'],
  opportunities: ['opportunités', 'succès', 'avantages', 'bénéfices', 'solutions'],
  excellence: ['l\'excellence', 'la maîtrise', 'la perfection', 'le succès', 'l\'élite'],
  challenges: ['défis', 'obstacles', 'difficultés', 'problèmes', 'barrières'],
  victories: ['victoires', 'succès', 'triomphes', 'accomplissements', 'réussites'],
  benefit: ['Ça marche', 'Résultats garantis', 'Efficace', 'Rapide', 'Simple'],
  result: ['Résultat', 'Succès', 'Performance', 'Efficacité', 'Impact'],
  struggle: ['galérer', 'perdre du temps', 'vous compliquer la vie', 'stresser', 'chercher'],
  time_frame: ['24h', '7 jours', 'une semaine', 'un mois', 'temps record'],
  solves: ['résout', 'règle', 'élimine', 'supprime', 'corrige'],
  problems: ['complications', 'problèmes', 'galères', 'difficultés', 'obstacles'],
  authority: ['les experts', 'les leaders', 'les pros', 'l\'industrie', 'la concurrence'],
  experts: ['les professionnels', 'les spécialistes', 'les leaders', 'les experts', 'l\'élite'],
  successful_people: ['leaders', 'entrepreneurs', 'innovateurs', 'visionnaires', 'experts'],
  hidden_truth: ['votre potentiel', 'le succès', 'l\'innovation', 'la performance', 'l\'avenir'],
  transformative_action: ['change tout', 'révolutionne', 'transforme', 'optimise', 'améliore'],
  desired_outcome: ['le succès', 'la performance', 'l\'excellence', 'l\'innovation', 'l\'impact'],
  competition: ['vos concurrents', 'l\'industrie', 'les autres', 'la concurrence', 'le marché'],
  quality: ['performance', 'innovation', 'élégance', 'sophistication', 'précision'],
  luxury: ['le luxe', 'l\'élégance', 'la sophistication', 'le raffinement', 'l\'exclusivité'],
  innovation: ['l\'innovation', 'la technologie', 'la créativité', 'l\'excellence', 'la performance'],
  connoisseurs: ['connaisseurs', 'experts', 'passionnés', 'perfectionnistes', 'visionnaires'],
  sophistication: ['performance', 'innovation', 'excellence', 'précision', 'raffinement'],
  elite_group: ['leaders', 'innovateurs', 'visionnaires', 'entrepreneurs', 'experts'],
  advanced_tech: ['l\'IA', 'blockchain', 'machine learning', 'l\'automatisation', 'l\'IoT'],
  disrupts: ['révolutionne', 'transforme', 'optimise', 'automatise', 'simplifie'],
  domain: ['l\'innovation', 'la performance', 'l\'efficacité', 'l\'expérience', 'la productivité'],
  connects: ['synchronise', 'optimise', 'connecte', 'intègre', 'unifie'],
  ecosystem: ['workflow', 'environnement', 'écosystème', 'système', 'processus'],
  advanced: ['sophistiqués', 'intelligents', 'adaptatifs', 'prédictifs', 'optimisés'],
  optimization: ['l\'optimisation', 'la performance', 'l\'efficacité', 'la productivité', 'l\'excellence'],
  automates: ['automatise', 'optimise', 'simplifie', 'accélère', 'perfectionne'],
  workflow: ['processus', 'workflow', 'routine', 'système', 'méthode'],
  personalization: ['la personnalisation', 'l\'adaptation', 'l\'optimisation', 'la précision', 'l\'intelligence'],
  needs: ['besoins', 'préférences', 'objectifs', 'attentes', 'désirs']
};

function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function fillTemplate(template: string, concept: string): string {
  let filled = template.replace(/\{\{concept\}\}/g, concept);
  
  const variableRegex = /\{(\w+)\}/g;
  filled = filled.replace(variableRegex, (match, variable) => {
    if (conceptVariables[variable]) {
      return getRandomItem(conceptVariables[variable]);
    }
    return match;
  });
  
  return filled;
}

export function generateCatchphrases(concept: string, tone: Tone): GeneratedPhrase[] {
  const templates = phraseTemplates[tone];
  const phrases: GeneratedPhrase[] = [];
  
  // Generate 10 unique phrases
  const usedTemplates = new Set<number>();
  
  while (phrases.length < 10 && usedTemplates.size < templates.length) {
    const templateIndex = Math.floor(Math.random() * templates.length);
    
    if (!usedTemplates.has(templateIndex)) {
      usedTemplates.add(templateIndex);
      const template = templates[templateIndex];
      const filledPhrase = fillTemplate(template, concept);
      
      phrases.push({
        id: `phrase-${phrases.length + 1}`,
        text: filledPhrase,
        tone
      });
    }
  }
  
  // If we run out of templates, reuse them with different random variables
  while (phrases.length < 10) {
    const template = getRandomItem(templates);
    const filledPhrase = fillTemplate(template, concept);
    
    phrases.push({
      id: `phrase-${phrases.length + 1}`,
      text: filledPhrase,
      tone
    });
  }
  
  return phrases;
}
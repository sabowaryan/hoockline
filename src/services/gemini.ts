import { GoogleGenerativeAI } from '@google/generative-ai';
import { Tone } from '../types';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const languageMap: Record<string, string> = {
  'fr': 'français',
  'en': 'anglais',
  'es': 'espagnol',
  'de': 'allemand',
  'it': 'italien',
  'pt': 'portugais'
};

const toneInstructions: Record<Tone, Record<string, string>> = {
  humoristique: {
    fr: `
    - Utilise l'ironie, les jeux de mots, les références pop culture françaises
    - Crée de la surprise avec des tournures inattendues
    - Joue sur les contrastes et les paradoxes
    - Évite l'humour lourd, privilégie la finesse française
    - Exemples de structures : "X qui ne vous Y pas", "Enfin un X qui Z"`,
    en: `
    - Use irony, wordplay, and pop culture references
    - Create surprise with unexpected turns
    - Play with contrasts and paradoxes
    - Avoid heavy humor, prefer wit and cleverness
    - Example structures: "X that doesn't Y you", "Finally an X that Z"`,
    es: `
    - Usa ironía, juegos de palabras y referencias de cultura pop
    - Crea sorpresa con giros inesperados
    - Juega con contrastes y paradojas
    - Evita el humor pesado, prefiere la sutileza
    - Estructuras ejemplo: "X que no te Y", "Por fin un X que Z"`,
    de: `
    - Verwende Ironie, Wortspiele und Popkultur-Referenzen
    - Schaffe Überraschung mit unerwarteten Wendungen
    - Spiele mit Kontrasten und Paradoxen
    - Vermeide schweren Humor, bevorzuge Finesse
    - Beispielstrukturen: "X das Sie nicht Y", "Endlich ein X das Z"`,
    it: `
    - Usa ironia, giochi di parole e riferimenti alla cultura pop
    - Crea sorpresa con svolte inaspettate
    - Gioca con contrasti e paradossi
    - Evita l'umorismo pesante, privilegia la finezza
    - Strutture esempio: "X che non ti Y", "Finalmente un X che Z"`,
    pt: `
    - Use ironia, jogos de palavras e referências da cultura pop
    - Crie surpresa com reviravoltas inesperadas
    - Brinque com contrastes e paradoxos
    - Evite humor pesado, privilegie a sutileza
    - Estruturas exemplo: "X que não te Y", "Finalmente um X que Z"`
  },
  
  inspirant: {
    fr: `
    - Utilise des verbes d'action puissants (transformez, libérez, créez, révolutionnez)
    - Évoque la réussite, le dépassement, l'accomplissement
    - Parle directement aux aspirations de l'utilisateur
    - Utilise "votre", "vous" pour personnaliser
    - Exemples de structures : "Transformez vos X en Y", "Libérez votre X"`,
    en: `
    - Use powerful action verbs (transform, unleash, create, revolutionize)
    - Evoke success, achievement, accomplishment
    - Speak directly to user aspirations
    - Use "your", "you" for personalization
    - Example structures: "Transform your X into Y", "Unleash your X"`,
    es: `
    - Usa verbos de acción poderosos (transforma, libera, crea, revoluciona)
    - Evoca éxito, superación, logro
    - Habla directamente a las aspiraciones del usuario
    - Usa "tu", "tus" para personalizar
    - Estructuras ejemplo: "Transforma tus X en Y", "Libera tu X"`,
    de: `
    - Verwende kraftvolle Aktionsverben (verwandeln, befreien, erschaffen, revolutionieren)
    - Evoziere Erfolg, Überwindung, Leistung
    - Spreche direkt zu den Bestrebungen des Nutzers
    - Verwende "Ihr", "Sie" zur Personalisierung
    - Beispielstrukturen: "Verwandeln Sie Ihr X in Y", "Befreien Sie Ihr X"`,
    it: `
    - Usa verbi d'azione potenti (trasforma, libera, crea, rivoluziona)
    - Evoca successo, superamento, realizzazione
    - Parla direttamente alle aspirazioni dell'utente
    - Usa "il tuo", "tu" per personalizzare
    - Strutture esempio: "Trasforma i tuoi X in Y", "Libera il tuo X"`,
    pt: `
    - Use verbos de ação poderosos (transforme, liberte, crie, revolucione)
    - Evoque sucesso, superação, conquista
    - Fale diretamente às aspirações do usuário
    - Use "seu", "você" para personalizar
    - Estruturas exemplo: "Transforme seus X em Y", "Liberte seu X"`
  },
  
  direct: {
    fr: `
    - Phrases ultra-courtes (4-6 mots maximum)
    - Verbes à l'impératif ou affirmations catégoriques
    - Supprime tous les mots superflus
    - Utilise la ponctuation forte (points, points d'exclamation)
    - Exemples de structures : "X. Point.", "Plus de Y. X.", "X qui marche."`,
    en: `
    - Ultra-short phrases (4-6 words maximum)
    - Imperative verbs or categorical statements
    - Remove all superfluous words
    - Use strong punctuation (periods, exclamation marks)
    - Example structures: "X. Period.", "No more Y. X.", "X that works."`,
    es: `
    - Frases ultra-cortas (4-6 palabras máximo)
    - Verbos imperativos o afirmaciones categóricas
    - Elimina todas las palabras superfluas
    - Usa puntuación fuerte (puntos, exclamaciones)
    - Estructuras ejemplo: "X. Punto.", "No más Y. X.", "X que funciona."`,
    de: `
    - Ultra-kurze Sätze (4-6 Wörter maximal)
    - Imperativverben oder kategorische Aussagen
    - Entferne alle überflüssigen Wörter
    - Verwende starke Interpunktion (Punkte, Ausrufezeichen)
    - Beispielstrukturen: "X. Punkt.", "Kein Y mehr. X.", "X das funktioniert."`,
    it: `
    - Frasi ultra-brevi (4-6 parole massimo)
    - Verbi imperativi o affermazioni categoriche
    - Rimuovi tutte le parole superflue
    - Usa punteggiatura forte (punti, esclamazioni)
    - Strutture esempio: "X. Punto.", "Basta Y. X.", "X che funziona."`,
    pt: `
    - Frases ultra-curtas (4-6 palavras máximo)
    - Verbos imperativos ou afirmações categóricas
    - Remova todas as palavras supérfluas
    - Use pontuação forte (pontos, exclamações)
    - Estruturas exemplo: "X. Ponto.", "Chega de Y. X.", "X que funciona."`
  },
  
  mysterieux: {
    fr: `
    - Pose des questions intrigantes ou utilise des affirmations énigmatiques
    - Évoque des secrets, des méthodes cachées, des révélations
    - Utilise "ce que", "pourquoi", "le secret de"
    - Crée de la curiosité sans tout révéler
    - Exemples de structures : "Le secret que X cache", "Ce que Y ne dit pas"`,
    en: `
    - Ask intriguing questions or use enigmatic statements
    - Evoke secrets, hidden methods, revelations
    - Use "what", "why", "the secret of"
    - Create curiosity without revealing everything
    - Example structures: "The secret X hides", "What Y doesn't tell you"`,
    es: `
    - Haz preguntas intrigantes o usa afirmaciones enigmáticas
    - Evoca secretos, métodos ocultos, revelaciones
    - Usa "lo que", "por qué", "el secreto de"
    - Crea curiosidad sin revelar todo
    - Estructuras ejemplo: "El secreto que X oculta", "Lo que Y no te dice"`,
    de: `
    - Stelle faszinierende Fragen oder verwende rätselhafte Aussagen
    - Evoziere Geheimnisse, versteckte Methoden, Enthüllungen
    - Verwende "was", "warum", "das Geheimnis von"
    - Schaffe Neugier ohne alles zu verraten
    - Beispielstrukturen: "Das Geheimnis das X verbirgt", "Was Y Ihnen nicht sagt"`,
    it: `
    - Fai domande intriganti o usa affermazioni enigmatiche
    - Evoca segreti, metodi nascosti, rivelazioni
    - Usa "quello che", "perché", "il segreto di"
    - Crea curiosità senza rivelare tutto
    - Strutture esempio: "Il segreto che X nasconde", "Quello che Y non ti dice"`,
    pt: `
    - Faça perguntas intrigantes ou use afirmações enigmáticas
    - Evoque segredos, métodos ocultos, revelações
    - Use "o que", "por que", "o segredo de"
    - Crie curiosidade sem revelar tudo
    - Estruturas exemplo: "O segredo que X esconde", "O que Y não te conta"`
  },
  
  luxueux: {
    fr: `
    - Vocabulaire raffiné et sophistiqué (excellence, raffinement, exclusivité)
    - Évoque la rareté, la qualité supérieure, l'élite
    - Utilise des termes comme "premium", "signature", "collection"
    - Suggère l'appartenance à un cercle privilégié
    - Exemples de structures : "L'excellence X", "X signature", "Pour les connaisseurs de Y"`,
    en: `
    - Refined and sophisticated vocabulary (excellence, refinement, exclusivity)
    - Evoke rarity, superior quality, elite
    - Use terms like "premium", "signature", "collection"
    - Suggest belonging to a privileged circle
    - Example structures: "Excellence in X", "Signature X", "For connoisseurs of Y"`,
    es: `
    - Vocabulario refinado y sofisticado (excelencia, refinamiento, exclusividad)
    - Evoca rareza, calidad superior, élite
    - Usa términos como "premium", "signature", "colección"
    - Sugiere pertenencia a un círculo privilegiado
    - Estructuras ejemplo: "La excelencia en X", "X signature", "Para conocedores de Y"`,
    de: `
    - Raffiniertes und anspruchsvolles Vokabular (Exzellenz, Verfeinerung, Exklusivität)
    - Evoziere Seltenheit, überlegene Qualität, Elite
    - Verwende Begriffe wie "Premium", "Signature", "Kollektion"
    - Suggeriere Zugehörigkeit zu einem privilegierten Kreis
    - Beispielstrukturen: "Exzellenz in X", "Signature X", "Für Kenner von Y"`,
    it: `
    - Vocabolario raffinato e sofisticato (eccellenza, raffinatezza, esclusività)
    - Evoca rarità, qualità superiore, élite
    - Usa termini come "premium", "signature", "collezione"
    - Suggerisci appartenenza a una cerchia privilegiata
    - Strutture esempio: "L'eccellenza in X", "X signature", "Per intenditori di Y"`,
    pt: `
    - Vocabulário refinado e sofisticado (excelência, refinamento, exclusividade)
    - Evoque raridade, qualidade superior, elite
    - Use termos como "premium", "signature", "coleção"
    - Sugira pertencimento a um círculo privilegiado
    - Estruturas exemplo: "A excelência em X", "X signature", "Para conhecedores de Y"`
  },
  
  techy: {
    fr: `
    - Utilise le vocabulaire tech (IA, algorithme, smart, connecté, automatisé)
    - Évoque l'innovation, la disruption, l'avenir
    - Mélange français et anglicismes tech acceptés
    - Suggère l'efficacité et l'optimisation
    - Exemples de structures : "X powered by Y", "L'X intelligent qui Z", "X 2.0"`,
    en: `
    - Use tech vocabulary (AI, algorithm, smart, connected, automated)
    - Evoke innovation, disruption, future
    - Mix technical terms naturally
    - Suggest efficiency and optimization
    - Example structures: "X powered by Y", "Smart X that Z", "X 2.0"`,
    es: `
    - Usa vocabulario tech (IA, algoritmo, smart, conectado, automatizado)
    - Evoca innovación, disrupción, futuro
    - Mezcla términos técnicos naturalmente
    - Sugiere eficiencia y optimización
    - Estructuras ejemplo: "X powered by Y", "X inteligente que Z", "X 2.0"`,
    de: `
    - Verwende Tech-Vokabular (KI, Algorithmus, smart, vernetzt, automatisiert)
    - Evoziere Innovation, Disruption, Zukunft
    - Mische technische Begriffe natürlich
    - Suggeriere Effizienz und Optimierung
    - Beispielstrukturen: "X powered by Y", "Intelligentes X das Z", "X 2.0"`,
    it: `
    - Usa vocabolario tech (IA, algoritmo, smart, connesso, automatizzato)
    - Evoca innovazione, disruption, futuro
    - Mescola termini tecnici naturalmente
    - Suggerisci efficienza e ottimizzazione
    - Strutture esempio: "X powered by Y", "X intelligente che Z", "X 2.0"`,
    pt: `
    - Use vocabulário tech (IA, algoritmo, smart, conectado, automatizado)
    - Evoque inovação, disrupção, futuro
    - Misture termos técnicos naturalmente
    - Sugira eficiência e otimização
    - Estruturas exemplo: "X powered by Y", "X inteligente que Z", "X 2.0"`
  }
};

export async function generateCatchphrasesWithAI(concept: string, tone: Tone, language: string = 'fr'): Promise<string[]> {
  const model = genAI.getGenerativeModel({ 
    model: 'gemini-2.0-flash-exp',
    generationConfig: {
      temperature: 0.9,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 1000,
    }
  });
  
  const targetLanguage = languageMap[language] || 'français';
  const toneInstruction = toneInstructions[tone][language] || toneInstructions[tone]['fr'];
  
  const prompt = `Tu es un copywriter expert multilingue, spécialisé dans les slogans qui convertissent. Tu maîtrises parfaitement la psychologie du consommateur et les nuances culturelles.

🎯 MISSION PRÉCISE :
Crée exactement 10 phrases d'accroche commerciales pour : "${concept}"
LANGUE DE SORTIE : ${targetLanguage.toUpperCase()}

📋 TON REQUIS : ${tone.toUpperCase()}
${toneInstruction}

⚡ RÈGLES STRICTES :
1. LONGUEUR : 4 à 8 mots maximum par phrase
2. IMPACT : Chaque mot doit avoir un but précis
3. MÉMORABILITÉ : Facile à retenir et répéter
4. LANGUE PARFAITE : Syntaxe irréprochable en ${targetLanguage}
5. ORIGINALITÉ : Évite les clichés du marketing
6. CONVERSION : Doit donner envie d'acheter/essayer
7. COHÉRENCE : Toutes les phrases doivent respecter le ton ${tone}
8. CULTURE : Adapte aux références culturelles de la langue cible

🧠 TECHNIQUES AVANCÉES À UTILISER :
- Allitérations et assonances pour la mémorabilité
- Rythme et cadence (alternance syllabes courtes/longues)
- Mots sensoriels et émotionnels
- Urgence subtile sans être agressive
- Bénéfice client clair et immédiat
- Références culturelles appropriées à la langue

❌ INTERDICTIONS :
- Phrases génériques ("La solution parfaite", "Révolutionnaire")
- Superlatifs faibles ("très", "assez", "plutôt")
- Jargon technique incompréhensible
- Phrases trop longues ou complexes
- Répétitions de structure
- Traductions littérales maladroites

✅ VALIDATION :
Chaque phrase doit réussir le test : "Est-ce que ça me donnerait envie de cliquer/acheter dans cette culture ?"

📤 FORMAT DE SORTIE OBLIGATOIRE :
Réponds UNIQUEMENT avec les 10 phrases en ${targetLanguage}, une par ligne, sans numérotation, sans formatage, sans explication.

GÉNÈRE MAINTENANT :`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse and clean the response
    const phrases = text
      .split('\n')
      .map(phrase => phrase.trim())
      .filter(phrase => {
        // Remove empty lines, numbered lines, and explanatory text
        return phrase.length > 0 && 
               !phrase.match(/^\d+[\.\)\-\:]/) && 
               !phrase.match(/^(voici|voilà|exemples?|phrases?|here|examples?|aquí|ejemplos?|hier|beispiele?|ecco|esempi?|aqui|exemplos?)/i) &&
               phrase.length <= 80; // Reasonable max length
      })
      .slice(0, 10); // Take only first 10 valid phrases
    
    // Quality validation
    if (phrases.length < 8) {
      throw new Error(`Qualité insuffisante : seulement ${phrases.length} phrases valides générées`);
    }
    
    // Ensure we have exactly 10 phrases (pad if necessary with retry)
    if (phrases.length < 10) {
      console.warn(`Seulement ${phrases.length} phrases générées, tentative de complément...`);
      
      // Quick retry for missing phrases
      const complementPrompt = `Génère ${10 - phrases.length} phrases d'accroche supplémentaires pour "${concept}" en ton ${tone} et en ${targetLanguage}, différentes de celles-ci :
${phrases.join('\n')}

Même format : une phrase par ligne, ${tone}, 4-8 mots max, en ${targetLanguage}.`;
      
      const complementResult = await model.generateContent(complementPrompt);
      const complementText = complementResult.response.text();
      const complementPhrases = complementText
        .split('\n')
        .map(p => p.trim())
        .filter(p => p.length > 0 && !p.match(/^\d+[\.\)\-\:]/))
        .slice(0, 10 - phrases.length);
      
      phrases.push(...complementPhrases);
    }
    
    return phrases.slice(0, 10);
    
  } catch (error) {
    console.error('Erreur Gemini:', error);
    throw new Error('Impossible de générer les phrases avec Gemini. Vérifiez votre connexion.');
  }
}

export function isGeminiConfigured(): boolean {
  return !!import.meta.env.VITE_GEMINI_API_KEY;
}
import { cosineSimilarity } from '../lib/utils';
import { getEmbedding } from '../lib/gpt';
import { GeneratedPhrase } from '../types/PromptOptions';

// Version simplifiée qui ne nécessite que rawOutput
export async function validateOutput(
  rawOutput: string
): Promise<GeneratedPhrase[]> {
  
  // Validation d'entrée
  if (!rawOutput?.trim()) {
    throw new Error('Le contenu de sortie ne peut pas être vide');
  }
  
  // Nettoyage et filtrage des lignes
  const lines = rawOutput
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0 && !line.startsWith('#')); // Ignore les commentaires
  
  // Traitement des phrases sans calcul de similarité
  const phraseObjects = lines.map((text, index) => ({
    id: `phrase-${index + 1}`,
    text: text.replace(/^["']|["']$/g, '').trim(), // Supprimer les guillemets au début et à la fin
    score: Math.round(Math.random() * 100), // Score aléatoire en pourcentage (0-100)
    metadata: {}
  } satisfies GeneratedPhrase));
  
  return phraseObjects.sort((a, b) => b.score - a.score);
}

// Version avec similarité (gardez celle-ci si vous avez besoin du calcul de similarité)
export async function validateOutputWithSimilarity(
  rawOutput: string,
  reference: string,
  expectedCount: number = 10
): Promise<GeneratedPhrase[]> {
  
  // Validation d'entrée
  if (!rawOutput?.trim()) {
    throw new Error('Le contenu de sortie ne peut pas être vide');
  }
  
  if (!reference?.trim()) {
    throw new Error('La référence ne peut pas être vide');
  }
  
  // Nettoyage et filtrage des lignes
  const lines = rawOutput
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0 && !line.startsWith('#'));
  
  if (lines.length !== expectedCount) {
    throw new Error(
      `Nombre de phrases incorrect: attendu ${expectedCount}, obtenu ${lines.length}`
    );
  }
  
  try {
    // Récupération de l'embedding de référence
    const referenceEmbedding = await getEmbedding(reference);
    
    // Traitement des phrases avec gestion d'erreur individuelle
    const phrasePromises = lines.map(async (text, index) => {
      try {
        const embedding = await getEmbedding(text);
        const similarity = cosineSimilarity(referenceEmbedding, embedding);
        
        return {
          id: `phrase-${index + 1}`,
          text: text.replace(/^["']|["']$/g, '').trim(), // Supprimer les guillemets au début et à la fin
          score: Math.round(similarity * 100), // Convertir en pourcentage (0-100)
          metadata: {}
        } satisfies GeneratedPhrase;
        
      } catch (error) {
        console.warn(`Erreur lors du traitement de la phrase ${index + 1}:`, error);
        
        return {
          id: `phrase-${index + 1}`,
          text: text.replace(/^["']|["']$/g, '').trim(), // Supprimer les guillemets au début et à la fin
          score: -1,
          metadata: {}
        } satisfies GeneratedPhrase;
      }
    });
    
    const phraseObjects = await Promise.all(phrasePromises);
    
    return phraseObjects.sort((a, b) => {
      if (a.score === -1 && b.score !== -1) return 1;
      if (b.score === -1 && a.score !== -1) return -1;
      return b.score - a.score;
    });
    
  } catch (error) {
    throw new Error(
      `Erreur lors de la validation: ${error instanceof Error ? error.message : 'Erreur inconnue'}`
    );
  }
}
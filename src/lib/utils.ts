/**
 * Calcule la similarité cosinus entre deux vecteurs
 * @param vecA Premier vecteur
 * @param vecB Deuxième vecteur
 * @returns Similarité cosinus entre -1 et 1, ou 0 si l'un des vecteurs est nul
 * @throws Error si les vecteurs ont des tailles différentes ou sont invalides
 */
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
    // Validation d'entrée
    if (!Array.isArray(vecA) || !Array.isArray(vecB)) {
      throw new Error('Les deux paramètres doivent être des tableaux');
    }
    
    if (vecA.length === 0 || vecB.length === 0) {
      throw new Error('Les vecteurs ne peuvent pas être vides');
    }
    
    if (vecA.length !== vecB.length) {
      throw new Error(`Les vecteurs doivent avoir la même taille (${vecA.length} vs ${vecB.length})`);
    }
  
    // Vérification que tous les éléments sont des nombres valides
    if (!vecA.every(val => typeof val === 'number' && !isNaN(val))) {
      throw new Error('Le premier vecteur contient des valeurs non numériques');
    }
    
    if (!vecB.every(val => typeof val === 'number' && !isNaN(val))) {
      throw new Error('Le deuxième vecteur contient des valeurs non numériques');
    }
  
    // Calcul optimisé en une seule boucle
    let dot = 0;
    let magA = 0;
    let magB = 0;
    
    for (let i = 0; i < vecA.length; i++) {
      const valA = vecA[i];
      const valB = vecB[i];
      
      dot += valA * valB;
      magA += valA * valA;
      magB += valB * valB;
    }
    
    // Gestion des vecteurs nuls
    if (magA === 0 || magB === 0) {
      return 0;
    }
    
    // Calcul final avec gestion de la précision
    const similarity = dot / (Math.sqrt(magA) * Math.sqrt(magB));
    
    // Clamping pour éviter les erreurs de précision flottante
    return Math.max(-1, Math.min(1, similarity));
  }
  
  /**
   * Version alternative plus performante pour de très gros vecteurs
   * Utilise une approche par chunks pour éviter les débordements
   */
  export function cosineSimilarityOptimized(vecA: number[], vecB: number[]): number {
    if (!Array.isArray(vecA) || !Array.isArray(vecB)) {
      throw new Error('Les deux paramètres doivent être des tableaux');
    }
    
    if (vecA.length !== vecB.length || vecA.length === 0) {
      throw new Error('Les vecteurs doivent avoir la même taille non nulle');
    }
  
    const chunkSize = 10000; // Traitement par chunks pour de gros vecteurs
    let dot = 0;
    let magA = 0;
    let magB = 0;
    
    for (let start = 0; start < vecA.length; start += chunkSize) {
      const end = Math.min(start + chunkSize, vecA.length);
      
      for (let i = start; i < end; i++) {
        const valA = vecA[i];
        const valB = vecB[i];
        
        dot += valA * valB;
        magA += valA * valA;
        magB += valB * valB;
      }
    }
    
    if (magA === 0 || magB === 0) return 0;
    
    return Math.max(-1, Math.min(1, dot / (Math.sqrt(magA) * Math.sqrt(magB))));
  }
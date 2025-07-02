import { supabase } from '../lib/supabase';

import { tones } from '../data/tones';
import { languages } from '../data/languages';

// Interface pour les statistiques
export interface AppStats {
  totalPhrases: number;
  uniqueUsers: number; // Nombre de sessions uniques (utilisateurs anonymes)
  satisfactionRate: number;
  languagesCount: number;
  tonesCount: number;
}

// Fonction pour récupérer le nombre total de phrases générées
export async function getTotalPhrases(): Promise<number> {
  try {
   
    const { count, error } = await supabase
      .from('pending_results')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('❌ Error getting total phrases:', error);
      return 0;
    }

   ;
    return count || 0;
  } catch (error) {
    console.error('❌ Error in getTotalPhrases:', error);
    return 0;
  }
}

// Fonction pour récupérer le nombre de sessions uniques (utilisateurs anonymes)
export async function getUniqueUsers(): Promise<number> {
  try {
    // Compter les sessions uniques depuis la table generation_sessions
    // Chaque session_id représente un utilisateur anonyme unique
    const { count, error } = await supabase
      .from('generation_sessions')
      .select('session_id', { count: 'exact', head: true });

    if (error) {
      console.error('❌ Error getting unique sessions:', error);
      return 0;
    }

   
    return count || 0;
  } catch (error) {
    console.error('❌ Error in getUniqueUsers:', error);
    return 0;
  }
}

// Fonction pour calculer le taux de satisfaction
export async function getSatisfactionRate(): Promise<number> {
  try {
  
    
    // Pour l'instant, on utilise un taux fixe basé sur les paiements réussis
    // Dans le futur, on pourrait ajouter un système de notation
    const { count: successfulPayments, error: paymentsError } = await supabase
      .from('payment_tokens')
      .select('*', { count: 'exact', head: true })
      .eq('is_used', true);

    if (paymentsError) {
      console.error('❌ Error getting successful payments:', paymentsError);
      return 98; // Taux par défaut
    }

    const { count: totalGenerations, error: generationsError } = await supabase
      .from('pending_results')
      .select('*', { count: 'exact', head: true });

    if (generationsError) {
      console.error('❌ Error getting total generations:', generationsError);
      return 98; // Taux par défaut
    }

    if (!totalGenerations || totalGenerations === 0) return 98;
    if (!successfulPayments) return 98;
    
    const satisfactionRate = Math.round((successfulPayments / totalGenerations) * 100);
    const finalRate = Math.min(satisfactionRate, 100); // Max 100%
    
  
    return finalRate;
  } catch (error) {
    console.error('❌ Error in getSatisfactionRate:', error);
    return 98; // Taux par défaut
  }
}

// Fonction pour récupérer toutes les statistiques
export async function getAppStats(): Promise<AppStats> {
  try {
 
    const [totalPhrases, uniqueUsers, satisfactionRate] = await Promise.allSettled([
      getTotalPhrases(),
      getUniqueUsers(),
      getSatisfactionRate()
    ]);

    const stats = {
      totalPhrases: totalPhrases.status === 'fulfilled' ? totalPhrases.value : 0,
      uniqueUsers: uniqueUsers.status === 'fulfilled' ? uniqueUsers.value : 0, // Sessions uniques
      satisfactionRate: satisfactionRate.status === 'fulfilled' ? satisfactionRate.value : 98,
      languagesCount: languages.length,
      tonesCount: tones.length
    };

   

    return stats;
  } catch (error) {
    console.error('❌ Error in getAppStats:', error);
    return {
      totalPhrases: 0,
      uniqueUsers: 0,
      satisfactionRate: 98,
      languagesCount: languages.length,
      tonesCount: tones.length
    };
  }
}




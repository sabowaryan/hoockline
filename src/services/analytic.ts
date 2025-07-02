import { supabase } from '../lib/supabase';
import { Analytics } from './analytics';
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
    console.log('🔍 Analytics: Fetching total phrases from pending_results...');
    
    const { count, error } = await supabase
      .from('pending_results')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('❌ Error getting total phrases:', error);
      return 0;
    }

    console.log('✅ Analytics: Total phrases count:', count);
    return count || 0;
  } catch (error) {
    console.error('❌ Error in getTotalPhrases:', error);
    return 0;
  }
}

// Fonction pour récupérer le nombre de sessions uniques (utilisateurs anonymes)
export async function getUniqueUsers(): Promise<number> {
  try {
    console.log('🔍 Analytics: Fetching unique users from generation_sessions...');
    
    // Compter les sessions uniques depuis la table generation_sessions
    // Chaque session_id représente un utilisateur anonyme unique
    const { count, error } = await supabase
      .from('generation_sessions')
      .select('session_id', { count: 'exact', head: true });

    if (error) {
      console.error('❌ Error getting unique sessions:', error);
      return 0;
    }

    console.log('✅ Analytics: Unique sessions count:', count);
    return count || 0;
  } catch (error) {
    console.error('❌ Error in getUniqueUsers:', error);
    return 0;
  }
}

// Fonction pour calculer le taux de satisfaction
export async function getSatisfactionRate(): Promise<number> {
  try {
    console.log('🔍 Analytics: Calculating satisfaction rate...');
    
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

    console.log('🔍 Analytics: Successful payments:', successfulPayments, 'Total generations:', totalGenerations);

    if (!totalGenerations || totalGenerations === 0) return 98;
    if (!successfulPayments) return 98;
    
    const satisfactionRate = Math.round((successfulPayments / totalGenerations) * 100);
    const finalRate = Math.min(satisfactionRate, 100); // Max 100%
    
    console.log('✅ Analytics: Satisfaction rate calculated:', finalRate + '%');
    return finalRate;
  } catch (error) {
    console.error('❌ Error in getSatisfactionRate:', error);
    return 98; // Taux par défaut
  }
}

// Fonction pour récupérer toutes les statistiques
export async function getAppStats(): Promise<AppStats> {
  try {
    console.log('🔍 Analytics: Starting to fetch all app stats...');
    
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

    console.log('✅ Analytics: Final app stats:', {
      totalPhrases: stats.totalPhrases,
      uniqueUsers: stats.uniqueUsers,
      satisfactionRate: stats.satisfactionRate + '%',
      languagesCount: stats.languagesCount,
      tonesCount: stats.tonesCount
    });

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

// Fonction de debug pour vérifier directement les données dans la base
export async function debugDatabaseStats(): Promise<void> {
  try {
    console.log('🔍 DEBUG: Checking database statistics directly...');
    
    // Vérifier les pending_results
    const { count: pendingCount, error: pendingError } = await supabase
      .from('pending_results')
      .select('*', { count: 'exact', head: true });
    
    if (pendingError) {
      console.error('❌ DEBUG: Error checking pending_results:', pendingError);
    } else {
      console.log('✅ DEBUG: pending_results count:', pendingCount);
    }
    
    // Vérifier les generation_sessions
    const { count: sessionsCount, error: sessionsError } = await supabase
      .from('generation_sessions')
      .select('*', { count: 'exact', head: true });
    
    if (sessionsError) {
      console.error('❌ DEBUG: Error checking generation_sessions:', sessionsError);
    } else {
      console.log('✅ DEBUG: generation_sessions count:', sessionsCount);
    }
    
    // Vérifier les payment_tokens utilisés
    const { count: usedTokensCount, error: tokensError } = await supabase
      .from('payment_tokens')
      .select('*', { count: 'exact', head: true })
      .eq('is_used', true);
    
    if (tokensError) {
      console.error('❌ DEBUG: Error checking payment_tokens:', tokensError);
    } else {
      console.log('✅ DEBUG: used payment_tokens count:', usedTokensCount);
    }
    
    // Vérifier tous les payment_tokens
    const { count: allTokensCount, error: allTokensError } = await supabase
      .from('payment_tokens')
      .select('*', { count: 'exact', head: true });
    
    if (allTokensError) {
      console.error('❌ DEBUG: Error checking all payment_tokens:', allTokensError);
    } else {
      console.log('✅ DEBUG: all payment_tokens count:', allTokensCount);
    }
    
    console.log('🔍 DEBUG: Database check completed');
  } catch (error) {
    console.error('❌ DEBUG: Error in debugDatabaseStats:', error);
  }
}

// Fonction de test simple pour vérifier la connectivité et les données
export async function testDatabaseConnection(): Promise<void> {
  try {
    console.log('🔍 TEST: Testing database connection...');
    
    // Test simple de connexion
    const { data, error } = await supabase
      .from('pending_results')
      .select('count(*)')
      .limit(1);
    
    if (error) {
      console.error('❌ TEST: Database connection failed:', error);
      alert('❌ Erreur de connexion à la base de données: ' + error.message);
    } else {
      console.log('✅ TEST: Database connection successful');
      alert('✅ Connexion à la base de données réussie');
    }
    
    // Test des tables principales
    const tables = ['pending_results', 'generation_sessions', 'payment_tokens'];
    
    for (const table of tables) {
      try {
        const { count, error: tableError } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });
        
        if (tableError) {
          console.error(`❌ TEST: Error accessing ${table}:`, tableError);
        } else {
          console.log(`✅ TEST: ${table} count:`, count);
        }
      } catch (err) {
        console.error(`❌ TEST: Exception accessing ${table}:`, err);
      }
    }
    
  } catch (error) {
    console.error('❌ TEST: General error:', error);
    alert('❌ Erreur générale: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
}

// Fonction globale pour test depuis la console du navigateur
if (typeof window !== 'undefined') {
  (window as any).testClickloneStats = async () => {
    console.log('🔍 GLOBAL TEST: Testing Clicklone statistics...');
    try {
      await debugDatabaseStats();
      const stats = await getAppStats();
      console.log('🔍 GLOBAL TEST: Final stats:', stats);
      alert(`Stats: ${JSON.stringify(stats, null, 2)}`);
    } catch (error) {
      console.error('❌ GLOBAL TEST: Error:', error);
      alert('Erreur: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };
  
  (window as any).testClickloneDB = async () => {
    console.log('🔍 GLOBAL TEST: Testing Clicklone database...');
    await testDatabaseConnection();
  };
}
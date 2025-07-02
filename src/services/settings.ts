// services/settings.ts
import { supabase } from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export interface SystemSetting {
  id: string;
  key: string;
  value: any;
  description?: string;
  category: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PaymentSettings {
  payment_required: boolean;
  free_trials_allowed: boolean;
  trial_limit: number;
  payment_amount: number;
  payment_currency: string;
}

export interface GeneralSettings {
  site_name: string;
  site_description: string;
}

export interface GenerationStatus {
  canGenerate: boolean;
  requiresPayment: boolean;
  reason?: string;
  sessionId?: string;
  trialCount?: number;
  trialLimit?: number;
  showResults?: boolean;
}

// Types pour la validation
type SettingKey = 'payment_required' | 'free_trials_allowed' | 'trial_limit' | 'payment_amount' | 'payment_currency' | 'site_name' | 'site_description';

// Cache thread-safe avec Map
class SettingsCache {
  private cache = new Map<string, { value: any; timestamp: number }>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  get<T = unknown>(key: string): T | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.value as T;
    }
    return null;
  }

  set(key: string, value: any): void {
    this.cache.set(key, {
      value,
      timestamp: Date.now(),
    });
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }
}

const settingsCache = new SettingsCache();

// Utilitaires pour localStorage sécurisé
class SafeStorage {
  private isAvailable: boolean;

  constructor() {
    this.isAvailable = this.checkAvailability();
  }

  private checkAvailability(): boolean {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return false;
      }
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  getItem(key: string): string | null {
    if (!this.isAvailable) return null;
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.warn(`Error reading from localStorage (${key}):`, error);
      return null;
    }
  }

  setItem(key: string, value: string): boolean {
    if (!this.isAvailable) return false;
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.warn(`Error writing to localStorage (${key}):`, error);
      return false;
    }
  }

  removeItem(key: string): boolean {
    if (!this.isAvailable) return false;
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn(`Error removing from localStorage (${key}):`, error);
      return false;
    }
  }
}

const safeStorage = new SafeStorage();

// Validation des paramètres
const settingValidators: Record<string, (value: any) => boolean> = {
  payment_required: (v: any) => typeof v === 'boolean',
  free_trials_allowed: (v: any) => typeof v === 'boolean',
  trial_limit: (v: any) => typeof v === 'number' && v >= 0 && Number.isInteger(v),
  payment_amount: (v: any) => typeof v === 'number' && v > 0,
  payment_currency: (v: any) => typeof v === 'string' && v.length === 3,
  site_name: (v: any) => typeof v === 'string' && v.length > 0,
  site_description: (v: any) => typeof v === 'string',
};

function validateSetting(key: string, value: any): boolean {
  const validator = settingValidators[key];
  return validator ? validator(value) : true;
}

// Fonctions principales avec typage amélioré
export async function getSystemSetting<T = unknown>(key: SettingKey): Promise<T | null> {
  // Vérifier le cache d'abord
  const cached = settingsCache.get<T>(key);
  if (cached !== null) {
    return cached;
  }

  try {
    const { data, error } = await supabase
      .from('system_settings')
      .select('value')
      .eq('key', key)
      .eq('is_active', true)
      .single();

    if (error) {
      console.error(`Error fetching setting ${key}:`, error);
      return null;
    }

    if (data?.value !== undefined && validateSetting(key, data.value)) {
      settingsCache.set(key, data.value);
      return data.value as T;
    }

    console.warn(`Invalid or missing value for setting ${key}`);
    return null;
  } catch (error) {
    console.error(`Error fetching setting ${key}:`, error);
    return null;
  }
}

export async function getPaymentSettings(): Promise<PaymentSettings> {
  try {
    const [paymentRequired, freeTrialsAllowed, trialLimit, paymentAmount, paymentCurrency] = await Promise.allSettled([
      getSystemSetting<boolean>('payment_required'),
      getSystemSetting<boolean>('free_trials_allowed'),
      getSystemSetting<number>('trial_limit'),
      getSystemSetting<number>('payment_amount'),
      getSystemSetting<string>('payment_currency'),
    ]);

    return {
      payment_required: paymentRequired.status === 'fulfilled' ? paymentRequired.value ?? true : true,
      free_trials_allowed: freeTrialsAllowed.status === 'fulfilled' ? freeTrialsAllowed.value ?? false : false,
      trial_limit: trialLimit.status === 'fulfilled' ? trialLimit.value ?? 1 : 1,
      payment_amount: paymentAmount.status === 'fulfilled' ? paymentAmount.value ?? 399 : 399,
      payment_currency: paymentCurrency.status === 'fulfilled' ? paymentCurrency.value ?? 'EUR' : 'EUR',
    };
  } catch (error) {
    console.error('Error fetching payment settings:', error);
    // Retourner des valeurs par défaut sécurisées
    return {
      payment_required: true,
      free_trials_allowed: false,
      trial_limit: 1,
      payment_amount: 399,
      payment_currency: 'EUR',
    };
  }
}

export async function getGeneralSettings(): Promise<GeneralSettings> {
  try {
    const [siteName, siteDescription] = await Promise.allSettled([
      getSystemSetting<string>('site_name'),
      getSystemSetting<string>('site_description'),
    ]);

    return {
      site_name: siteName.status === 'fulfilled' ? siteName.value ?? 'Clicklone' : 'Clicklone',
      site_description: siteDescription.status === 'fulfilled' ? siteDescription.value ?? 'Générateur de contenu intelligent' : 'Générateur de contenu intelligent',
    };
  } catch (error) {
    console.error('Error fetching general settings:', error);
    return {
      site_name: 'Clicklone',
      site_description: 'Générateur de contenu intelligent',
    };
  }
}

export async function updateSystemSetting(key: SettingKey, value: any, description?: string): Promise<boolean> {
  if (!validateSetting(key, value)) {
    console.error(`Invalid value for setting ${key}:`, value);
    return false;
  }

  try {
    const { error } = await supabase.from('system_settings').upsert(
      {
        key,
        value,
        description,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'key' }
    );

    if (error) {
      console.error(`Error updating setting ${key}:`, error);
      return false;
    }

    settingsCache.delete(key);
    return true;
  } catch (error) {
    console.error(`Error updating setting ${key}:`, error);
    return false;
  }
}

export async function getAllSystemSettings(): Promise<SystemSetting[]> {
  try {
    const { data, error } = await supabase
      .from('system_settings')
      .select('*')
      .order('category', { ascending: true })
      .order('key', { ascending: true });

    if (error) {
      console.error('Error fetching all settings:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching all settings:', error);
    return [];
  }
}

// Fonctions utilitaires avec gestion d'erreurs améliorée
export async function isPaymentRequired(): Promise<boolean> {
  try {
    return (await getSystemSetting<boolean>('payment_required')) ?? true;
  } catch {
    return true; // Défaut sécurisé
  }
}

export async function areFreeTrialsAllowed(): Promise<boolean> {
  try {
    return (await getSystemSetting<boolean>('free_trials_allowed')) ?? false;
  } catch {
    return false; // Défaut sécurisé
  }
}

export async function getTrialLimit(): Promise<number> {
  try {
    return (await getSystemSetting<number>('trial_limit')) ?? 1;
  } catch {
    return 1; // Défaut sécurisé
  }
}

export async function getPaymentAmount(): Promise<number> {
  try {
    return (await getSystemSetting<number>('payment_amount')) ?? 399;
  } catch {
    return 399; // Défaut sécurisé
  }
}

export async function getPaymentCurrency(): Promise<string> {
  try {
    return (await getSystemSetting<string>('payment_currency')) ?? 'EUR';
  } catch {
    return 'EUR'; // Défaut sécurisé
  }
}

export function clearSettingsCache(): void {
  settingsCache.clear();
}

// Gestion des sessions avec fallback
function getSessionId(): string {
  let sessionId = safeStorage.getItem('session_id');
  if (!sessionId) {
    sessionId = uuidv4();
    safeStorage.setItem('session_id', sessionId);
  }
  return sessionId;
}

export async function getTrialCount(sessionId: string): Promise<number> {
  if (!sessionId) {

    return 0;
  }

  try {
    
    const { data, error } = await supabase
      .rpc('get_trial_count', { 
        session_id_input: sessionId 
      });

    if (error) {
      console.error('❌ Erreur lecture compteur:', error);
      return 0;
    }
    
    
    return data || 0;
  } catch (error) {
    console.error('❌ Erreur dans getTrialCount:', error);
    return 0;
  }
}

export async function incrementTrialCount(): Promise<boolean> {
  try {
    const sessionId = getSessionId();

    const currentCount = await getTrialCount(sessionId);

    const newCount = currentCount + 1;
   

    const { error } = await supabase
      .rpc('increment_trial_count', { 
        session_id_input: sessionId,
        new_trial_count: newCount
      });

    if (error) {
      console.error('❌ Erreur incrémentation:', error);
      return false;
    }


    return true;
  } catch (error) {
    console.error('❌ Erreur dans incrementTrialCount:', error);
    return false;
  }
}

export async function savePendingResults(results: string): Promise<string> {
  if (!results || results.trim().length === 0) {
    throw new Error('Cannot save empty results');
  }

  try {
    const resultId = uuidv4();
    const expiresAt = new Date(Date.now() + 86400000); // 24h
    const sessionId = getSessionId();

    const { error } = await supabase.from('pending_results').insert({
      result_id: resultId,
      content: results,
      created_at: new Date().toISOString(),
      expires_at: expiresAt.toISOString(),
      session_id: sessionId,
    });

    if (error) {
      console.error('Error saving pending results:', error);
      throw error;
    }

    return resultId;
  } catch (error) {
    console.error('Error in savePendingResults:', error);
    throw error;
  }
}

export async function isPaymentTokenValid(token: string): Promise<boolean> {
  if (!token || token.trim().length === 0) {
    return false;
  }

  try {
    const { data, error } = await supabase
      .from('payment_tokens')
      .select('is_used, expires_at')
      .eq('token', token)
      .single();

    if (error || !data) {
      return false;
    }

    const isExpired = data.expires_at && new Date(data.expires_at) < new Date();
    return !data.is_used && !isExpired;
  } catch (error) {
    console.error('Error validating payment token:', error);
    return false;
  }
}

// Nouvelle fonction pour créer un token de paiement
export async function createPaymentToken(resultId: string, amount: number, currency: string = 'EUR'): Promise<string> {
  try {
    const token = uuidv4();
    const expiresAt = new Date(Date.now() + 86400000); // 24h
    const sessionId = getSessionId();

    const { error } = await supabase.from('payment_tokens').insert({
      token,
      amount,
      currency,
      expires_at: expiresAt.toISOString(),
      result_id: resultId,
      session_id: sessionId,
    });

    if (error) {
      console.error('Error creating payment token:', error);
      throw error;
    }

    return token;
  } catch (error) {
    console.error('Error in createPaymentToken:', error);
    throw error;
  }
}

// Nouvelle fonction pour marquer un token comme utilisé
export async function markPaymentTokenAsUsed(token: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('payment_tokens')
      .update({
        is_used: true,
        used_at: new Date().toISOString(),
      })
      .eq('token', token);

    if (error) {
      console.error('Error marking payment token as used:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in markPaymentTokenAsUsed:', error);
    return false;
  }
}

// Nouvelle fonction pour récupérer un token par resultId
export async function getPaymentTokenByResultId(resultId: string): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('payment_tokens')
      .select('token')
      .eq('result_id', resultId)
      .single();

    if (error || !data) {
      return null;
    }

    return data.token;
  } catch (error) {
    console.error('Error getting payment token by result ID:', error);
    return null;
  }
}

export async function checkPaymentStatus(): Promise<GenerationStatus> {
  try {
    const [paymentRequired, freeTrialsAllowed, trialLimit] = await Promise.allSettled([
      isPaymentRequired(),
      areFreeTrialsAllowed(),
      getTrialLimit(),
    ]);

    const sessionId = getSessionId();
    const trialCount = await getTrialCount(sessionId);

    // Validation du token de paiement avec gestion d'erreur
    const paymentToken = safeStorage.getItem('payment_token');
    let hasValidPayment = false;
    
    if (paymentToken) {
      try {
        hasValidPayment = await isPaymentTokenValid(paymentToken);
      } catch (error) {
        console.warn('Error validating payment token:', error);
        hasValidPayment = false;
      }
    }

    const paymentReq = paymentRequired.status === 'fulfilled' ? paymentRequired.value : true;
    const trialsAllowed = freeTrialsAllowed.status === 'fulfilled' ? freeTrialsAllowed.value : false;
    const maxTrials = trialLimit.status === 'fulfilled' ? trialLimit.value : 1;

    

    // Cas 1: Utilisateur a un paiement valide
    if (hasValidPayment) {
      return {
        canGenerate: true,
        requiresPayment: false,
        showResults: true,
        sessionId,
      };
    }

    // Cas 2: Paiement non requis
    if (!paymentReq) {
      return {
        canGenerate: true,
        requiresPayment: false,
        showResults: true,
        sessionId,
      };
    }

    // Cas 3: Essais gratuits autorisés et utilisateur n'a pas atteint la limite
    if (trialsAllowed && trialCount < maxTrials) {
      return {
        canGenerate: true,
        requiresPayment: false,
        showResults: true,
        sessionId,
        trialCount,
        trialLimit: maxTrials,
      };
    }

    // Cas 4: Paiement requis et utilisateur n'a pas de paiement valide
    return {
      canGenerate: true,
      requiresPayment: true,
      showResults: false,
      reason: 'payment.required',
      sessionId,
    };
  } catch (error) {
    console.error('Error checking payment status:', error);
    return {
      canGenerate: false,
      requiresPayment: true,
      showResults: false,
      reason: 'error.payment_check_failed',
    };
  }
}

// Récupérer les résultats en attente pour la session courante via la fonction RPC
export async function getPendingResultsForSession(sessionId?: string) {
  const sid = sessionId || getSessionId();
  const { data, error } = await supabase
    .rpc('get_pending_results_for_session', { session_id_input: sid });
  if (error) {
    console.error('Erreur lors de la récupération des pending_results:', error);
    return [];
  }
  return data;
}

// Récupérer les tokens de paiement pour la session courante via la fonction RPC
export async function getPaymentTokensForSession(sessionId?: string) {
  const sid = sessionId || getSessionId();
  const { data, error } = await supabase
    .rpc('get_payment_tokens_for_session', { session_id_input: sid });
  if (error) {
    console.error('Erreur lors de la récupération des payment_tokens:', error);
    return [];
  }
  return data;
}

// Récupérer les sessions de génération pour la session courante via la fonction RPC
export async function getGenerationSessionsForSession(sessionId?: string) {
  const sid = sessionId || getSessionId();
  const { data, error } = await supabase
    .rpc('get_generation_sessions_for_session', { session_id_input: sid });
  if (error) {
    console.error('Erreur lors de la récupération des generation_sessions:', error);
    return [];
  }
  return data;
}

// Récupérer un résultat spécifique par son ID de manière sécurisée
export async function getPendingResultById(resultId: string, sessionId?: string) {
  const sid = sessionId || getSessionId();
  const { data, error } = await supabase
    .rpc('get_pending_result_by_id', {
      session_id_input: sid,
      result_id_input: resultId
    });

  if (error) {
    console.error('Erreur lors de la récupération du résultat:', error);
    return null;
  }

  // La fonction RPC retourne un tableau, mais on ne veut que le premier élément
  return data?.[0] || null;
}
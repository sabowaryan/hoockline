import { supabase } from '../lib/supabase';

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

// Cache pour éviter les requêtes répétées
const settingsCache = new Map<string, any>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Obtenir un paramètre système
export async function getSystemSetting(key: string): Promise<any> {
  // Vérifier le cache
  const cached = settingsCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.value;
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

    // Mettre en cache
    settingsCache.set(key, {
      value: data.value,
      timestamp: Date.now()
    });

    return data.value;
  } catch (error) {
    console.error(`Error fetching setting ${key}:`, error);
    return null;
  }
}

// Obtenir tous les paramètres de paiement
export async function getPaymentSettings(): Promise<PaymentSettings> {
  const [paymentRequired, freeTrialsAllowed, trialLimit, paymentAmount, paymentCurrency] = await Promise.all([
    getSystemSetting('payment_required'),
    getSystemSetting('free_trials_allowed'),
    getSystemSetting('trial_limit'),
    getSystemSetting('payment_amount'),
    getSystemSetting('payment_currency')
  ]);

  return {
    payment_required: paymentRequired ?? true,
    free_trials_allowed: freeTrialsAllowed ?? false,
    trial_limit: trialLimit ?? 1,
    payment_amount: paymentAmount ?? 399,
    payment_currency: paymentCurrency ?? 'EUR'
  };
}

// Obtenir les paramètres généraux
export async function getGeneralSettings(): Promise<GeneralSettings> {
  const [siteName, siteDescription] = await Promise.all([
    getSystemSetting('site_name'),
    getSystemSetting('site_description')
  ]);

  return {
    site_name: siteName ?? 'Clicklone',
    site_description: siteDescription ?? 'Générateur de contenu intelligent'
  };
}

// Mettre à jour un paramètre (admin seulement)
export async function updateSystemSetting(key: string, value: any, description?: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('system_settings')
      .upsert({
        key,
        value,
        description,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'key'
      });

    if (error) {
      console.error(`Error updating setting ${key}:`, error);
      return false;
    }

    // Invalider le cache
    settingsCache.delete(key);

    return true;
  } catch (error) {
    console.error(`Error updating setting ${key}:`, error);
    return false;
  }
}

// Obtenir tous les paramètres (admin seulement)
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

// Vérifier si le paiement est requis
export async function isPaymentRequired(): Promise<boolean> {
  const paymentRequired = await getSystemSetting('payment_required');
  return paymentRequired ?? true;
}

// Vérifier si les essais gratuits sont autorisés
export async function areFreeTrialsAllowed(): Promise<boolean> {
  const freeTrialsAllowed = await getSystemSetting('free_trials_allowed');
  return freeTrialsAllowed ?? false;
}

// Obtenir la limite d'essais gratuits
export async function getTrialLimit(): Promise<number> {
  const trialLimit = await getSystemSetting('trial_limit');
  return trialLimit ?? 1;
}

// Obtenir le montant du paiement
export async function getPaymentAmount(): Promise<number> {
  const paymentAmount = await getSystemSetting('payment_amount');
  return paymentAmount ?? 399; // 3.99€ par défaut
}

// Obtenir la devise du paiement
export async function getPaymentCurrency(): Promise<string> {
  const paymentCurrency = await getSystemSetting('payment_currency');
  return paymentCurrency ?? 'EUR';
}

// Vider le cache
export function clearSettingsCache(): void {
  settingsCache.clear();
}

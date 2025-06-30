import { supabase } from '../lib/supabase';

export interface SEOSettings {
  id?: string;
  page_path: string;
  title: string;
  description?: string;
  keywords?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  twitter_title?: string;
  twitter_description?: string;
  twitter_image?: string;
  canonical_url?: string;
  robots?: string;
  schema_type?: string;
  priority?: number;
  change_frequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface StructuredData {
  '@context': string;
  '@type': string;
  name?: string;
  description?: string;
  url?: string;
  image?: string;
  author?: {
    '@type': string;
    name: string;
  };
  publisher?: {
    '@type': string;
    name: string;
    logo: {
      '@type': string;
      url: string;
    };
  };
}

// Récupérer les paramètres SEO pour une page
export async function getSEOSettings(pagePath: string): Promise<SEOSettings | null> {
  try {
    const { data, error } = await supabase
      .from('seo_settings')
      .select('*')
      .eq('page_path', pagePath)
      .eq('is_active', true)
      .maybeSingle();

    if (error) {
      console.error('Error fetching SEO settings:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error fetching SEO settings:', error);
    return null;
  }
}

// Récupérer tous les paramètres SEO (admin)
export async function getAllSEOSettings(): Promise<SEOSettings[]> {
  try {
    const { data, error } = await supabase
      .from('seo_settings')
      .select('*')
      .order('priority', { ascending: false });

    if (error) {
      console.error('Error fetching all SEO settings:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching all SEO settings:', error);
    return [];
  }
}

// Créer ou mettre à jour les paramètres SEO
export async function upsertSEOSettings(settings: SEOSettings): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('seo_settings')
      .upsert(settings, {
        onConflict: 'page_path'
      });

    if (error) {
      console.error('Error upserting SEO settings:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error upserting SEO settings:', error);
    return false;
  }
}

// Supprimer les paramètres SEO
export async function deleteSEOSettings(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('seo_settings')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting SEO settings:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting SEO settings:', error);
    return false;
  }
}

// Générer les données structurées Schema.org
export function generateStructuredData(settings: SEOSettings): StructuredData {
  const baseUrl = window.location.origin;
  
  const structuredData: StructuredData = {
    '@context': 'https://schema.org',
    '@type': settings.schema_type || 'WebPage',
    name: settings.title,
    description: settings.description,
    url: settings.canonical_url || `${baseUrl}${settings.page_path}`,
  };

  if (settings.og_image) {
    structuredData.image = settings.og_image;
  }

  // Ajouter des données spécifiques selon le type de page
  if (settings.schema_type === 'WebSite') {
    structuredData.author = {
      '@type': 'Organization',
      name: 'Clicklone'
    };
    structuredData.publisher = {
      '@type': 'Organization',
      name: 'Clicklone',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`
      }
    };
  }

  return structuredData;
}

// Valider les paramètres SEO
export function validateSEOSettings(settings: Partial<SEOSettings>): string[] {
  const errors: string[] = [];

  if (!settings.page_path) {
    errors.push('Le chemin de la page est requis');
  }

  if (!settings.title) {
    errors.push('Le titre est requis');
  } else if (settings.title.length > 60) {
    errors.push('Le titre ne doit pas dépasser 60 caractères');
  }

  if (settings.description && settings.description.length > 160) {
    errors.push('La description ne doit pas dépasser 160 caractères');
  }

  if (settings.canonical_url && !isValidUrl(settings.canonical_url)) {
    errors.push('L\'URL canonique n\'est pas valide');
  }

  if (settings.og_image && !isValidUrl(settings.og_image)) {
    errors.push('L\'URL de l\'image Open Graph n\'est pas valide');
  }

  if (settings.twitter_image && !isValidUrl(settings.twitter_image)) {
    errors.push('L\'URL de l\'image Twitter n\'est pas valide');
  }

  if (settings.priority !== undefined && (settings.priority < 0 || settings.priority > 1)) {
    errors.push('La priorité doit être entre 0 et 1');
  }

  return errors;
}

// Vérifier si une URL est valide
function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Obtenir les paramètres SEO par défaut pour une page
export function getDefaultSEOSettings(pagePath: string): Partial<SEOSettings> {
  const baseUrl = window.location.origin;
  
  const defaults: Record<string, Partial<SEOSettings>> = {
    '/': {
      title: 'Clicklone - Générateur IA de phrases d\'accroche',
      description: 'Créez 10 phrases d\'accroche uniques avec notre IA Gemini. Générateur de slogans en 6 langues et 6 tons différents.',
      keywords: 'générateur slogan, phrase d\'accroche, IA, copywriting, marketing',
      schema_type: 'WebSite',
      priority: 1.0,
      change_frequency: 'weekly'
    },
    '/generator': {
      title: 'Générateur IA - Créez vos phrases d\'accroche | Clicklone',
      description: 'Utilisez notre générateur IA pour créer 10 phrases d\'accroche uniques. 6 tons et 6 langues disponibles.',
      keywords: 'générateur phrases, créer slogan, IA copywriting',
      schema_type: 'WebApplication',
      priority: 0.9,
      change_frequency: 'daily'
    },
    '/payment': {
      title: 'Paiement sécurisé | Clicklone',
      description: 'Paiement sécurisé par Stripe pour débloquer vos phrases d\'accroche personnalisées.',
      keywords: 'paiement sécurisé, Stripe, phrases d\'accroche',
      schema_type: 'CheckoutPage',
      priority: 0.3,
      change_frequency: 'monthly'
    },
    '/success': {
      title: 'Succès - Vos phrases sont prêtes ! | Clicklone',
      description: 'Félicitations ! Vos phrases d\'accroche personnalisées sont maintenant disponibles.',
      keywords: 'phrases d\'accroche prêtes, succès paiement',
      schema_type: 'ConfirmationPage',
      priority: 0.1,
      change_frequency: 'never'
    }
  };

  return {
    page_path: pagePath,
    canonical_url: `${baseUrl}${pagePath}`,
    robots: 'index, follow',
    is_active: true,
    ...defaults[pagePath]
  };
}

// Générer le sitemap XML
export function generateSitemap(seoSettings: SEOSettings[]): string {
  const baseUrl = window.location.origin;
  
  const urls = seoSettings
    .filter(settings => settings.is_active && settings.robots !== 'noindex')
    .map(settings => `
    <url>
      <loc>${settings.canonical_url || `${baseUrl}${settings.page_path}`}</loc>
      <lastmod>${new Date(settings.updated_at || settings.created_at || new Date()).toISOString().split('T')[0]}</lastmod>
      <changefreq>${settings.change_frequency || 'weekly'}</changefreq>
      <priority>${settings.priority || 0.5}</priority>
    </url>`).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls}
</urlset>`;
}
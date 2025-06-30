/*
  # Système de gestion SEO

  1. Nouvelle table
    - `seo_settings`
      - `id` (uuid, primary key)
      - `page_path` (text, unique) - Chemin de la page
      - `title` (text) - Titre de la page
      - `description` (text) - Meta description
      - `keywords` (text) - Mots-clés
      - `og_title` (text) - Open Graph title
      - `og_description` (text) - Open Graph description
      - `og_image` (text) - Open Graph image URL
      - `twitter_title` (text) - Twitter card title
      - `twitter_description` (text) - Twitter card description
      - `twitter_image` (text) - Twitter card image
      - `canonical_url` (text) - URL canonique
      - `robots` (text) - Directives robots
      - `schema_type` (text) - Type de schema.org
      - `priority` (numeric) - Priorité pour sitemap
      - `change_frequency` (text) - Fréquence de changement
      - `is_active` (boolean) - Actif/inactif
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Sécurité
    - Enable RLS sur `seo_settings`
    - Politique pour les admins seulement

  3. Données par défaut
    - Configuration SEO pour les pages principales
*/

-- Créer la table seo_settings
CREATE TABLE IF NOT EXISTS seo_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path text UNIQUE NOT NULL,
  title text NOT NULL,
  description text,
  keywords text,
  og_title text,
  og_description text,
  og_image text,
  twitter_title text,
  twitter_description text,
  twitter_image text,
  canonical_url text,
  robots text DEFAULT 'index, follow',
  schema_type text DEFAULT 'WebPage',
  priority numeric DEFAULT 0.8 CHECK (priority >= 0 AND priority <= 1),
  change_frequency text DEFAULT 'weekly' CHECK (change_frequency IN ('always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never')),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Activer RLS
ALTER TABLE seo_settings ENABLE ROW LEVEL SECURITY;

-- Politique pour les admins seulement
CREATE POLICY "Admins can manage SEO settings"
  ON seo_settings
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Politique pour lecture publique (pour l'affichage des pages)
CREATE POLICY "Public can read active SEO settings"
  ON seo_settings
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_seo_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_seo_settings_updated_at
  BEFORE UPDATE ON seo_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_seo_settings_updated_at();

-- Insérer les données par défaut pour les pages principales
INSERT INTO seo_settings (page_path, title, description, keywords, og_title, og_description, og_image, canonical_url, schema_type, priority) VALUES
(
  '/',
  'Clicklone - Générateur IA de phrases d''accroche et slogans percutants',
  'Créez 10 phrases d''accroche uniques avec notre IA Gemini. Générateur de slogans en 6 langues et 6 tons différents. Résultats instantanés pour $3.99.',
  'générateur slogan, phrase d''accroche, IA, copywriting, marketing, publicité, Gemini AI',
  'Clicklone - Trouvez votre slogan parfait en 1 clic',
  'Générateur IA de phrases d''accroche percutantes. 10 slogans personnalisés en 6 langues pour seulement $3.99. Propulsé par Gemini AI.',
  'https://clicklone.com/og-image-home.jpg',
  'https://clicklone.com/',
  'WebSite',
  1.0
),
(
  '/generator',
  'Générateur IA - Créez vos phrases d''accroche personnalisées | Clicklone',
  'Utilisez notre générateur IA pour créer 10 phrases d''accroche uniques. Choisissez parmi 6 tons et 6 langues. Résultats instantanés avec Gemini AI.',
  'générateur phrases, créer slogan, IA copywriting, phrases d''accroche personnalisées',
  'Générateur IA de phrases d''accroche - Clicklone',
  'Créez 10 phrases d''accroche uniques avec notre IA. 6 tons disponibles, 6 langues supportées. Résultats instantanés.',
  'https://clicklone.com/og-image-generator.jpg',
  'https://clicklone.com/generator',
  'WebApplication',
  0.9
),
(
  '/payment',
  'Paiement sécurisé - Débloquez vos phrases d''accroche | Clicklone',
  'Paiement sécurisé par Stripe pour débloquer vos 10 phrases d''accroche personnalisées. Accès immédiat après paiement.',
  'paiement sécurisé, Stripe, phrases d''accroche, débloquer résultats',
  'Paiement sécurisé - Clicklone',
  'Finalisez votre achat pour débloquer vos 10 phrases d''accroche personnalisées. Paiement sécurisé par Stripe.',
  'https://clicklone.com/og-image-payment.jpg',
  'https://clicklone.com/payment',
  'CheckoutPage',
  0.3
),
(
  '/success',
  'Succès - Vos phrases d''accroche sont prêtes ! | Clicklone',
  'Félicitations ! Vos 10 phrases d''accroche personnalisées sont maintenant disponibles. Copiez et utilisez-les immédiatement.',
  'phrases d''accroche prêtes, succès paiement, résultats IA',
  'Vos phrases d''accroche sont prêtes ! - Clicklone',
  'Paiement réussi ! Découvrez vos 10 phrases d''accroche personnalisées générées par IA.',
  'https://clicklone.com/og-image-success.jpg',
  'https://clicklone.com/success',
  'ConfirmationPage',
  0.1
),
(
  '/admin',
  'Administration Clicklone - Dashboard',
  'Interface d''administration pour gérer les utilisateurs, commandes et paramètres de Clicklone.',
  'admin, dashboard, gestion, administration',
  'Administration Clicklone',
  'Interface d''administration sécurisée pour la gestion de Clicklone.',
  'https://clicklone.com/og-image-admin.jpg',
  'https://clicklone.com/admin',
  'AdminPage',
  0.0
);
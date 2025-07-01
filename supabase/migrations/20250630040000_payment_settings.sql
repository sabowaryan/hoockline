/*
  # Système de paramètres de paiement

  1. Nouvelle table
    - `system_settings`
      - `id` (uuid, primary key)
      - `key` (text, unique) - Clé du paramètre
      - `value` (jsonb) - Valeur du paramètre
      - `description` (text) - Description du paramètre
      - `category` (text) - Catégorie (payment, general, etc.)
      - `is_active` (boolean) - Actif/inactif
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Paramètres de paiement
    - `payment_required` (boolean) - Si le paiement est obligatoire
    - `free_trials_allowed` (boolean) - Si les essais gratuits sont autorisés
    - `trial_limit` (integer) - Nombre d'essais gratuits autorisés
    - `payment_amount` (integer) - Montant en centimes
    - `payment_currency` (text) - Devise (EUR, USD, etc.)

  3. Sécurité
    - Enable RLS sur `system_settings`
    - Politique pour les admins seulement
    - Lecture publique pour les paramètres actifs
*/

-- Créer la table system_settings
CREATE TABLE IF NOT EXISTS system_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL,
  description text,
  category text DEFAULT 'general',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Activer RLS
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- Politique pour les admins seulement
CREATE POLICY "Admins can manage system settings"
  ON system_settings
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

-- Politique pour lecture publique des paramètres actifs
CREATE POLICY "Public can read active system settings"
  ON system_settings
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_system_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_system_settings_updated_at
  BEFORE UPDATE ON system_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_system_settings_updated_at();

-- Insérer les paramètres par défaut
INSERT INTO system_settings (key, value, description, category) VALUES
(
  'payment_required',
  'true',
  'Si le paiement est obligatoire pour utiliser le générateur',
  'payment'
),
(
  'free_trials_allowed',
  'false',
  'Si les essais gratuits sont autorisés',
  'payment'
),
(
  'trial_limit',
  '1',
  'Nombre d''essais gratuits autorisés par utilisateur',
  'payment'
),
(
  'payment_amount',
  '399',
  'Montant du paiement en centimes (3.99€)',
  'payment'
),
(
  'payment_currency',
  '"EUR"',
  'Devise du paiement',
  'payment'
),
(
  'site_name',
  '"Clicklone"',
  'Nom du site',
  'general'
),
(
  'site_description',
  '"Générateur de contenu intelligent"',
  'Description du site',
  'general'
);

-- Créer des index pour les performances
CREATE INDEX IF NOT EXISTS system_settings_key_idx ON system_settings(key);
CREATE INDEX IF NOT EXISTS system_settings_category_idx ON system_settings(category);
CREATE INDEX IF NOT EXISTS system_settings_active_idx ON system_settings(is_active);

-- Grant permissions
GRANT SELECT ON system_settings TO anon, authenticated;
GRANT ALL ON system_settings TO authenticated; 
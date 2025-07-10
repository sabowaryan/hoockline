-- Migration pour corriger les politiques RLS de payment_tokens
-- Problème : La table payment_tokens n'a que des politiques de lecture, pas d'insertion

-- Ajouter la politique d'insertion pour payment_tokens
CREATE POLICY "Public can insert payment tokens"
  ON payment_tokens FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Ajouter la politique de mise à jour pour payment_tokens
CREATE POLICY "Public can update payment tokens"
  ON payment_tokens FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Donner les permissions d'insertion et mise à jour
GRANT INSERT, UPDATE ON payment_tokens TO anon, authenticated; 
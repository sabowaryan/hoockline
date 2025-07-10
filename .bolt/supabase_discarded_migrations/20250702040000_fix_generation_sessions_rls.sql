-- Migration pour corriger les politiques RLS de generation_sessions
-- Problème : La table generation_sessions n'a pas de politique UPDATE pour l'upsert

-- Ajouter la politique de mise à jour pour generation_sessions
CREATE POLICY "Public can update generation sessions"
  ON generation_sessions FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Donner les permissions de mise à jour
GRANT UPDATE ON generation_sessions TO anon, authenticated; 
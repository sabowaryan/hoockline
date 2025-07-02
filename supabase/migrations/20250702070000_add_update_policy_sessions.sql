-- Migration pour ajouter la politique UPDATE sur generation_sessions
-- Permet la mise à jour des sessions avec le même session_id

-- Ajout de la politique UPDATE
CREATE POLICY "Update own session" ON generation_sessions
  FOR UPDATE TO anon, authenticated
  USING (session_id = current_setting('my.session_id', true))
  WITH CHECK (session_id = current_setting('my.session_id', true));

-- Note: Cette politique permet la mise à jour uniquement si:
-- 1. Le session_id correspond à celui de la session courante
-- 2. Le nouveau session_id reste le même (WITH CHECK)

-- S'assurer que les permissions UPDATE sont accordées
GRANT UPDATE ON generation_sessions TO anon, authenticated;
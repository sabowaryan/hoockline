/*
  # Système de sessions anonymes et tokens de paiement
  # Script corrigé et idempotent (v2)
  
  Tables :
  1. generation_sessions : Suivi des essais par session
  2. pending_results : Résultats en attente de paiement
  3. payment_tokens : Tokens de paiement uniques
*/

-- 0. Création et configuration de l'extension pg_cron
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA public;
GRANT USAGE ON SCHEMA cron TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA cron TO postgres;

-- 1. Supprimer les anciennes tables et objets dépendants (y compris les politiques)
-- L'utilisation de CASCADE supprime également les index, politiques, etc. associés aux tables.
DROP TABLE IF EXISTS payment_tokens CASCADE;
DROP TABLE IF EXISTS pending_results CASCADE;
DROP TABLE IF EXISTS generation_sessions CASCADE;
DROP TABLE IF EXISTS user_status CASCADE; -- Supprime l'ancienne table si elle existe

-- 2. Création des tables
-- Table des sessions de génération
CREATE TABLE generation_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text UNIQUE NOT NULL,
  trial_count integer DEFAULT 0,
  first_generation timestamptz DEFAULT now(),
  last_generation timestamptz DEFAULT now(),
  ip_address text -- Optionnel, pour prévention des abus
);

-- Table des résultats en attente
CREATE TABLE pending_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  result_id text UNIQUE NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz NOT NULL,
  claimed_at timestamptz,
  payment_token text,
  session_id text NOT NULL
);

-- Table des tokens de paiement
CREATE TABLE payment_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token text UNIQUE NOT NULL,
  amount integer NOT NULL, -- en centimes
  currency text DEFAULT 'EUR',
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz,
  is_used boolean DEFAULT false,
  used_at timestamptz,
  result_id text REFERENCES pending_results(result_id),
  session_id text NOT NULL
);

-- 3. Création des index pour les performances
CREATE INDEX generation_sessions_session_id_idx ON generation_sessions(session_id);
CREATE INDEX pending_results_result_id_idx ON pending_results(result_id);
CREATE INDEX payment_tokens_token_idx ON payment_tokens(token);
CREATE INDEX pending_results_expires_at_idx ON pending_results(expires_at);
CREATE INDEX payment_tokens_expires_at_idx ON payment_tokens(expires_at);

-- 4. Fonction pour nettoyer les anciennes données
CREATE OR REPLACE FUNCTION cleanup_expired_data() RETURNS void AS $$
BEGIN
  -- Supprimer les résultats expirés non réclamés
  DELETE FROM pending_results 
  WHERE expires_at < now() 
  AND claimed_at IS NULL;
  
  -- Invalider les tokens de paiement expirés
  UPDATE payment_tokens 
  SET is_used = true, used_at = now()
  WHERE expires_at < now() 
  AND is_used = false;
  
  -- Supprimer les anciennes sessions (plus de 30 jours d'inactivité)
  DELETE FROM generation_sessions 
  WHERE last_generation < now() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;

-- 5. Planification du nettoyage
DO $$
BEGIN
  -- On essaie d'abord de supprimer l'ancien job s'il existe
  PERFORM cron.unschedule('cleanup-expired-data');
EXCEPTION
  WHEN OTHERS THEN
    NULL; -- Ignore toute erreur
END $$;

DO $$
BEGIN
  PERFORM cron.schedule(
    'cleanup-expired-data',
    '0 0 * * *', -- À minuit chaque jour
    'SELECT cleanup_expired_data()'
  );
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Erreur lors de la planification du job: %', SQLERRM;
END $$;

-- 6. Activation de la sécurité au niveau des lignes (RLS)
ALTER TABLE generation_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE pending_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_tokens ENABLE ROW LEVEL SECURITY;

-- 7. Création des politiques de sécurité
-- Comme les tables sont recréées, les anciennes politiques sont supprimées.
CREATE POLICY "Insert session with session_id" ON generation_sessions
  FOR INSERT TO anon, authenticated
  WITH CHECK (session_id IS NOT NULL);

CREATE POLICY "Select own session" ON generation_sessions
  FOR SELECT TO anon, authenticated
  USING (session_id = current_setting('my.session_id', true));

CREATE POLICY "Insert pending result with session_id" ON pending_results
  FOR INSERT TO anon, authenticated
  WITH CHECK (session_id IS NOT NULL);

CREATE POLICY "Select own pending result" ON pending_results
  FOR SELECT TO anon, authenticated
  USING (session_id = current_setting('my.session_id', true));

CREATE POLICY "Insert payment token with session_id" ON payment_tokens
  FOR INSERT TO anon, authenticated
  WITH CHECK (session_id IS NOT NULL);

CREATE POLICY "Select own payment token" ON payment_tokens
  FOR SELECT TO anon, authenticated
  USING (session_id = current_setting('my.session_id', true));

-- 8. Attribution des permissions
-- On accorde les permissions directement sur les tables.
-- Aucune permission sur les séquences n'est nécessaire car nous utilisons des UUID.
GRANT SELECT, INSERT ON TABLE generation_sessions TO anon, authenticated;
GRANT SELECT, INSERT ON TABLE pending_results TO anon, authenticated;
GRANT SELECT, INSERT ON TABLE payment_tokens TO anon, authenticated;

-- 9. Fonction RPC pour lecture sécurisée par session
CREATE OR REPLACE FUNCTION get_pending_results_for_session(session_id_input text)
RETURNS SETOF pending_results
LANGUAGE plpgsql
AS $$
BEGIN
  PERFORM set_config('my.session_id', session_id_input, true);
  RETURN QUERY
    SELECT * FROM pending_results WHERE session_id = session_id_input;
END;
$$;

-- 10. Fonction RPC pour lecture sécurisée des payment_tokens par session
CREATE OR REPLACE FUNCTION get_payment_tokens_for_session(session_id_input text)
RETURNS SETOF payment_tokens
LANGUAGE plpgsql
AS $$
BEGIN
  PERFORM set_config('my.session_id', session_id_input, true);
  RETURN QUERY
    SELECT * FROM payment_tokens WHERE session_id = session_id_input;
END;
$$;

-- 11. Fonction RPC pour lecture sécurisée des generation_sessions par session
CREATE OR REPLACE FUNCTION get_generation_sessions_for_session(session_id_input text)
RETURNS SETOF generation_sessions
LANGUAGE plpgsql
AS $$
BEGIN
  PERFORM set_config('my.session_id', session_id_input, true);
  RETURN QUERY
    SELECT * FROM generation_sessions WHERE session_id = session_id_input;
END;
$$;

-- 12. Fonction RPC pour récupérer un résultat spécifique de manière sécurisée
CREATE OR REPLACE FUNCTION get_pending_result_by_id(
  session_id_input text,
  result_id_input text
)
RETURNS TABLE (
  result_id text,
  content text,
  created_at timestamptz,
  expires_at timestamptz,
  claimed_at timestamptz,
  payment_token text
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Définir la variable de session pour la politique RLS
  PERFORM set_config('my.session_id', session_id_input, true);
  
  -- Retourner le résultat spécifique pour cette session
  RETURN QUERY
  SELECT 
    pr.result_id,
    pr.content,
    pr.created_at,
    pr.expires_at,
    pr.claimed_at,
    pr.payment_token
  FROM pending_results pr
  WHERE pr.session_id = session_id_input
    AND pr.result_id = result_id_input
  LIMIT 1;
END;
$$;

-- Accorder les permissions d'exécution sur la fonction
GRANT EXECUTE ON FUNCTION get_pending_result_by_id(text, text) TO anon, authenticated;

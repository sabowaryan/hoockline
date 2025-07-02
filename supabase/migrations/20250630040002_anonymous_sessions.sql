/*
  # Système de sessions anonymes et tokens de paiement
  # Script corrigé et idempotent (v2)
  
  Tables :
  1. generation_sessions : Suivi des essais par session
  2. pending_results : Résultats en attente de paiement
  3. payment_tokens : Tokens de paiement uniques
*/

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
  payment_token text
);

-- Table des tokens de paiement
CREATE TABLE payment_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token text UNIQUE NOT NULL,
  amount integer NOT NULL, -- en centimes
  currency text DEFAULT 'USD',
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz,
  is_used boolean DEFAULT false,
  used_at timestamptz,
  result_id text REFERENCES pending_results(result_id)
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
-- On supprime l'ancien job pour éviter les erreurs, puis on le recrée.
SELECT cron.unschedule('cleanup-expired-data');
SELECT cron.schedule(
  'cleanup-expired-data',
  '0 0 * * *', -- À minuit chaque jour
  'SELECT cleanup_expired_data()'
);

-- 6. Activation de la sécurité au niveau des lignes (RLS)
ALTER TABLE generation_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE pending_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_tokens ENABLE ROW LEVEL SECURITY;

-- 7. Création des politiques de sécurité
-- Comme les tables sont recréées, les anciennes politiques sont supprimées.
CREATE POLICY "Public can insert generation sessions"
  ON generation_sessions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Sessions are publicly readable"
  ON generation_sessions FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public can insert pending results"
  ON pending_results FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Results are publicly readable"
  ON pending_results FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Tokens are publicly readable"
  ON payment_tokens FOR SELECT
  TO anon, authenticated
  USING (true);

-- 8. Attribution des permissions
-- On accorde les permissions directement sur les tables.
-- Aucune permission sur les séquences n'est nécessaire car nous utilisons des UUID.
GRANT SELECT, INSERT ON TABLE generation_sessions TO anon, authenticated;
GRANT SELECT, INSERT ON TABLE pending_results TO anon, authenticated;
GRANT SELECT ON TABLE payment_tokens TO anon, authenticated;

-- Migration pour ajouter les fonctions RPC pour la gestion des essais
-- Ces fonctions permettent d'incrémenter et de lire le compteur d'essais de manière sécurisée

-- Fonction pour récupérer le compteur d'essais
CREATE OR REPLACE FUNCTION get_trial_count(
  session_id_input text
)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  trial_count_value integer;
BEGIN
  -- Définir la variable de session pour la politique RLS
  PERFORM set_config('my.session_id', session_id_input, true);
  
  -- Récupérer le compteur d'essais
  SELECT trial_count INTO trial_count_value
  FROM generation_sessions
  WHERE session_id = session_id_input;
  
  -- Retourner 0 si aucune session trouvée
  RETURN COALESCE(trial_count_value, 0);
END;
$$;

-- Fonction pour incrémenter le compteur d'essais
CREATE OR REPLACE FUNCTION increment_trial_count(
  session_id_input text,
  new_trial_count integer
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Définir la variable de session pour la politique RLS
  PERFORM set_config('my.session_id', session_id_input, true);
  
  -- Mettre à jour ou insérer la session
  INSERT INTO generation_sessions (
    session_id,
    trial_count,
    last_generation
  ) VALUES (
    session_id_input,
    new_trial_count,
    now()
  )
  ON CONFLICT (session_id) DO UPDATE
  SET 
    trial_count = EXCLUDED.trial_count,
    last_generation = EXCLUDED.last_generation;
END;
$$;

-- Accorder les permissions d'exécution sur les fonctions
GRANT EXECUTE ON FUNCTION get_trial_count(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION increment_trial_count(text, integer) TO anon, authenticated; 
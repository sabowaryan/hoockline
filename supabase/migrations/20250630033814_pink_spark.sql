/*
  # Fix conversion funnel view to handle null values

  1. Updates
    - Fix conversion_funnel view to ensure conversion_rate is never null
    - Add COALESCE to handle division by zero cases
    - Ensure proper data types and safe calculations

  2. Security
    - Maintains existing RLS policies
    - No changes to permissions
*/

-- Drop and recreate the conversion_funnel view with null safety
DROP VIEW IF EXISTS conversion_funnel;

CREATE OR REPLACE VIEW conversion_funnel AS
WITH funnel_steps AS (
  SELECT 
    session_id,
    MAX(CASE WHEN event_type = 'page_view' AND page_path = '/' THEN 1 ELSE 0 END) as visited_home,
    MAX(CASE WHEN event_type = 'generator_start' THEN 1 ELSE 0 END) as started_generator,
    MAX(CASE WHEN event_type = 'payment_start' THEN 1 ELSE 0 END) as started_payment,
    MAX(CASE WHEN event_type = 'payment_complete' THEN 1 ELSE 0 END) as completed_payment
  FROM conversion_events
  WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
  GROUP BY session_id
),
base_count AS (
  SELECT COUNT(*) as total_visitors
  FROM funnel_steps 
  WHERE visited_home = 1
)
SELECT 
  'Visiteurs' as step,
  COUNT(*) as count,
  100.0 as conversion_rate
FROM funnel_steps WHERE visited_home = 1
UNION ALL
SELECT 
  'Générateur démarré' as step,
  COUNT(*) as count,
  COALESCE(
    ROUND(
      COUNT(*) * 100.0 / NULLIF((SELECT total_visitors FROM base_count), 0), 
      2
    ), 
    0.0
  ) as conversion_rate
FROM funnel_steps WHERE started_generator = 1
UNION ALL
SELECT 
  'Paiement démarré' as step,
  COUNT(*) as count,
  COALESCE(
    ROUND(
      COUNT(*) * 100.0 / NULLIF((SELECT total_visitors FROM base_count), 0), 
      2
    ), 
    0.0
  ) as conversion_rate
FROM funnel_steps WHERE started_payment = 1
UNION ALL
SELECT 
  'Paiement complété' as step,
  COUNT(*) as count,
  COALESCE(
    ROUND(
      COUNT(*) * 100.0 / NULLIF((SELECT total_visitors FROM base_count), 0), 
      2
    ), 
    0.0
  ) as conversion_rate
FROM funnel_steps WHERE completed_payment = 1;

-- Grant permissions
GRANT SELECT ON conversion_funnel TO authenticated;
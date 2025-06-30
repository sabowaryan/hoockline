/*
  # Add conversion tracking system

  1. New Tables
    - `conversion_events`: Track user journey events
      - `id` (bigint, primary key)
      - `session_id` (text, not null)
      - `event_type` (text, not null) - 'page_view', 'generator_start', 'payment_start', 'payment_complete'
      - `page_path` (text, nullable)
      - `metadata` (jsonb, nullable) - Additional data like concept, tone, language
      - `created_at` (timestamp with time zone, default now())

  2. Enhanced Analytics Views
    - `conversion_funnel`: Conversion rates by step
    - `traffic_sources`: Enhanced traffic source analysis
    - `user_journey`: Complete user journey tracking

  3. Security
    - Enable RLS on conversion_events table
    - Admins can view conversion data
    - Service role can insert events

  4. Performance
    - Indexes on session_id, event_type, and created_at
*/

-- Create conversion_events table
CREATE TABLE IF NOT EXISTS conversion_events (
  id bigint primary key generated always as identity,
  session_id text not null,
  event_type text not null,
  page_path text,
  metadata jsonb,
  created_at timestamp with time zone default now()
);

-- Enable Row Level Security
ALTER TABLE conversion_events ENABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS conversion_events_session_id_idx ON conversion_events(session_id);
CREATE INDEX IF NOT EXISTS conversion_events_event_type_idx ON conversion_events(event_type);
CREATE INDEX IF NOT EXISTS conversion_events_created_at_idx ON conversion_events(created_at);

-- RLS Policies
CREATE POLICY "Admins can view conversion events"
  ON conversion_events
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Service role can insert conversion events"
  ON conversion_events
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Add traffic source columns to page_views
ALTER TABLE page_views 
ADD COLUMN IF NOT EXISTS traffic_source text,
ADD COLUMN IF NOT EXISTS utm_campaign text,
ADD COLUMN IF NOT EXISTS utm_medium text,
ADD COLUMN IF NOT EXISTS utm_content text,
ADD COLUMN IF NOT EXISTS country text,
ADD COLUMN IF NOT EXISTS region text,
ADD COLUMN IF NOT EXISTS city text,
ADD COLUMN IF NOT EXISTS timezone text;

-- Create time tracking table
CREATE TABLE IF NOT EXISTS page_time_tracking (
  id bigint primary key generated always as identity,
  session_id text not null,
  page_path text not null,
  time_spent_seconds integer not null,
  is_bounce boolean default false,
  created_at timestamp with time zone default now()
);

-- Enable RLS on time tracking
ALTER TABLE page_time_tracking ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX IF NOT EXISTS page_time_tracking_session_id_idx ON page_time_tracking(session_id);
CREATE INDEX IF NOT EXISTS page_time_tracking_page_path_idx ON page_time_tracking(page_path);
CREATE INDEX IF NOT EXISTS page_time_tracking_created_at_idx ON page_time_tracking(created_at);

-- RLS Policies for time tracking
CREATE POLICY "Admins can view time tracking"
  ON page_time_tracking
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Service role can insert time tracking"
  ON page_time_tracking
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Create enhanced analytics views

-- Conversion funnel view
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
  ROUND(COUNT(*) * 100.0 / NULLIF((SELECT COUNT(*) FROM funnel_steps WHERE visited_home = 1), 0), 2) as conversion_rate
FROM funnel_steps WHERE started_generator = 1
UNION ALL
SELECT 
  'Paiement démarré' as step,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / NULLIF((SELECT COUNT(*) FROM funnel_steps WHERE visited_home = 1), 0), 2) as conversion_rate
FROM funnel_steps WHERE started_payment = 1
UNION ALL
SELECT 
  'Paiement complété' as step,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / NULLIF((SELECT COUNT(*) FROM funnel_steps WHERE visited_home = 1), 0), 2) as conversion_rate
FROM funnel_steps WHERE completed_payment = 1;

-- Traffic sources view
CREATE OR REPLACE VIEW traffic_sources AS
SELECT 
  COALESCE(traffic_source, 'direct') as source,
  COUNT(*) as total_visits,
  COUNT(DISTINCT session_id) as unique_sessions,
  COUNT(DISTINCT DATE(created_at)) as active_days,
  MAX(created_at) as last_visit
FROM page_views
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY COALESCE(traffic_source, 'direct')
ORDER BY total_visits DESC;

-- User journey view
CREATE OR REPLACE VIEW user_journey AS
SELECT 
  ce.session_id,
  ce.event_type,
  ce.page_path,
  ce.metadata,
  ce.created_at,
  pv.traffic_source,
  pv.country,
  pv.region
FROM conversion_events ce
LEFT JOIN page_views pv ON ce.session_id = pv.session_id AND ce.page_path = pv.page_path
ORDER BY ce.session_id, ce.created_at;

-- Grant permissions
GRANT SELECT ON conversion_events TO authenticated;
GRANT SELECT ON page_time_tracking TO authenticated;
GRANT SELECT ON conversion_funnel TO authenticated;
GRANT SELECT ON traffic_sources TO authenticated;
GRANT SELECT ON user_journey TO authenticated;
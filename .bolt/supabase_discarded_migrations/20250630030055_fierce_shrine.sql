/*
  # Traffic Analytics System

  1. New Tables
    - `page_views`: Stores page view tracking data
      - `id` (bigint, primary key)
      - `page_path` (text, the URL path visited)
      - `user_agent` (text, browser/device info)
      - `referrer` (text, where the user came from)
      - `ip_hash` (text, hashed IP for privacy)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on page_views table
    - Add policies for service role to insert data
    - Add policies for admins to view analytics data

  3. Indexes
    - Add indexes for performance on common queries
*/

-- Create page_views table
CREATE TABLE IF NOT EXISTS page_views (
  id bigint primary key generated always as identity,
  page_path text not null,
  user_agent text,
  referrer text,
  ip_hash text,
  session_id text,
  created_at timestamp with time zone default now()
);

-- Enable Row Level Security
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

-- Policy for service role to insert page views (from Edge Function)
CREATE POLICY "Service role can insert page views"
  ON page_views
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Policy for admins to view all page views
CREATE POLICY "Admins can view page views"
  ON page_views
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS page_views_page_path_idx ON page_views(page_path);
CREATE INDEX IF NOT EXISTS page_views_created_at_idx ON page_views(created_at);
CREATE INDEX IF NOT EXISTS page_views_session_id_idx ON page_views(session_id);

-- Create a view for daily page views
CREATE VIEW daily_page_views WITH (security_invoker = true) AS
SELECT 
  DATE(created_at) as date,
  page_path,
  COUNT(*) as views,
  COUNT(DISTINCT session_id) as unique_sessions
FROM page_views 
GROUP BY DATE(created_at), page_path
ORDER BY date DESC, views DESC;

-- Create a view for popular pages
CREATE VIEW popular_pages WITH (security_invoker = true) AS
SELECT 
  page_path,
  COUNT(*) as total_views,
  COUNT(DISTINCT session_id) as unique_sessions,
  COUNT(DISTINCT DATE(created_at)) as days_active,
  MAX(created_at) as last_view
FROM page_views 
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY page_path
ORDER BY total_views DESC;

-- Grant permissions
GRANT SELECT ON daily_page_views TO authenticated;
GRANT SELECT ON popular_pages TO authenticated;
GRANT ALL ON page_views TO service_role;
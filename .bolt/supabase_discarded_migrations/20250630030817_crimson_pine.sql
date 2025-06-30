/*
  # Add page views analytics system

  1. New Tables
    - `page_views`: Store individual page view events
      - `id` (bigint, primary key)
      - `page_path` (text, the page URL path)
      - `user_agent` (text, browser user agent)
      - `referrer` (text, referring page)
      - `ip_hash` (text, hashed IP for privacy)
      - `session_id` (text, session identifier)
      - `created_at` (timestamp)

  2. Views
    - `daily_page_views`: Aggregated daily statistics
    - `popular_pages`: Most visited pages with metrics

  3. Security
    - Enable RLS on page_views table
    - Only admins can view analytics data
    - Service role can insert page views (for tracking function)

  4. Indexes
    - Optimize queries for analytics dashboard
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS page_views_page_path_idx ON page_views(page_path);
CREATE INDEX IF NOT EXISTS page_views_created_at_idx ON page_views(created_at);
CREATE INDEX IF NOT EXISTS page_views_session_id_idx ON page_views(session_id);

-- RLS Policies
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

CREATE POLICY "Service role can insert page views"
  ON page_views
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Create view for daily page view statistics
CREATE VIEW daily_page_views AS
SELECT 
  DATE(created_at) as date,
  page_path,
  COUNT(*) as views,
  COUNT(DISTINCT session_id) as unique_sessions
FROM page_views
GROUP BY DATE(created_at), page_path
ORDER BY date DESC, views DESC;

-- Create view for popular pages
CREATE VIEW popular_pages AS
SELECT 
  page_path,
  COUNT(*) as total_views,
  COUNT(DISTINCT session_id) as unique_sessions,
  COUNT(DISTINCT DATE(created_at)) as days_active,
  MAX(created_at) as last_view
FROM page_views
GROUP BY page_path
ORDER BY total_views DESC;

-- Grant permissions
GRANT SELECT ON daily_page_views TO authenticated;
GRANT SELECT ON popular_pages TO authenticated;
ALTER TABLE post_views ADD COLUMN country text;
ALTER TABLE post_views ADD COLUMN city text;
ALTER TABLE post_views ADD COLUMN user_agent text;

CREATE TABLE search_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  search_term text NOT NULL,
  results_count integer DEFAULT 0,
  session_id text,
  searched_at timestamptz DEFAULT now()
);

ALTER TABLE search_analytics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert search analytics" ON search_analytics FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view search analytics" ON search_analytics FOR SELECT USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);

CREATE TABLE post_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
  is_helpful boolean NOT NULL,
  session_id text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE post_feedback ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable insert for public" ON post_feedback FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable read access for all" ON post_feedback FOR SELECT USING (true);
CREATE POLICY "Enable all for authenticated users" ON post_feedback FOR ALL USING (auth.role() = 'authenticated');

CREATE TABLE media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  file_url text NOT NULL,
  file_name text NOT NULL,
  alt_text text,
  width integer,
  height integer,
  size integer,
  mime_type text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE media ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Media is viewable by everyone" ON media FOR SELECT USING (true);
CREATE POLICY "Media is insertable by authenticated admins" ON media FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Media is updatable by authenticated admins" ON media FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Media is deletable by authenticated admins" ON media FOR DELETE USING (auth.role() = 'authenticated');

CREATE TRIGGER update_media_updated_at BEFORE UPDATE ON media FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

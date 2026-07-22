-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_tags ENABLE ROW LEVEL SECURITY;

-- Categories RLS
CREATE POLICY "Categories are viewable by everyone" ON categories
  FOR SELECT USING (true);
CREATE POLICY "Categories are insertable by authenticated admins" ON categories
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Categories are updatable by authenticated admins" ON categories
  FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Categories are deletable by authenticated admins" ON categories
  FOR DELETE USING (auth.role() = 'authenticated');

-- Tags RLS
CREATE POLICY "Tags are viewable by everyone" ON tags
  FOR SELECT USING (true);
CREATE POLICY "Tags are insertable by authenticated admins" ON tags
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Tags are updatable by authenticated admins" ON tags
  FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Tags are deletable by authenticated admins" ON tags
  FOR DELETE USING (auth.role() = 'authenticated');

-- Posts RLS
CREATE POLICY "Published posts are viewable by everyone" ON posts
  FOR SELECT USING (status = 'published');
CREATE POLICY "All posts are viewable by authenticated admins" ON posts
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Posts are insertable by authenticated admins" ON posts
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Posts are updatable by authenticated admins" ON posts
  FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Posts are deletable by authenticated admins" ON posts
  FOR DELETE USING (auth.role() = 'authenticated');

-- Post Tags RLS
CREATE POLICY "Post tags are viewable by everyone" ON post_tags
  FOR SELECT USING (true);
CREATE POLICY "Post tags are insertable by authenticated admins" ON post_tags
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Post tags are deletable by authenticated admins" ON post_tags
  FOR DELETE USING (auth.role() = 'authenticated');

-- Phase 1 RLS
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable insert for public" ON subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable all for authenticated users" ON subscribers FOR ALL USING (auth.role() = 'authenticated');

ALTER TABLE lead_magnets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all" ON lead_magnets FOR SELECT USING (true);
CREATE POLICY "Enable all for authenticated users" ON lead_magnets FOR ALL USING (auth.role() = 'authenticated');

ALTER TABLE lead_magnet_downloads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable insert for public" ON lead_magnet_downloads FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable all for authenticated users" ON lead_magnet_downloads FOR ALL USING (auth.role() = 'authenticated');

ALTER TABLE post_views ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable insert for public" ON post_views FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable read access for all" ON post_views FOR SELECT USING (true);
CREATE POLICY "Enable all for authenticated users" ON post_views FOR ALL USING (auth.role() = 'authenticated');

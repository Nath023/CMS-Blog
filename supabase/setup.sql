-- ==============================================================================
-- SUPABASE FULL SETUP SCRIPT
-- Contains Tables, Indexes, Functions, Triggers, Policies, Storage, and Seed Data
-- ==============================================================================

-- 1. TABLES & SCHEMA

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Tags Table
CREATE TABLE IF NOT EXISTS tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Lead Magnets
CREATE TABLE IF NOT EXISTS lead_magnets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  file_url text NOT NULL,
  cover_image_url text,
  button_text text DEFAULT 'Download Now',
  success_message text DEFAULT 'Thanks! Your download will begin shortly.',
  is_active boolean DEFAULT true,
  download_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Posts Table
CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text,
  content text NOT NULL,
  featured_image_url text,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  lead_magnet_id uuid REFERENCES lead_magnets(id) ON DELETE SET NULL,
  author_name text DEFAULT 'Admin User',
  author_bio text,
  author_social_link text,
  author_image_url text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  meta_title text,
  meta_description text,
  og_image_url text,
  view_count integer DEFAULT 0,
  published_at timestamptz,
  scheduled_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Post Tags Join Table
CREATE TABLE IF NOT EXISTS post_tags (
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
  tag_id uuid REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

-- Subscribers
CREATE TABLE IF NOT EXISTS subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  first_name text,
  source text,
  post_id uuid REFERENCES posts(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed')),
  consent_given boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Lead Magnet Downloads
CREATE TABLE IF NOT EXISTS lead_magnet_downloads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_magnet_id uuid REFERENCES lead_magnets(id) ON DELETE CASCADE,
  subscriber_id uuid REFERENCES subscribers(id) ON DELETE SET NULL,
  email text NOT NULL,
  first_name text,
  source_post_id uuid REFERENCES posts(id) ON DELETE SET NULL,
  downloaded_at timestamptz DEFAULT now()
);

-- Post Views
CREATE TABLE IF NOT EXISTS post_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
  session_id text NOT NULL,
  referrer text,
  device_type text,
  viewed_at timestamptz DEFAULT now()
);

-- Media
CREATE TABLE IF NOT EXISTS media (
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

-- Settings Table
CREATE TABLE IF NOT EXISTS settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);


-- 2. INDEXES
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category_id);
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_post_tags_post ON post_tags(post_id);
CREATE INDEX IF NOT EXISTS idx_post_tags_tag ON post_tags(tag_id);
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers(email);
CREATE INDEX IF NOT EXISTS idx_post_views_post ON post_views(post_id);
CREATE INDEX IF NOT EXISTS idx_settings_key ON settings(key);

-- 3. FUNCTIONS & TRIGGERS
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = now();
   RETURN NEW;
END;
$$ language 'plpgsql';

DO $$ BEGIN
  CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TRIGGER update_subscribers_updated_at BEFORE UPDATE ON subscribers FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TRIGGER update_lead_magnets_updated_at BEFORE UPDATE ON lead_magnets FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TRIGGER update_media_updated_at BEFORE UPDATE ON media FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE OR REPLACE FUNCTION increment_download_count(row_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE lead_magnets
  SET download_count = COALESCE(download_count, 0) + 1
  WHERE id = row_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 4. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_magnets ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_magnet_downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Categories
DO $$ BEGIN CREATE POLICY "Categories are viewable by everyone" ON categories FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Categories are insertable by authenticated admins" ON categories FOR INSERT WITH CHECK (auth.role() = 'authenticated'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Categories are updatable by authenticated admins" ON categories FOR UPDATE USING (auth.role() = 'authenticated'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Categories are deletable by authenticated admins" ON categories FOR DELETE USING (auth.role() = 'authenticated'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Tags
DO $$ BEGIN CREATE POLICY "Tags are viewable by everyone" ON tags FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Tags are insertable by authenticated admins" ON tags FOR INSERT WITH CHECK (auth.role() = 'authenticated'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Tags are updatable by authenticated admins" ON tags FOR UPDATE USING (auth.role() = 'authenticated'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Tags are deletable by authenticated admins" ON tags FOR DELETE USING (auth.role() = 'authenticated'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Posts
DO $$ BEGIN CREATE POLICY "Published posts are viewable by everyone" ON posts FOR SELECT USING (status = 'published'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "All posts are viewable by authenticated admins" ON posts FOR SELECT USING (auth.role() = 'authenticated'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Posts are insertable by authenticated admins" ON posts FOR INSERT WITH CHECK (auth.role() = 'authenticated'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Posts are updatable by authenticated admins" ON posts FOR UPDATE USING (auth.role() = 'authenticated'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Posts are deletable by authenticated admins" ON posts FOR DELETE USING (auth.role() = 'authenticated'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Post Tags
DO $$ BEGIN CREATE POLICY "Post tags are viewable by everyone" ON post_tags FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Post tags are insertable by authenticated admins" ON post_tags FOR INSERT WITH CHECK (auth.role() = 'authenticated'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Post tags are deletable by authenticated admins" ON post_tags FOR DELETE USING (auth.role() = 'authenticated'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Subscribers
DO $$ BEGIN CREATE POLICY "Enable insert for public" ON subscribers FOR INSERT WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Enable all for authenticated users" ON subscribers FOR ALL USING (auth.role() = 'authenticated'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Lead Magnets
DO $$ BEGIN CREATE POLICY "Enable read access for all" ON lead_magnets FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Enable all for authenticated users" ON lead_magnets FOR ALL USING (auth.role() = 'authenticated'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Lead Magnet Downloads
DO $$ BEGIN CREATE POLICY "Enable insert for public" ON lead_magnet_downloads FOR INSERT WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Enable all for authenticated users" ON lead_magnet_downloads FOR ALL USING (auth.role() = 'authenticated'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Post Views
DO $$ BEGIN CREATE POLICY "Enable insert for public" ON post_views FOR INSERT WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Enable read access for all" ON post_views FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Enable all for authenticated users" ON post_views FOR ALL USING (auth.role() = 'authenticated'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Media
DO $$ BEGIN CREATE POLICY "Media is viewable by everyone" ON media FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Media is insertable by authenticated admins" ON media FOR INSERT WITH CHECK (auth.role() = 'authenticated'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Media is updatable by authenticated admins" ON media FOR UPDATE USING (auth.role() = 'authenticated'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Media is deletable by authenticated admins" ON media FOR DELETE USING (auth.role() = 'authenticated'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Settings
DO $$ BEGIN CREATE POLICY "Allow public read-only access to settings" ON settings FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Allow authenticated full access to settings" ON settings FOR ALL USING (auth.role() = 'authenticated'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;


-- 5. STORAGE BUCKETS & POLICIES
insert into storage.buckets (id, name, public)
values 
  ('blog-images', 'blog-images', true),
  ('lead-magnets', 'lead-magnets', true)
on conflict (id) do nothing;

DO $$ BEGIN CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id IN ('blog-images', 'lead-magnets')); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Auth Insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id IN ('blog-images', 'lead-magnets') AND auth.role() = 'authenticated'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Auth Update" ON storage.objects FOR UPDATE USING (bucket_id IN ('blog-images', 'lead-magnets') AND auth.role() = 'authenticated'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Auth Delete" ON storage.objects FOR DELETE USING (bucket_id IN ('blog-images', 'lead-magnets') AND auth.role() = 'authenticated'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;


-- 6. SEED DATA

-- Insert seed categories
INSERT INTO categories (id, name, slug, description) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'Technology', 'technology', 'Insights and updates from the world of technology.'),
  ('c1000000-0000-0000-0000-000000000002', 'Design', 'design', 'Principles and practices for modern web design.'),
  ('c1000000-0000-0000-0000-000000000003', 'Marketing', 'marketing', 'Digital marketing and growth strategies.')
ON CONFLICT (id) DO NOTHING;

-- Insert seed tags
INSERT INTO tags (id, name, slug) VALUES
  ('t1000000-0000-0000-0000-000000000001', 'Programming', 'programming'),
  ('t1000000-0000-0000-0000-000000000002', 'UX', 'ux'),
  ('t1000000-0000-0000-0000-000000000003', 'SEO', 'seo')
ON CONFLICT (id) DO NOTHING;

-- Insert seed posts
INSERT INTO posts (id, title, slug, excerpt, content, category_id, status, meta_title, meta_description, published_at) VALUES
  (
    'p1000000-0000-0000-0000-000000000001',
    'Getting Started with Next.js',
    'getting-started-with-nextjs',
    'A brief introduction to building web applications with Next.js.',
    '## Introduction to Next.js

Next.js is a powerful React framework that makes building web applications easy and fast.

### Key Features
- Server-side rendering
- Static site generation
- API routes

### Conclusion
Next.js provides an excellent developer experience and great performance.',
    'c1000000-0000-0000-0000-000000000001',
    'published',
    'Getting Started with Next.js',
    'Learn the basics of building web applications with Next.js.',
    now()
  ),
  (
    'p1000000-0000-0000-0000-000000000002',
    'The Principles of Good UX Design',
    'principles-of-good-ux-design',
    'Understanding the fundamental principles that make a great user experience.',
    '## Why UX Matters

User experience is critical to the success of any application.

### Keep It Simple
Avoid clutter and focus on the primary tasks users need to accomplish.

### Consistency is Key
Use consistent design patterns and terminology throughout your application.',
    'c1000000-0000-0000-0000-000000000002',
    'published',
    'The Principles of Good UX Design',
    'Understanding the fundamental principles that make a great user experience.',
    now()
  ),
  (
    'p1000000-0000-0000-0000-000000000003',
    'Effective SEO Strategies for 2026',
    'effective-seo-strategies-2026',
    'Learn how to optimize your content for modern search engines.',
    '## SEO in 2026

Search engines are getting smarter. Here is how you can keep up.

### Quality Content
Content is still king. Ensure your articles provide real value to readers.

### Technical SEO
Make sure your site is fast, accessible, and mobile-friendly.',
    'c1000000-0000-0000-0000-000000000003',
    'published',
    'Effective SEO Strategies for 2026',
    'Learn how to optimize your content for modern search engines.',
    now()
  )
ON CONFLICT (id) DO NOTHING;

-- Link Posts and Tags
INSERT INTO post_tags (post_id, tag_id) VALUES
  ('p1000000-0000-0000-0000-000000000001', 't1000000-0000-0000-0000-000000000001'),
  ('p1000000-0000-0000-0000-000000000002', 't1000000-0000-0000-0000-000000000002'),
  ('p1000000-0000-0000-0000-000000000003', 't1000000-0000-0000-0000-000000000003')
ON CONFLICT (post_id, tag_id) DO NOTHING;

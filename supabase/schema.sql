-- Drop existing tables if needed
-- DROP TABLE IF EXISTS post_tags, posts, tags, categories;

-- Categories Table
CREATE TABLE categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Tags Table
CREATE TABLE tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Posts Table
CREATE TABLE posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text,
  content text NOT NULL,
  featured_image_url text,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  author_name text DEFAULT 'SaaS Boilerplate',
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  meta_title text,
  meta_description text,
  og_image_url text,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Post Tags Join Table
CREATE TABLE post_tags (
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
  tag_id uuid REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = now(); 
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_posts_updated_at
BEFORE UPDATE ON posts
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

-- Phase 1: Subscribers
CREATE TABLE subscribers (
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
CREATE TRIGGER update_subscribers_updated_at BEFORE UPDATE ON subscribers FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Phase 1: Lead Magnets
CREATE TABLE lead_magnets (
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
CREATE TRIGGER update_lead_magnets_updated_at BEFORE UPDATE ON lead_magnets FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Phase 1: Lead Magnet Downloads
CREATE TABLE lead_magnet_downloads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_magnet_id uuid REFERENCES lead_magnets(id) ON DELETE CASCADE,
  subscriber_id uuid REFERENCES subscribers(id) ON DELETE SET NULL,
  email text NOT NULL,
  first_name text,
  source_post_id uuid REFERENCES posts(id) ON DELETE SET NULL,
  downloaded_at timestamptz DEFAULT now()
);

-- Phase 1: Post Views
CREATE TABLE post_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
  session_id text NOT NULL,
  referrer text,
  device_type text,
  viewed_at timestamptz DEFAULT now()
);

-- Phase 1: Add lead_magnet_id and view_count to posts
ALTER TABLE posts ADD COLUMN lead_magnet_id uuid REFERENCES lead_magnets(id) ON DELETE SET NULL;
ALTER TABLE posts ADD COLUMN view_count integer DEFAULT 0;


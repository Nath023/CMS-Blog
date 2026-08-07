-- 1. Paywall: Add is_premium to posts
ALTER TABLE posts ADD COLUMN is_premium boolean DEFAULT false;

-- 2. Profiles for RBAC and User Accounts
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role text DEFAULT 'reader' CHECK (role IN ('admin', 'author', 'reader')),
  first_name text,
  last_name text,
  stripe_customer_id text,
  stripe_subscription_id text,
  subscription_status text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, role, first_name)
  VALUES (new.id, 'reader', new.raw_user_meta_data->>'first_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE handle_new_user();

-- Create profiles for any existing users (defaulting to admin for backwards compatibility with the earlier setup)
INSERT INTO profiles (id, role)
SELECT id, 'admin' FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- 3. Saved Articles
CREATE TABLE saved_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, post_id)
);

ALTER TABLE saved_articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own saved articles" ON saved_articles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own saved articles" ON saved_articles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own saved articles" ON saved_articles FOR DELETE USING (auth.uid() = user_id);

-- Update RLS for posts to support authors
-- Existing: CREATE POLICY "All posts are viewable by authenticated admins" ON posts FOR SELECT USING (auth.role() = 'authenticated');
-- We can add a more specific one for authors if needed, but for now we'll allow authenticated to view, 
-- and restrict UPDATE/DELETE to author or admin.

CREATE OR REPLACE FUNCTION get_user_role() RETURNS text AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

CREATE POLICY "Posts are updatable by author or admin" ON posts
  FOR UPDATE USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin' 
    OR 
    ( (SELECT role FROM profiles WHERE id = auth.uid()) = 'author' AND author_name = (SELECT first_name FROM profiles WHERE id = auth.uid()) )
  );


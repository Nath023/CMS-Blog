ALTER TABLE posts ADD COLUMN canonical_url text;
ALTER TABLE posts ADD COLUMN schema_markup jsonb;
ALTER TABLE posts ADD COLUMN language text DEFAULT 'en';

-- Insert seed categories
INSERT INTO categories (id, name, slug, description) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'Technology', 'technology', 'Insights and updates from the world of technology.'),
  ('c1000000-0000-0000-0000-000000000002', 'Design', 'design', 'Principles and practices for modern web design.'),
  ('c1000000-0000-0000-0000-000000000003', 'Marketing', 'marketing', 'Digital marketing and growth strategies.');

-- Insert seed tags
INSERT INTO tags (id, name, slug) VALUES
  ('t1000000-0000-0000-0000-000000000001', 'Programming', 'programming'),
  ('t1000000-0000-0000-0000-000000000002', 'UX', 'ux'),
  ('t1000000-0000-0000-0000-000000000003', 'SEO', 'seo');

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
    'Getting Started with Next.js (2026 Guide)',
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
  );

-- Link Posts and Tags
INSERT INTO post_tags (post_id, tag_id) VALUES
  ('p1000000-0000-0000-0000-000000000001', 't1000000-0000-0000-0000-000000000001'),
  ('p1000000-0000-0000-0000-000000000002', 't1000000-0000-0000-0000-000000000002'),
  ('p1000000-0000-0000-0000-000000000003', 't1000000-0000-0000-0000-000000000003');

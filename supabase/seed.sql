-- Insert seed categories
INSERT INTO categories (id, name, slug, description) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'Web Design', 'web-design', 'Insights and strategies for building high-performing websites.'),
  ('c1000000-0000-0000-0000-000000000002', 'SEO', 'seo', 'Search engine optimization tips for Nigerian businesses.'),
  ('c1000000-0000-0000-0000-000000000003', 'Marketing', 'marketing', 'Digital marketing and growth strategies.');

-- Insert seed tags
INSERT INTO tags (id, name, slug) VALUES
  ('t1000000-0000-0000-0000-000000000001', 'Pricing', 'pricing'),
  ('t1000000-0000-0000-0000-000000000002', 'Local SEO', 'local-seo'),
  ('t1000000-0000-0000-0000-000000000003', 'Abuja', 'abuja');

-- Insert seed posts
INSERT INTO posts (id, title, slug, excerpt, content, category_id, status, meta_title, meta_description, published_at) VALUES
  (
    'p1000000-0000-0000-0000-000000000001',
    'How Much Does a Website Cost in Nigeria?',
    'how-much-does-a-website-cost-in-nigeria',
    'A complete breakdown of design, hosting, and maintenance costs for Nigerian SMEs.',
    '## The True Cost of a Website in Nigeria
    
Many business owners ask: "How much does a website cost?" The answer is that it varies based on your needs.

### Domain and Hosting
You will typically spend between ₦15,000 and ₦50,000 per year for basic domain registration and hosting.

### Design and Development
A simple business website can range from ₦150,000 to ₦500,000. E-commerce sites are usually upwards of ₦400,000.

### Conclusion
Investing in a professional website pays off by establishing trust and driving online sales. Contact SaaS for a tailored quote.',
    'c1000000-0000-0000-0000-000000000001',
    'published',
    'How Much Does a Website Cost in Nigeria? (2026 Guide)',
    'Learn the typical costs for domain, hosting, and web design in Nigeria for small businesses.',
    now()
  ),
  (
    'p1000000-0000-0000-0000-000000000002',
    'SEO Checklist for Small Businesses in Abuja',
    'seo-checklist-small-businesses-abuja',
    'Essential steps to improve your local search rankings and get found by customers in Abuja.',
    '## Local SEO is Crucial
    
If you operate in Abuja, you need to ensure your customers can find you on Google.

### Step 1: Claim Your Google Business Profile
Ensure your NAP (Name, Address, Phone Number) is accurate.

### Step 2: Optimize Your On-Page Content
Include location-specific keywords, such as "Web Design in Abuja".

### Step 3: Get Local Backlinks
Network with other local businesses and directories.',
    'c1000000-0000-0000-0000-000000000002',
    'published',
    'SEO Checklist for Small Businesses in Abuja',
    'The ultimate local SEO guide for businesses operating in Abuja, Nigeria.',
    now()
  ),
  (
    'p1000000-0000-0000-0000-000000000003',
    'Why Your Business Needs a Website Before Running Ads',
    'why-your-business-needs-website-before-ads',
    'Don''t waste your ad budget. Learn why a landing page or website is essential before running Facebook or Google Ads.',
    '## The Foundation of Digital Marketing
    
Running ads without a website is like inviting guests to a house that hasn''t been built.

### Control Over the Experience
A website allows you to control the user journey and capture leads effectively.

### Better Analytics
You can track conversions and understand where your money is going using Google Analytics and Meta Pixel.',
    'c1000000-0000-0000-0000-000000000003',
    'published',
    'Why You Need a Website Before Running Ads',
    'Stop wasting your ad budget. Learn the importance of having a website before running paid campaigns.',
    now()
  ),
  (
    'p1000000-0000-0000-0000-000000000004',
    'How to Improve Your Google Business Profile',
    'how-to-improve-google-business-profile',
    'Actionable tips to optimize your Google Business Profile for maximum visibility.',
    '## Stand Out on Google Maps
    
Your Google Business Profile (GBP) is often the first thing customers see.

### Add High-Quality Photos
Businesses with photos receive 42% more requests for directions.

### Collect and Respond to Reviews
Always respond to reviews, both positive and negative, to show you care about customer feedback.',
    'c1000000-0000-0000-0000-000000000002',
    'published',
    'How to Improve Your Google Business Profile',
    'Actionable tips to optimize your GBP and stand out on Google Maps.',
    now()
  ),
  (
    'p1000000-0000-0000-0000-000000000005',
    'Website Redesign Checklist for Nigerian Businesses',
    'website-redesign-checklist-nigerian-businesses',
    'Is your website outdated? Here is what you need to consider before starting a redesign.',
    '## Is It Time for a Redesign?
    
If your website takes more than 3 seconds to load or looks terrible on mobile, it''s time for an upgrade.

### Define Your Goals
Are you looking to increase sales, improve brand awareness, or both?

### Focus on Mobile Experience
Over 70% of web traffic in Nigeria comes from mobile devices. Your new site must be mobile-first.',
    'c1000000-0000-0000-0000-000000000001',
    'published',
    'Website Redesign Checklist for Nigerian Businesses',
    'Planning a website redesign? Use this checklist to ensure your new site is a success.',
    now()
  );

-- Link Posts and Tags
INSERT INTO post_tags (post_id, tag_id) VALUES
  ('p1000000-0000-0000-0000-000000000001', 't1000000-0000-0000-0000-000000000001'),
  ('p1000000-0000-0000-0000-000000000002', 't1000000-0000-0000-0000-000000000002'),
  ('p1000000-0000-0000-0000-000000000002', 't1000000-0000-0000-0000-000000000003');

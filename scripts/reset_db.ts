import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

const envStr = readFileSync(".env", "utf-8");
const envVars = envStr.split("\n").reduce((acc, line) => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    let val = match[2].trim();
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
    acc[match[1].trim()] = val;
  }
  return acc;
}, {} as any);

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = envVars.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  await supabase.from("post_tags").delete().neq("post_id", "0");
  await supabase.from("posts").delete().neq("id", "0");
  await supabase.from("tags").delete().neq("id", "0");
  await supabase.from("categories").delete().neq("id", "0");
  
  // Seed categories
  await supabase.from("categories").insert([
    { id: 'c1000000-0000-0000-0000-000000000001', name: 'Technology', slug: 'technology', description: 'Insights and updates from the world of technology.' },
    { id: 'c1000000-0000-0000-0000-000000000002', name: 'Design', slug: 'design', description: 'Principles and practices for modern web design.' },
    { id: 'c1000000-0000-0000-0000-000000000003', name: 'Marketing', slug: 'marketing', description: 'Digital marketing and growth strategies.' }
  ]);
  
  // Seed tags
  await supabase.from("tags").insert([
    { id: 't1000000-0000-0000-0000-000000000001', name: 'Programming', slug: 'programming' },
    { id: 't1000000-0000-0000-0000-000000000002', name: 'UX', slug: 'ux' },
    { id: 't1000000-0000-0000-0000-000000000003', name: 'SEO', slug: 'seo' }
  ]);
  
  // Seed posts
  await supabase.from("posts").insert([
    {
      id: 'p1000000-0000-0000-0000-000000000001',
      title: 'Getting Started with Next.js',
      slug: 'getting-started-with-nextjs',
      excerpt: 'A brief introduction to building web applications with Next.js.',
      content: '## Introduction to Next.js\n\nNext.js is a powerful React framework that makes building web applications easy and fast.\n\n### Key Features\n- Server-side rendering\n- Static site generation\n- API routes\n\n### Conclusion\nNext.js provides an excellent developer experience and great performance.',
      category_id: 'c1000000-0000-0000-0000-000000000001',
      status: 'published',
      meta_title: 'Getting Started with Next.js',
      meta_description: 'Learn the basics of building web applications with Next.js.',
      published_at: new Date().toISOString()
    },
    {
      id: 'p1000000-0000-0000-0000-000000000002',
      title: 'The Principles of Good UX Design',
      slug: 'principles-of-good-ux-design',
      excerpt: 'Understanding the fundamental principles that make a great user experience.',
      content: '## Why UX Matters\n\nUser experience is critical to the success of any application.\n\n### Keep It Simple\nAvoid clutter and focus on the primary tasks users need to accomplish.\n\n### Consistency is Key\nUse consistent design patterns and terminology throughout your application.',
      category_id: 'c1000000-0000-0000-0000-000000000002',
      status: 'published',
      meta_title: 'The Principles of Good UX Design',
      meta_description: 'Understanding the fundamental principles that make a great user experience.',
      published_at: new Date().toISOString()
    },
    {
      id: 'p1000000-0000-0000-0000-000000000003',
      title: 'Effective SEO Strategies for 2026',
      slug: 'effective-seo-strategies-2026',
      excerpt: 'Learn how to optimize your content for modern search engines.',
      content: '## SEO in 2026\n\nSearch engines are getting smarter. Here is how you can keep up.\n\n### Quality Content\nContent is still king. Ensure your articles provide real value to readers.\n\n### Technical SEO\nMake sure your site is fast, accessible, and mobile-friendly.',
      category_id: 'c1000000-0000-0000-0000-000000000003',
      status: 'published',
      meta_title: 'Effective SEO Strategies for 2026',
      meta_description: 'Learn how to optimize your content for modern search engines.',
      published_at: new Date().toISOString()
    }
  ]);
  
  await supabase.from("post_tags").insert([
    { post_id: 'p1000000-0000-0000-0000-000000000001', tag_id: 't1000000-0000-0000-0000-000000000001' },
    { post_id: 'p1000000-0000-0000-0000-000000000002', tag_id: 't1000000-0000-0000-0000-000000000002' },
    { post_id: 'p1000000-0000-0000-0000-000000000003', tag_id: 't1000000-0000-0000-0000-000000000003' }
  ]);
  
  console.log("Done");
}

run().catch(console.error);

import { getPosts } from '@/lib/database';
import { siteConfig } from '@/config/site';

export async function GET() {
  const { data: posts } = await getPosts(1, { status: 'published' });
  const siteUrl = siteConfig.url;

  const feed = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>${siteConfig.name} Blog</title>
    <description>${siteConfig.description}</description>
    <link>${siteUrl}</link>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml" />
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${posts.map((post: any) => `
      <item>
        <title><![CDATA[${post.title}]]></title>
        <description><![CDATA[${post.excerpt || ''}]]></description>
        <link>${siteUrl}/blog/${post.slug}</link>
        <guid isPermaLink="true">${siteUrl}/blog/${post.slug}</guid>
        <pubDate>${new Date(post.published_at || post.created_at).toUTCString()}</pubDate>
        <author>${siteConfig.contact.email} (${post.author_name || siteConfig.authorBio.name})</author>
        ${post.category ? `<category><![CDATA[${post.category.name}]]></category>` : ''}
        ${post.featured_image_url ? `<media:content url="${post.featured_image_url}" medium="image" />` : ''}
      </item>
    `).join('')}
  </channel>
</rss>`;

  return new Response(feed, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400',
    },
  });
}

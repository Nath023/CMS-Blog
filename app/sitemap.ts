import { MetadataRoute } from 'next';
import { getPosts, getCategories } from '@/lib/database';
import { siteConfig } from '@/config/site';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;

  // Base routes
  const routes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];

  try {
    // Add all published posts
    const { data: posts } = await getPosts(1, { status: 'published' }); // Assuming it returns up to 100/latest, might need pagination for huge blogs, but good for now
    
    const postRoutes: MetadataRoute.Sitemap = (posts as any[]).map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updated_at ? new Date(post.updated_at) : new Date(post.published_at || post.created_at),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));
    
    routes.push(...postRoutes);

    // Add category routes
    const categories = await getCategories();
    const categoryRoutes: MetadataRoute.Sitemap = categories.map((cat) => ({
      url: `${baseUrl}/blog/category/${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    }));

    routes.push(...categoryRoutes);
    
  } catch (error) {
    console.error('Error generating sitemap:', error);
  }

  return routes;
}

export const revalidate = 3600; // Cache for 1 hour

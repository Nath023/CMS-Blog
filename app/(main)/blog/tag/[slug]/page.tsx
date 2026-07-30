import { getPostsByTag, getTagBySlug, getTags } from '@/lib/database';
import NotFound from '@/app/not-found';
import Link from 'next/link';
import Image from 'next/image';
import { Pagination } from '@/components/blog/Pagination';
import { Suspense } from 'react';

import { BlogCTA } from '@/components/blog/BlogCTA';
import { Metadata } from 'next';
import { siteConfig } from '@/config/site';

export async function generateStaticParams() {
  const tags = await getTags();
  return tags.map((tag) => ({
    slug: tag.slug,
  }));
}

export async function generateMetadata(props: { params: { slug: string } }): Promise<Metadata> {
  const params = props.params;
  const tag = await getTagBySlug(params.slug);
  if (!tag) return {};

  return {
    title: `Posts tagged "${tag.name}" | ${siteConfig.name} Blog`,
    description: `Browse articles tagged with ${tag.name}.`,
  };
}

export default async function TagPage(props: { params: { slug: string }, searchParams: { page?: string } }) {
  const params = props.params;
  const searchParams = props.searchParams;
  
  const tag = await getTagBySlug(params.slug);
  if (!tag) return <NotFound />;

  const page = Number(searchParams.page) || 1;
  const { data: posts, count } = await getPostsByTag(tag.slug, page);

  return (
    <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-8 pt-24 pb-12 lg:pt-32 lg:pb-20">
      <header className="mb-12">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100 mb-3">#{tag.name}</h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg">Posts tagged with {tag.name}</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map(post => (
          <Link href={`/blog/${post.slug}`} key={post.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm hover:border-blue-300 transition-all cursor-pointer group flex flex-col">
            <div className="w-full h-48 bg-slate-100 rounded-xl mb-4 overflow-hidden relative">
              {post.featured_image_url ? (
                <Image src={post.featured_image_url} alt={post.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100"></div>
              )}
            </div>
            {post.category && (
              <span className="text-blue-600 text-[10px] uppercase tracking-wider font-bold mb-1">
                {post.category.name}
              </span>
            )}
            <h3 className="font-bold text-slate-800 text-lg line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
              {post.title}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 line-clamp-2">
              {post.excerpt}
            </p>
          </Link>
        ))}
      </div>

      {posts.length === 0 && (
        <p className="text-slate-500 dark:text-slate-400 pt-24 pb-12 lg:pt-32 lg:pb-20 text-center">No posts found with this tag.</p>
      )}

      <Suspense fallback={<div className="h-10" />}><Pagination currentPage={page} totalItems={count} /></Suspense>
      
      <div className="max-w-2xl mx-auto mt-12">
        <BlogCTA />
      </div>
    </main>
  );
}

export const revalidate = 60;

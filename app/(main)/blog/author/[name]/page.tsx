import { getPosts } from '@/lib/database';
import NotFound from '@/app/not-found';
import Link from 'next/link';
import Image from 'next/image';
import { Pagination } from '@/components/blog/Pagination';
import { Suspense } from 'react';

import { BlogCTA } from '@/components/blog/BlogCTA';
import { Metadata } from 'next';
import { format } from 'date-fns';
import { siteConfig } from '@/config/site';

export async function generateMetadata(props: { params: { name: string } }): Promise<Metadata> {
  const params = props.params;
  const authorName = decodeURIComponent(params.name);
  return {
    title: `${authorName} Archives | ${siteConfig.name} Blog`,
    description: `Browse articles written by ${authorName}.`,
  };
}

export default async function AuthorPage(props: { params: { name: string }, searchParams: { page?: string } }) {
  const params = props.params;
  const searchParams = props.searchParams;
  const authorName = decodeURIComponent(params.name);
  const page = Number(searchParams.page) || 1;
  const { data: posts, count } = await getPosts(page, { status: 'published', authorName });

  if (posts.length === 0 && page === 1) {
    return <NotFound />;
  }

  return (
    <main className="flex-1 w-full bg-slate-50 dark:bg-slate-950/50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-12 lg:pt-48 lg:pb-20">
        <header className="mb-16 md:mb-24 max-w-3xl text-center mx-auto">
          <span className="text-blue-600 font-bold uppercase tracking-wider text-sm mb-4 block">Author Profile</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mb-6 leading-[1.1]">
            {authorName}
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Articles by {authorName}
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {posts.map(post => (
            <Link href={`/blog/${post.slug}`} key={post.id} className="group flex flex-col h-full">
              <div className="w-full aspect-[4/3] bg-slate-200 rounded-2xl mb-6 overflow-hidden relative shadow-sm transition-shadow group-hover:shadow-md">
                {post.featured_image_url ? (
                  <Image src={post.featured_image_url} alt={post.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200"></div>
                )}
              </div>
              <div className="flex flex-col flex-1">
                <div className="flex items-center gap-3 mb-3 text-xs font-semibold tracking-wide uppercase">
                  {post.published_at && (
                    <span className="text-slate-400">
                      {format(new Date(post.published_at), 'MMM d, yyyy')}
                    </span>
                  )}
                  {post.category && (
                    <span className="text-blue-600 dark:text-blue-400">
                      &bull; {post.category.name}
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-xl leading-tight mb-3 group-hover:text-blue-600 transition-colors line-clamp-3">
                  {post.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed text-sm md:text-base">
                  {post.excerpt}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {posts.length === 0 && (
          <p className="text-slate-500 dark:text-slate-400 py-12 text-center text-lg">No posts found by this author.</p>
        )}

        <div className="mt-12 border-t border-slate-200 dark:border-slate-800 pt-8">
          <Suspense fallback={<div className="h-10" />}><Pagination currentPage={page} totalItems={count} /></Suspense>
        </div>

        <div className="max-w-2xl mx-auto mt-20">
          <BlogCTA />
        </div>
      </div>
    </main>
  );
}

export const revalidate = 60;

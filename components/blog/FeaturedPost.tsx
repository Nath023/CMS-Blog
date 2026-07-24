import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { PostWithCategoryAndTags } from '@/lib/database';
import { Image as ImageIcon } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { Card } from '@/components/ui/Card';

export function FeaturedPost({ post, defaultAuthor }: { post: PostWithCategoryAndTags, defaultAuthor?: string }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group cursor-pointer">
      <Card className="flex flex-col md:flex-row gap-8 lg:gap-12 items-center p-4 md:p-6 hover:-translate-y-2 hover:shadow-xl hover:border-primary/30">
        <div className="w-full md:w-1/2 aspect-[4/3] bg-slate-100 dark:bg-slate-800 rounded-3xl overflow-hidden relative">
        {post.featured_image_url ? (
          <Image src={post.featured_image_url} alt={post.title} fill priority sizes="(max-width: 768px) 100vw, 50vw" className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center">
             <ImageIcon className="w-16 h-16 text-slate-300 dark:text-slate-600" />
          </div>
        )}
      </div>
      
      <div className="flex flex-col flex-1 w-full md:w-1/2 py-4 md:pr-6">
        <div className="flex items-center gap-4 mb-4 text-xs font-bold tracking-wider uppercase">
          <span className="bg-secondary text-white px-4 py-1.5 rounded-full">
            Featured
          </span>
          {post.category && (
            <span className="text-primary">
              {post.category.name}
            </span>
          )}
          {post.published_at && (
            <span className="text-gray-400">
              {format(new Date(post.published_at), 'MMM d, yyyy')}
            </span>
          )}
          <span className="text-gray-400">·</span>
          <span className="text-gray-500 font-medium">{post.author_name || defaultAuthor || siteConfig.authorBio.name}</span>
        </div>
        
        <h2 className="text-3xl md:text-4xl font-serif text-slate-900 dark:text-white group-hover:text-primary transition-colors leading-[1.2] mb-5">
          {post.title}
        </h2>
        
        <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed line-clamp-3 font-sans">
          {post.excerpt}
        </p>
      </div>
      </Card>
    </Link>
  );
}

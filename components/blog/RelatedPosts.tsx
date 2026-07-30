import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { RevealWrapper } from '@/components/RevealWrapper';

export function RelatedPosts({ posts }: { posts: any[] }) {
  if (!posts || posts.length === 0) return null;

  return (
    <div className="mt-20 pt-16 border-t border-slate-200 dark:border-slate-800">
      <RevealWrapper>
        <h3 className="text-2xl md:text-3xl font-serif font-bold text-slate-900 dark:text-white mb-10">
          Related Articles
        </h3>
      </RevealWrapper>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {posts.map((post, index) => (
          <RevealWrapper key={post.id} delay={0.1 * (index + 1)}>
            <Link 
              href={`/blog/${post.slug}`} 
              className="group flex flex-col h-full bg-white dark:bg-[#0a0a0a] rounded-3xl border border-gray-100 dark:border-white/5 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:border-primary/30"
            >
              <div className="w-full aspect-[4/3] bg-slate-100 dark:bg-slate-800 overflow-hidden relative">
                {post.featured_image_url ? (
                  <Image 
                    src={post.featured_image_url} 
                    alt={post.title} 
                    fill 
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out" 
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900"></div>
                )}
              </div>
              <div className="flex flex-col flex-1 p-6">
                <div className="flex items-center gap-3 mb-3 text-xs font-bold uppercase tracking-wider">
                  {post.published_at && (
                    <span className="text-gray-400" suppressHydrationWarning>
                      {format(new Date(post.published_at), 'MMM d, yyyy')}
                    </span>
                  )}
                </div>
                <h4 className="font-serif text-slate-900 dark:text-white text-lg font-bold leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h4>
              </div>
            </Link>
          </RevealWrapper>
        ))}
      </div>
    </div>
  );
}

import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import Image from 'next/image';

export async function PopularPosts(): Promise<JSX.Element | null> {
  const supabase = await createClient();
  
  const { data: popular } = await supabase
    .from('posts')
    .select('id, title, slug, excerpt, featured_image_url, view_count, category:categories(name)')
    .eq('status', 'published')
    .order('view_count', { ascending: false })
    .limit(3);

  if (!popular || popular.length === 0) return null;

  return (
    <div className="bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-white/5 rounded-[2rem] p-6 shadow-sm mt-8 transition-all duration-500 hover:shadow-lg">
      <h3 className="text-2xl font-serif text-slate-900 dark:text-white mb-6">Popular Articles</h3>
      <div className="flex flex-col gap-6">
        {popular.map((post) => (
          <Link href={`/blog/${post.slug}`} key={post.id} className="group flex gap-4 items-center">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden relative shrink-0">
              {post.featured_image_url ? (
                <Image 
                  src={post.featured_image_url} 
                  alt={post.title} 
                  fill 
                  className="object-cover group-hover:scale-110 transition-transform duration-500" 
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900"></div>
              )}
            </div>
            <div className="flex-1">
              {post.category && (
                <span className="text-[10px] uppercase tracking-wider font-bold text-primary block mb-1">
                  {Array.isArray(post.category) ? post.category[0]?.name : (post.category as any)?.name}
                </span>
              )}
              <h4 className="font-serif font-bold text-slate-900 dark:text-white text-base leading-tight group-hover:text-primary transition-colors line-clamp-2">
                {post.title}
              </h4>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

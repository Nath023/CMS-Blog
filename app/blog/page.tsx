import { getPosts, getCategories, getSettings } from '@/lib/blog/queries';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { BlogCTA } from '@/components/blog/BlogCTA';
import PopularPostsWrapper from '@/components/blog/PopularPostsWrapper';
import { NewsletterForm } from '@/components/blog/NewsletterForm';
import { SearchInput } from '@/components/blog/SearchInput';
import { Pagination } from '@/components/blog/Pagination';
import { Suspense } from 'react';
import { FeaturedPost } from '@/components/blog/FeaturedPost';
import { RevealWrapper } from '@/components/RevealWrapper';
import { HeroNewsletterForm } from '@/components/blog/HeroNewsletterForm';
import { siteConfig } from '@/config/site';

export default async function BlogHomepage(props: { searchParams: { page?: string } }) {
  const searchParams = props.searchParams;
  const page = Number(searchParams.page) || 1;
  const { data: posts, count } = await getPosts(page, { status: 'published' });
  const categories = await getCategories();
  const settings = await getSettings();
  const defaultAuthor = settings?.default_author || siteConfig.authorBio.name;

  const featuredPost = page === 1 && posts.length > 0 ? posts[0] : null;
  const latestPosts = page === 1 ? posts.slice(1) : posts;

  return (
    <main className="flex-1 w-full bg-[#FAFAFA] dark:bg-[#050505]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20 lg:pt-10 lg:pb-28">
        
        {/* Hero Section */}
        <RevealWrapper className="mb-20 md:mb-28 lg:mb-32 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-xs tracking-wider uppercase w-max mb-6">
              Our Newsletter
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-[4.5rem] font-serif text-slate-900 dark:text-white mb-6 leading-[1.05] tracking-tight">
              Scale Your Brand <br className="hidden sm:block" /> with Digital Insights
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl font-sans">
              Actionable strategies, expert tutorials, and proven frameworks on web design, SEO, and digital growth delivered straight to your inbox.
            </p>
            <HeroNewsletterForm />
          </div>
          <div className="lg:col-span-5 hidden lg:block relative">
            <div className="w-full aspect-[4/5] bg-gradient-to-tr from-slate-100 to-slate-200 dark:from-slate-800/50 dark:to-slate-900/50 rounded-[3rem] overflow-hidden relative shadow-2xl border border-white/20 dark:border-white/5">
              <div className="absolute inset-0 flex flex-col justify-between p-8 z-10">
                <div className="flex justify-between items-center opacity-40">
                  <div className="w-16 h-2 rounded-full bg-slate-400"></div>
                  <div className="w-8 h-2 rounded-full bg-slate-400"></div>
                </div>
                
                <div className="space-y-6">
                  <div className="w-full bg-white/80 dark:bg-black/50 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/50 dark:border-white/10 transform -rotate-2 hover:rotate-0 transition-transform duration-500">
                    <div className="flex gap-4 items-center mb-4">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">AL</div>
                      <div>
                        <div className="font-bold text-sm text-slate-900 dark:text-white">New Strategy Guide</div>
                        <div className="text-xs text-slate-500">Just sent to your inbox</div>
                      </div>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 mb-2"></div>
                    <div className="w-3/4 h-2 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                  </div>
                  
                  <div className="w-full bg-white/80 dark:bg-black/50 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/50 dark:border-white/10 transform rotate-1 hover:rotate-0 transition-transform duration-500 translate-x-4">
                    <div className="flex gap-4 items-center mb-4">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-600 font-bold">SEO</div>
                      <div>
                        <div className="font-bold text-sm text-slate-900 dark:text-white">Local SEO Checklist</div>
                        <div className="text-xs text-slate-500">Attachment included</div>
                      </div>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 mb-2"></div>
                    <div className="w-5/6 h-2 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                  </div>

                  <div className="w-full bg-white/80 dark:bg-black/50 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/50 dark:border-white/10 transform -rotate-1 hover:rotate-0 transition-transform duration-500 -translate-x-2">
                    <div className="flex gap-4 items-center mb-4">
                      <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-600 font-bold">CRO</div>
                      <div>
                        <div className="font-bold text-sm text-slate-900 dark:text-white">Conversion Tips</div>
                        <div className="text-xs text-slate-500">Read in 3 mins</div>
                      </div>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 mb-2"></div>
                    <div className="w-4/5 h-2 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                  </div>
                </div>
              </div>
              
              {/* Decorative background elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"></div>
            </div>
          </div>
        </RevealWrapper>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Main Content Area */}
          <div className="lg:col-span-8 flex flex-col gap-12 lg:gap-16">
            
            {/* Featured Post (Only on Page 1) */}
            {featuredPost && (
              <RevealWrapper delay={0.1}>
                <FeaturedPost post={featuredPost} defaultAuthor={defaultAuthor} />
              </RevealWrapper>
            )}

            {/* Latest Posts Grid */}
            <div>
              <RevealWrapper delay={0.2} className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-serif text-slate-900 dark:text-white">Latest Articles</h2>
              </RevealWrapper>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-10">
                {latestPosts.map((post, index) => (
                  <RevealWrapper key={post.id} delay={0.1 * (index % 2 + 1)}>
                    <Link href={`/blog/${post.slug}`} className="group flex flex-col h-full bg-white dark:bg-[#0a0a0a] rounded-3xl border border-gray-100 dark:border-white/5 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:border-primary/30">
                      <div className="w-full aspect-[4/3] bg-slate-100 dark:bg-slate-800 overflow-hidden relative">
                        {post.featured_image_url ? (
                          <Image src={post.featured_image_url} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900"></div>
                        )}
                      </div>
                      <div className="flex flex-col flex-1 p-6 sm:p-8">
                        <div className="flex items-center gap-3 mb-4 text-xs font-bold uppercase tracking-wider">
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
                          <span className="text-gray-500 font-medium">{post.author_name || defaultAuthor}</span>
                        </div>
                        <h3 className="font-serif text-slate-900 dark:text-white text-2xl leading-tight mb-3 group-hover:text-primary transition-colors line-clamp-3">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed text-sm md:text-base font-sans">
                          {post.excerpt}
                        </p>
                      </div>
                    </Link>
                  </RevealWrapper>
                ))}
              </div>
            </div>

            <RevealWrapper delay={0.3} className="pt-8 border-t border-gray-200 dark:border-white/10">
              <Suspense fallback={<div className="h-10" />}><Pagination currentPage={page} totalItems={count} /></Suspense>
            </RevealWrapper>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4">
            <div className="sticky top-28 flex flex-col gap-10">
              
              <RevealWrapper delay={0.2} className="bg-white dark:bg-[#0a0a0a] p-1.5 rounded-3xl shadow-sm border border-gray-100 dark:border-white/5 transition-all duration-500 hover:shadow-md hover:border-primary/30">
                <SearchInput />
              </RevealWrapper>

              <RevealWrapper delay={0.3}>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-5">Explore Topics</h4>
                <div className="flex flex-wrap gap-2.5">
                  {categories.map(cat => (
                    <Link 
                      key={cat.id} 
                      href={`/blog/category/${cat.slug}`}
                      className="bg-white dark:bg-[#0a0a0a] text-gray-600 dark:text-gray-400 px-5 py-2.5 rounded-full text-sm font-bold tracking-wider uppercase border border-gray-100 dark:border-white/5 hover:border-primary hover:text-primary transition-all duration-300 shadow-sm hover:shadow-md"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </RevealWrapper>
              
              <div className="mt-4 flex flex-col gap-8">
                <RevealWrapper delay={0.4}>
                  <NewsletterForm source="sidebar" title="Get Updates" description="Subscribe for the latest articles." />
                </RevealWrapper>
                <RevealWrapper delay={0.5}>
                  <Suspense fallback={<div className="h-40 bg-gray-100 dark:bg-gray-800 rounded-3xl animate-pulse"></div>}>
                    <PopularPostsWrapper />
                  </Suspense>
                </RevealWrapper>
                <RevealWrapper delay={0.6}>
                  <BlogCTA className="" />
                </RevealWrapper>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

export const revalidate = 60;

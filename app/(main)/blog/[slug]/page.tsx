import { getPosts, getRelatedPostsByTags, hasAccessToPremium } from '@/lib/database';
import { Paywall } from '@/components/blog/Paywall';
import { SaveArticleButton } from '@/components/blog/SaveArticleButton';
import { TTSPlayer } from '@/components/blog/TTSPlayer';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { getPostBySlug, getSettings } from '@/lib/fetch';
import NotFound from '@/app/not-found';
import Image from 'next/image';
import { format } from 'date-fns';
import { BlogCTA } from '@/components/blog/BlogCTA';
import Link from 'next/link';
import { Metadata } from 'next';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import { ShareButtons } from '@/components/blog/ShareButtons';
import { NewsletterForm } from '@/components/blog/NewsletterForm';
import { ViewTracker } from '@/components/blog/ViewTracker';
import { ReadingProgressBar } from '@/components/blog/ReadingProgressBar';
import { LeadMagnetForm } from '@/components/blog/LeadMagnetForm';
import { AuthorBio } from '@/components/blog/AuthorBio';
import { PostFeedback } from '@/components/blog/PostFeedback';
import { CloseButton } from '@/components/blog/CloseButton';
import { RelatedPosts } from '@/components/blog/RelatedPosts';

import { siteConfig } from '@/config/site';
import { featuresConfig } from '@/config/features';
import dynamic from 'next/dynamic';

const TableOfContents = dynamic(() => import('@/components/blog/TableOfContents').then(mod => mod.TableOfContents));
const Comments = dynamic(() => import('@/components/blog/Comments').then(mod => mod.Comments));

export async function generateStaticParams() {
  const { data: posts } = await getPosts(1, { status: 'published' });
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata(props: { params: { slug: string } }): Promise<Metadata> {
  const params = props.params;
  const [post, settings] = await Promise.all([getPostBySlug(params.slug), getSettings()]);
  if (!post || post.status !== 'published') return {};
  const title = post.meta_title || post.title;
  const description = post.meta_description || post.excerpt || '';
  const url = `${siteConfig.url}/blog/${post.slug}`;
  const imageUrl = post.og_image_url || post.featured_image_url || `${siteConfig.url}/dummy.jpg`;
  return {
    title, description, alternates: { canonical: post.canonical_url || url },
    openGraph: { title, description, url, type: 'article', publishedTime: post.published_at || post.created_at, authors: [post.author_name || settings.default_author || siteConfig.authorBio.name], images: [{ url: imageUrl }] },
    twitter: { card: 'summary_large_image', title, description, images: [imageUrl] },
  };
}

export default async function BlogPostPage(props: { params: { slug: string } }) {
  const params = props.params;
  const [post, settings] = await Promise.all([getPostBySlug(params.slug), getSettings()]);
  const supabase = await createServerClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!post || post.status !== 'published') { return <NotFound />; }
  
  const isPremium = post.is_premium;
  const hasAccess = isPremium ? await hasAccessToPremium() : true;

  let relatedPosts: any[] = [];
  if (post.tags && post.tags.length > 0) {
    const tagIds = post.tags.map((t: any) => t.id);
    relatedPosts = await getRelatedPostsByTags(post.id, tagIds, 3);
  }
  // Fallback to category if no related posts found by tags
  if (relatedPosts.length === 0 && post.category_id) {
    const { data: catPosts } = await getPosts(1, { status: 'published', categoryId: post.category_id });
    relatedPosts = (catPosts as any[]).filter(p => p.id !== post.id).slice(0, 3);
  }

  const jsonLd = post.schema_markup || {
    '@context': 'https://schema.org', '@type': 'Article', headline: post.title,
    image: post.featured_image_url ? [post.featured_image_url] : [],
    datePublished: post.published_at || post.created_at, dateModified: post.updated_at,
    author: [{ '@type': 'Organization', name: post.author_name || settings.default_author || siteConfig.authorBio.name }]
  };

  return (
    <main className="flex-1 w-full bg-slate-50 dark:bg-slate-950/50 min-h-screen relative">
      {featuresConfig.enableReadingTime && <ReadingProgressBar />}
      <CloseButton />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-12 lg:pt-48 lg:pb-20">
        <article className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 lg:p-16 shadow-sm overflow-hidden mb-16">
          <header className="mb-12 text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-[1.1] mb-8">{post.title}</h1>
            {post.featured_image_url && (
              <div className="relative w-full aspect-[21/9] mt-8 mb-12 rounded-3xl overflow-hidden shadow-2xl bg-slate-100 dark:bg-slate-800">
                <Image 
                  src={post.featured_image_url} 
                  alt={post.title} 
                  fill 
                  priority={true} 
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 1024px"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}
            <div className="text-left mt-8 mb-4 max-w-3xl mx-auto">
              <TTSPlayer title={post.title} content={post.content || ''} language={post.language || 'en'} />
            </div>
            <div className="text-lg font-medium text-slate-600 dark:text-slate-400 mb-6 flex items-center justify-center gap-3">
              <span>By {post.author_name || settings.default_author || siteConfig.authorBio.name}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700"></span>
              <span>{Math.max(1, Math.ceil((post.content || '').split(/\s+/).length / 200))} min read</span>
            </div>
            <div className="flex justify-center mt-6 items-center gap-4">
              <ShareButtons 
                url={`${siteConfig.url || 'https://example.com'}/blog/${post.slug}`} 
                title={post.title} 
              />
              <div className="h-4 w-px bg-slate-200 dark:bg-slate-700"></div>
              <SaveArticleButton postId={post.id} userId={session?.user?.id} />
              {featuresConfig.enableViewCounter && (
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  {post.view_count && post.view_count > 50 ? `${post.view_count} views` : ''}
                </span>
              )}
            </div>
          </header>
          {featuresConfig.enableViewCounter && <ViewTracker postId={post.id} />}
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 max-w-6xl mx-auto relative">
            <div className="flex-1 max-w-3xl w-full">
                            <div className="prose prose-slate dark:prose-invert prose-lg max-w-none relative">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]} 
                  rehypePlugins={[rehypeSlug]}
                  components={{
                    img: (props) => (
                      <span className="block relative w-full aspect-video my-8 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                        <Image
                          src={props.src || ''}
                          alt={props.alt || ''}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 768px"
                        />
                      </span>
                    ),
                  }}
                >
                  {hasAccess ? (post.content || '') : ((post.content || '').substring(0, 300) + '...')}
                </ReactMarkdown>
                
                {!hasAccess && (
                  <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-white dark:from-slate-900 to-transparent flex flex-col justify-end pb-8">
                    <Paywall />
                  </div>
                )}
              </div>
              
              {featuresConfig.enableLeadMagnets && post.lead_magnet && (
                <LeadMagnetForm magnet={post.lead_magnet} postId={post.id} />
              )}

              {featuresConfig.enableAuthorBio && (
                <AuthorBio 
                  name={post.author_name || settings.default_author || siteConfig.authorBio.name} 
                  bio={siteConfig.authorBio.bio} 
                  socialLink={siteConfig.authorBio.socialLink}
                  imageUrl={siteConfig.authorBio.imageUrl}
                />
              )}

              <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
                <ShareButtons 
                  url={`${siteConfig.url || 'https://example.com'}/blog/${post.slug}`} 
                  title={post.title} 
                />
              </div>
              {featuresConfig.enableNewsletter && (
                <div className="mt-16">
                  <NewsletterForm source="article_footer" postId={post.id} />
                </div>
              )}
              
              <PostFeedback postId={post.id} />

              {featuresConfig.enableRelatedPosts && relatedPosts.length > 0 && (
                <RelatedPosts posts={relatedPosts} />
              )}

              {featuresConfig.enableComments && <Comments postId={post.id} />}
            </div>

            <aside className="w-full lg:w-72 shrink-0">
              <div className="sticky top-28 hidden lg:block">
                <TableOfContents content={post.content || ''} />
              </div>
            </aside>
          </div>
        </article>
      </div>
    </main>
  );
}
export const revalidate = 60;

import { getPosts } from '@/lib/database';
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
    title, description, alternates: { canonical: url },
    openGraph: { title, description, url, type: 'article', publishedTime: post.published_at || post.created_at, authors: [post.author_name || settings.default_author || siteConfig.authorBio.name], images: [{ url: imageUrl }] },
    twitter: { card: 'summary_large_image', title, description, images: [imageUrl] },
  };
}

export default async function BlogPostPage(props: { params: { slug: string } }) {
  const params = props.params;
  const [post, settings] = await Promise.all([getPostBySlug(params.slug), getSettings()]);
  if (!post || post.status !== 'published') { return <NotFound />; }

  let relatedPosts: any[] = [];
  if (post.category_id) {
    const { data: catPosts } = await getPosts(1, { status: 'published', categoryId: post.category_id });
    relatedPosts = (catPosts as any[]).filter(p => p.id !== post.id).slice(0, 3);
  }

  const jsonLd = {
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 lg:pt-32 lg:pb-20">
        <article className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 lg:p-16 shadow-sm overflow-hidden mb-16">
          <header className="mb-12 text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-[1.1] mb-8">{post.title}</h1>
            <div className="text-lg font-medium text-slate-600 dark:text-slate-400 mb-6">By {post.author_name || settings.default_author || siteConfig.authorBio.name}</div>
            <div className="flex justify-center mt-6 items-center gap-4">
              <ShareButtons 
                url={`${siteConfig.url || 'https://example.com'}/blog/${post.slug}`} 
                title={post.title} 
              />
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
              <div className="prose prose-slate dark:prose-invert prose-lg max-w-none">
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
                  {post.content || ''}
                </ReactMarkdown>
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

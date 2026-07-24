'use client';
import { useState, useRef, useEffect } from 'react';
import { createPost, updatePost, deletePost } from '@/lib/database';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { SEOAssistant } from '@/components/admin/SEOAssistant';
import { useRouter } from 'next/navigation';
import { Save } from 'lucide-react';
import dynamic from 'next/dynamic';

const MarkdownEditor = dynamic(
  () => import('@/components/admin/MarkdownEditor').then(mod => mod.MarkdownEditor),
  { ssr: false, loading: () => <div className="h-96 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse" /> }
);

type Category = { id: string, name: string };
type Post = any;

export function PostForm({ post, categories, initialTags = '' }: { post?: Post, categories: Category[], initialTags?: string }) {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(post?.featured_image_url || '');
  const [showDelete, setShowDelete] = useState(false);
  
  const formRef = useRef<HTMLFormElement>(null);
  
  const DRAFT_KEY = `post-draft-${post?.id || 'new'}`;
  const [hasDraft, setHasDraft] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const [seoData, setSeoData] = useState({
    title: post?.title || '',
    excerpt: post?.excerpt || '',
    content: post?.content || '',
    metaTitle: post?.meta_title || '',
    metaDescription: post?.meta_description || '',
    slug: post?.slug || '',
  });

  const updateSeoData = () => {
    if (!formRef.current) return;
    const formData = new FormData(formRef.current);
    setSeoData({
      title: formData.get('title') as string || '',
      excerpt: formData.get('excerpt') as string || '',
      content: formData.get('content') as string || '',
      metaTitle: formData.get('meta_title') as string || '',
      metaDescription: formData.get('meta_description') as string || '',
      slug: formData.get('slug') as string || '',
    });
  };

  // Ensure SEO updates when imageUrl changes
  useEffect(() => {
    updateSeoData();
  }, [imageUrl]);

  // Auto-save draft
  useEffect(() => {
    const draftStr = localStorage.getItem(DRAFT_KEY);
    if (draftStr) {
      try {
        const data = JSON.parse(draftStr);
        // Only show draft prompt if it's different from current (or it exists)
        if (data && Object.keys(data).length > 0) {
          setHasDraft(true);
        }
      } catch (e) {}
    }

    const interval = setInterval(() => {
      if (!formRef.current) return;
      const formData = new FormData(formRef.current);
      const data = Object.fromEntries(formData.entries());
      data._imageUrl = imageUrl;
      
      // Only save if there's actual content
      if (data.title || data.content) {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
        setLastSaved(new Date());
      }
    }, 5000); // Auto-save every 5 seconds

    return () => clearInterval(interval);
  }, [DRAFT_KEY, imageUrl]);
  
  const router = useRouter();

  const setNativeValue = (element: any, value: string) => {
    const valueSetter = Object.getOwnPropertyDescriptor(element, 'value')?.set;
    const prototype = Object.getPrototypeOf(element);
    const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, 'value')?.set;
    
    if (valueSetter && valueSetter !== prototypeValueSetter) {
      prototypeValueSetter?.call(element, value);
    } else {
      valueSetter?.call(element, value);
    }
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
  };

  const restoreDraft = () => {
    const draftStr = localStorage.getItem(DRAFT_KEY);
    if (draftStr && formRef.current) {
      try {
        const data = JSON.parse(draftStr);
        Object.keys(data).forEach(key => {
          if (key === '_imageUrl') {
            setImageUrl(data[key]);
            return;
          }
          const input = formRef.current?.elements.namedItem(key) as HTMLElement;
          if (input) {
             if (input instanceof RadioNodeList) {
               input.value = data[key];
             } else {
               setNativeValue(input, data[key]);
             }
          }
        });
        updateSeoData();
        setHasDraft(false);
      } catch (e) {
        console.error('Failed to restore draft', e);
      }
    }
  };

  const discardDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    setHasDraft(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const formData = new FormData(e.currentTarget);
      formData.set('featured_image_url', imageUrl);
      
      let result;
      if (post) {
        result = await updatePost(post.id, formData);
      } else {
        result = await createPost(formData);
      }

      if (result?.error) {
        setError(result.error);
        setLoading(false);
      } else {
        localStorage.removeItem(DRAFT_KEY);
        setHasDraft(false);
        router.push('/admin/posts');
        router.refresh();
      }
    } catch (err: any) {
      if (err.message === 'NEXT_REDIRECT') throw err;
      console.error(err);
      setError(err.message || 'An unexpected error occurred.');
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!post) return;
    setLoading(true);
    try {
      const result = await deletePost(post.id);
      if (result?.error) {
        setError(result.error);
        setLoading(false);
        setShowDelete(false);
      } else {
        router.push('/admin/posts');
        router.refresh();
      }
    } catch (err: any) {
      if (err.message === 'NEXT_REDIRECT') throw err;
      console.error(err);
      setError(err.message || 'An unexpected error occurred.');
      setLoading(false);
      setShowDelete(false);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      <div className="xl:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm p-6 md:p-8">
        {hasDraft && (
          <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 p-4 rounded-xl mb-6 border border-blue-200 dark:border-blue-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Save className="w-5 h-5 shrink-0" />
              <div>
                <p className="font-semibold text-sm">Unsaved draft found</p>
                <p className="text-xs opacity-80 mt-0.5">Do you want to restore your last unsaved changes?</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button type="button" size="sm" variant="outline" onClick={discardDraft}>
                Discard
              </Button>
              <Button type="button" size="sm" onClick={restoreDraft}>
                Restore Draft
              </Button>
            </div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 border border-red-100 font-medium">
            {error}
          </div>
        )}
        
        <form ref={formRef} onSubmit={handleSubmit} onChange={updateSeoData} onKeyUp={updateSeoData} className="flex flex-col gap-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="flex flex-col gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Title</label>
                <Input name="title" defaultValue={post?.title} required placeholder="Post Title" />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Slug</label>
                <Input name="slug" defaultValue={post?.slug} placeholder="auto-generated-if-empty" />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Leave empty to auto-generate from title</p>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Excerpt</label>
                <Textarea name="excerpt" defaultValue={post?.excerpt} className="h-24" placeholder="Brief summary for cards and SEO..." />
              </div>
            </div>
            
            <div className="flex flex-col gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Status</label>
                <Select name="status" defaultValue={post?.status || 'draft'} onChange={(e) => {
                  const form = e.target.form;
                  if (form) {
                    const scheduledContainer = form.querySelector('.scheduled-container');
                    if (scheduledContainer) {
                      if (e.target.value === 'draft') {
                        scheduledContainer.classList.remove('hidden');
                      } else {
                        scheduledContainer.classList.add('hidden');
                      }
                    }
                  }
                  updateSeoData();
                }}>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Author Name</label>
                <Input name="author_name" defaultValue={post?.author_name || ''} placeholder="e.g. John Doe" />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Leave empty to use the default author in global settings.</p>
              </div>
              
              <div className={`scheduled-container ${(!post || post.status === 'draft') ? '' : 'hidden'}`}>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Scheduled At (Optional)</label>
                <Input type="datetime-local" name="scheduled_at" defaultValue={post?.published_at ? new Date(post.published_at).toISOString().slice(0, 16) : ''} />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">If set, the post will be published automatically via Cron.</p>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Category</label>
                <Select name="category_id" defaultValue={post?.category_id || ''}>
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Tags</label>
                <Input name="tags" defaultValue={initialTags} placeholder="seo, web design, marketing" />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Comma separated</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Featured Image</label>
                <ImageUpload value={imageUrl} onChange={setImageUrl} />
              </div>

              <div className="pt-4 border-t border-slate-100">
                <h4 className="font-bold text-slate-800 mb-4">SEO Settings</h4>
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Meta Title</label>
                    <Input name="meta_title" defaultValue={post?.meta_title} placeholder="Overrides post title" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Meta Description</label>
                    <Textarea name="meta_description" defaultValue={post?.meta_description} className="h-20" placeholder="Overrides excerpt" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Content (Markdown)</label>
            <div onKeyUp={updateSeoData} onBlur={updateSeoData}>
              <MarkdownEditor name="content" defaultValue={post?.content} />
            </div>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-slate-800">
            <div>
              {post && (
                <>
                  {!showDelete ? (
                    <Button type="button" variant="danger" onClick={() => setShowDelete(true)}>
                      Delete Post
                    </Button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-red-600">Are you sure?</span>
                      <Button type="button" variant="danger" size="sm" onClick={handleDelete} disabled={loading}>
                        Yes, Delete
                      </Button>
                      <Button type="button" variant="outline" size="sm" onClick={() => setShowDelete(false)}>
                        Cancel
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="flex items-center gap-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : post ? 'Update Post' : 'Create Post'}
              </Button>
            </div>
          </div>
          
          {lastSaved && (
            <div className="text-xs text-slate-500 dark:text-slate-400 text-right mt-2 flex justify-end items-center gap-1.5">
              <Save className="w-3 h-3" />
              Draft saved locally at {lastSaved.toLocaleTimeString()}
            </div>
          )}
        </form>
      </div>
      
      <div className="xl:col-span-1">
        <div className="sticky top-24">
          <SEOAssistant 
            title={seoData.title}
            excerpt={seoData.excerpt}
            content={seoData.content}
            metaTitle={seoData.metaTitle}
            metaDescription={seoData.metaDescription}
            slug={seoData.slug}
            imageUrl={imageUrl}
          />
        </div>
      </div>
    </div>
  );
}

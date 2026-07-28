"use server";

import { cache } from "react";
import { notFound } from "next/navigation";
import { revalidatePath, revalidateTag } from "next/cache";
import { createClient } from "@supabase/supabase-js";

import { createClient as createServerClient, createAdminClient } from '@/lib/supabase/server';
import { POST_STATUS, LIMITS, BUCKETS, SUBSCRIBER_STATUS } from '@/constants';
import { env } from '@/config/env';
import { subMonths, format } from 'date-fns';

const isConfigured = !!env.NEXT_PUBLIC_SUPABASE_URL && 
  env.NEXT_PUBLIC_SUPABASE_URL !== 'YOUR_SUPABASE_URL' && 
  !env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project-ref') &&
  !env.NEXT_PUBLIC_SUPABASE_URL.includes('127.0.0.1');



async function sendBlogPostEmail(email: any, subject: string, link: string, ...args: any[]) {}
async function sendLeadMagnetEmail(email: string, subject: string, link: string, name?: string | null) {}
async function sendWelcomeEmail(email: string, name?: string | null) {}

export async function signOut() {
  if (!isConfigured) return { error: { message: 'Supabase is not configured. Please connect to Supabase.' } as any };
  const supabase = createServerClient();
  await supabase.auth.signOut();
}

export async function getAdminDashboardStats() {
  if (!isConfigured) {
    return {
      totalPosts: 0, publishedPosts: 0, draftPosts: 0, archivedPosts: 0, totalViews: 0,
      recentPosts: [], popularPosts: [], statusData: [], monthlyData: []
    };
  }
  const supabase = createServerClient();
  let totalPosts = 0, publishedPosts = 0, draftPosts = 0, archivedPosts = 0, totalViews = 0;
  let recentPosts: any[] = [];
  let popularPosts: any[] = [];
  
  const statusData = [
    { name: 'Published', value: 0, color: '#10b981' },
    { name: 'Drafts', value: 0, color: '#f59e0b' },
    { name: 'Archived', value: 0, color: '#64748b' },
  ];
  let monthlyData: any[] = [];

  try {
    const { count: tP } = await supabase.from('posts').select('*', { count: 'exact', head: true });
    totalPosts = tP || 0;

    const { count: pP } = await supabase.from('posts').select('*', { count: 'exact', head: true }).eq('status', POST_STATUS.PUBLISHED);
    publishedPosts = pP || 0;

    const { count: dP } = await supabase.from('posts').select('*', { count: 'exact', head: true }).eq('status', POST_STATUS.DRAFT);
    draftPosts = dP || 0;

    const { count: aP } = await supabase.from('posts').select('*', { count: 'exact', head: true }).eq('status', POST_STATUS.ARCHIVED);
    archivedPosts = aP || 0;

    statusData[0].value = publishedPosts;
    statusData[1].value = draftPosts;
    statusData[2].value = archivedPosts;

    const { data: viewsData } = await supabase.from('posts').select('view_count');
    if (viewsData) {
      totalViews = viewsData.reduce((acc, curr) => acc + (curr.view_count || 0), 0);
    }

    const { data: rP } = await supabase
      .from('posts')
      .select('id, title, status, created_at')
      .order('created_at', { ascending: false })
      .limit(LIMITS.DASHBOARD_RECENT_POSTS);
    recentPosts = rP || [];

    const { data: popP } = await supabase
      .from('posts')
      .select('id, title, status, view_count')
      .order('view_count', { ascending: false })
      .limit(LIMITS.DASHBOARD_RECENT_POSTS);
    popularPosts = popP || [];

    const sixMonthsAgo = subMonths(new Date(), 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const { data: allPosts } = await supabase
      .from('posts')
      .select('created_at')
      .gte('created_at', sixMonthsAgo.toISOString());
      
    if (allPosts) {
      const months = Array.from({ length: 6 }).map((_, i) => {
        const d = subMonths(new Date(), 5 - i);
        return {
          month: format(d, 'MMM yyyy'),
          posts: 0
        };
      });

      allPosts.forEach(post => {
        const postMonth = format(new Date(post.created_at), 'MMM yyyy');
        const monthIndex = months.findIndex(m => m.month === postMonth);
        if (monthIndex !== -1) {
          months[monthIndex].posts += 1;
        }
      });
      monthlyData = months;
    }
  } catch(e) {}
  
  return {
    statusData,
    monthlyData,
    totalPosts,
    publishedPosts,
    draftPosts,
    archivedPosts,
    totalViews,
    recentPosts,
    popularPosts
  };
}

export async function getLeadMagnetById(id: string) {
  if (!isConfigured) return null;
  const supabase = createServerClient();
  const { data } = await supabase.from('lead_magnets').select('*').eq('id', id).single();
  return data;
}

export async function getLeadMagnetsAdmin() {
  if (!isConfigured) return [];
  const supabase = createAdminClient();
  const { data } = await supabase.from('lead_magnets').select('*').order('created_at', { ascending: false });
  return data || [];
}

export async function getLeadMagnetBySlug(slug: string) {
  if (!isConfigured) return null;
  const supabase = createAdminClient();

  const { data } = await supabase.from('lead_magnets').select('*').eq('slug', slug).eq('is_active', true).single();
  return data;
}

export async function getLeadMagnetsForGuides() {
  if (!isConfigured) return [];
  const supabase = createServerClient();
  const { data } = await supabase.from('lead_magnets').select('*').eq('is_active', true).order('created_at', { ascending: false });
  return data || [];
}

export async function getTagById(id: string) {
  if (!isConfigured) return null;
  const supabase = createServerClient();
  const { data } = await supabase.from('tags').select('*').eq('id', id).single();
  return data;
}

export async function getTagsAdmin() {
  if (!isConfigured) return [];
  const supabase = createAdminClient();

  const { data } = await supabase.from('tags').select('*').order('name');
  return data || [];
}

export async function getCategoryById(id: string) {
  if (!isConfigured) return null;
  const supabase = createServerClient();
  const { data } = await supabase.from('categories').select('*').eq('id', id).single();
  return data;
}

export async function getCategoriesAdmin() {
  if (!isConfigured) return [];
  const supabase = createAdminClient();

  const { data } = await supabase.from('categories').select('*').order('name');
  return data || [];
}

export async function getMediaFilesClient() {
  if (!isConfigured) return [];
  const supabase = createServerClient();
  const { data, error } = await supabase.storage.from(BUCKETS.BLOG_IMAGES).list();
  if (error || !data) return [];
  
  return data.filter(f => f.name !== '.emptyFolderPlaceholder').map((f) => {
    const { data: { publicUrl } } = supabase.storage.from(BUCKETS.BLOG_IMAGES).getPublicUrl(f.name);
    return { name: f.name, url: publicUrl };
  });
}

export async function getMediaFilesAdmin() {
  if (!isConfigured) return [];
  const supabase = createAdminClient();

  const { data, error } = await supabase.storage.from(BUCKETS.BLOG_IMAGES).list();
  if (error || !data) return [];
  
  return data.filter(f => f.name !== '.emptyFolderPlaceholder').map((f) => {
    const { data: { publicUrl } } = supabase.storage.from(BUCKETS.BLOG_IMAGES).getPublicUrl(f.name);
    return { name: f.name, url: publicUrl, created_at: f.created_at };
  });
}

export async function getPostForEdit(id: string) {
  if (!isConfigured) return null;
  const supabase = createServerClient();
  const { data: p } = await supabase.from('posts').select('*').eq('id', id).single();
  if (!p) return null;
  const { data: tagsData } = await supabase.from('post_tags').select('tag:tags(name)').eq('post_id', p.id);
  const tags = (tagsData as any[])?.map((t: any) => t.tag.name).join(', ') || '';
  return { post: p, tags };
}

export async function getAdminPosts(status?: string) {
  if (!isConfigured) return [];
  const supabase = createAdminClient();

  let query = supabase
    .from('posts')
    .select(`
      id, title, slug, status, created_at, published_at,
      category:categories(name),
      author_name
    `)
    .order('created_at', { ascending: false });

  if (status && [POST_STATUS.PUBLISHED, POST_STATUS.DRAFT, POST_STATUS.ARCHIVED].includes(status as any)) {
    query = query.eq('status', status);
  }

  const { data } = await query;
  return data || [];
}

export async function getScheduledPosts() {
  if (!isConfigured) return [];
  const supabase = createAdminClient();

  const now = new Date().toISOString();
  const { data } = await supabase
    .from('posts')
    .select(`
      id, title, slug, status, created_at, published_at,
      category:categories(name)
    `)
    .eq('status', POST_STATUS.DRAFT)
    .gt('published_at', now)
    .order('published_at', { ascending: true });
  return data || [];
}

export async function getPopularPosts() {
  if (!isConfigured) return [];
  const supabase = createServerClient();
  const { data } = await supabase
    .from('posts')
    .select('id, title, slug, excerpt, featured_image_url, view_count, category:categories(name)')
    .eq('status', POST_STATUS.PUBLISHED)
    .order('view_count', { ascending: false })
    .limit(LIMITS.SIDEBAR_POPULAR_POSTS);
  return data || [];
}

export async function getSubscribersAdmin() {
  if (!isConfigured) return [];
  const supabase = createAdminClient();

  const { data } = await supabase
    .from('subscribers')
    .select('*')
    .order('created_at', { ascending: false });
  return data || [];
}

export async function recordPostView(postId: string, sessionId: string, userAgent: string) {
  if (!isConfigured) return;
  const supabase = createServerClient();
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
  
  const { data: recentView } = await supabase
    .from('post_views')
    .select('id')
    .eq('post_id', postId)
    .eq('session_id', sessionId)
    .gte('viewed_at', fiveMinutesAgo)
    .maybeSingle();

  if (!recentView) {
    await supabase.from('post_views').insert({
      post_id: postId,
      session_id: sessionId,
      device_type: userAgent.substring(0, 255)
    });
    
    const { data: post } = await supabase.from('posts').select('view_count').eq('id', postId).single();
    if (post) {
      await supabase.from('posts').update({ view_count: (post.view_count || 0) + 1 }).eq('id', postId);
    }
  }
}

export async function uploadMediaFile(file: File) {
  if (!isConfigured) return { error: { message: 'Supabase is not configured. Please connect to Supabase.' } as any };
  const supabase = createAdminClient();

  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  
  // Ensure bucket exists
  await supabase.storage.createBucket(BUCKETS.BLOG_IMAGES, { public: true });

  const { data, error } = await supabase.storage
    .from(BUCKETS.BLOG_IMAGES)
    .upload(fileName, file);

  if (error) {
    throw new Error(error.message);
  }

  const { data: { publicUrl } } = supabase.storage
    .from(BUCKETS.BLOG_IMAGES)
    .getPublicUrl(fileName);

  return publicUrl;
}

export async function createTagAdmin(payload: any) {
  if (!isConfigured) return { error: { message: 'Supabase is not configured. Please connect to Supabase.' } as any };
  const supabase = createAdminClient();
  return await supabase.from('tags').insert(payload);
}
export async function updateTagAdmin(id: string, payload: any) {
  if (!isConfigured) return { error: { message: 'Supabase is not configured. Please connect to Supabase.' } as any };
  const supabase = createAdminClient();
  return await supabase.from('tags').update(payload).eq('id', id);
}
export async function deleteTagAdmin(id: string) {
  if (!isConfigured) return { error: { message: 'Supabase is not configured. Please connect to Supabase.' } as any };
  const supabase = createAdminClient();
  return await supabase.from('tags').delete().eq('id', id);
}
export async function createCategoryAdmin(payload: any) {
  if (!isConfigured) return { error: { message: 'Supabase is not configured. Please connect to Supabase.' } as any };
  const supabase = createAdminClient();
  return await supabase.from('categories').insert(payload);
}
export async function updateCategoryAdmin(id: string, payload: any) {
  if (!isConfigured) return { error: { message: 'Supabase is not configured. Please connect to Supabase.' } as any };
  const supabase = createAdminClient();
  return await supabase.from('categories').update(payload).eq('id', id);
}
export async function deleteCategoryAdmin(id: string) {
  if (!isConfigured) return { error: { message: 'Supabase is not configured. Please connect to Supabase.' } as any };
  const supabase = createAdminClient();
  return await supabase.from('categories').delete().eq('id', id);
}
export async function deleteMediaFileAdmin(fileName: string) {
  if (!isConfigured) return { error: { message: 'Supabase is not configured. Please connect to Supabase.' } as any };
  const supabase = createAdminClient();
  return await supabase.storage.from(BUCKETS.BLOG_IMAGES).remove([fileName]);
}
export async function deleteSubscriberAdmin(id: string) {
  if (!isConfigured) return { error: { message: 'Supabase is not configured. Please connect to Supabase.' } as any };
  const supabase = createAdminClient();
  return await supabase.from('subscribers').delete().eq('id', id);
}
export async function updateSubscriberStatusAdmin(id: string, status: string) {
  if (!isConfigured) return { error: { message: 'Supabase is not configured. Please connect to Supabase.' } as any };
  const supabase = createAdminClient();
  return await supabase.from('subscribers').update({ status }).eq('id', id);
}

export async function saveGlobalSettings(newSettings: Record<string, any>) {
  if (!isConfigured) return { error: { message: 'Supabase is not configured. Please connect to Supabase.' } as any };
  const supabase = createAdminClient();
  const keys = Object.keys(newSettings);
  
  for (const key of keys) {
    const { error } = await supabase
      .from('settings')
      .upsert({ 
        key, 
        value: newSettings[key] 
      }, { onConflict: 'key' });
      
    if (error) throw error;
  }
}

export async function loginAdmin(email: string, password: string) {
  if (!isConfigured) return { error: { message: 'Supabase is not configured. Please connect to Supabase.' } as any };
  const supabase = createServerClient();
  return await supabase.auth.signInWithPassword({ email, password });
}

// --- From lib/blog/queries.ts ---


import type { Database } from '@/types/database.types';

type PostRow = Database['public']['Tables']['posts']['Row'];
type CategoryRow = Database['public']['Tables']['categories']['Row'];
type TagRow = Database['public']['Tables']['tags']['Row'];

export type PostWithCategoryAndTags = PostRow & {
  category: CategoryRow | null
  tags: TagRow[]
  lead_magnet?: any
  view_count?: number
}

const POSTS_PER_PAGE = LIMITS.DEFAULT_PAGE_SIZE

// We use the raw JS client here without SSR cookies so it works in generateStaticParams.

const getPublicClient = cache(() => {
  return createClient(
    (env.NEXT_PUBLIC_SUPABASE_URL && !env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project-ref') && env.NEXT_PUBLIC_SUPABASE_URL !== 'YOUR_SUPABASE_URL') ? env.NEXT_PUBLIC_SUPABASE_URL : 'https://127.0.0.1',
    env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder',
    {
      global: {
        fetch: (input, init) => {
          return fetch(input, {
            ...init,
            next: { revalidate: 60 },
          });
        },
      },
    }
  );
});

export async function getPosts(page = 1, filters?: { status?: string, categoryId?: string, search?: string, authorName?: string }) {
  if (!isConfigured) return { data: [], count: 0 }
  
  const supabase = getPublicClient()
  
  let query = supabase
    .from('posts')
    .select(`
      *,
      category:categories(*)
    `, { count: 'exact' })
    .order('created_at', { ascending: false })
  
  if (filters?.status) {
    query = query.eq('status', filters.status)
  }
  
  if (filters?.categoryId) {
    query = query.eq('category_id', filters.categoryId)
  }

  if (filters?.authorName) {
    query = query.eq('author_name', filters.authorName)
  }

  if (filters?.search) {
    query = query.ilike('title', `%${filters.search}%`)
  }

  try {
    const from = (page - 1) * POSTS_PER_PAGE
    const to = from + POSTS_PER_PAGE - 1
    
    const { data, count, error } = await query.range(from, to)

    if (error || !data) {
      if (error && error.code !== '42P01' && error.message !== 'fetch failed') console.error('Error fetching posts:', error)
      return { data: [], count: 0 }
    }

    const postIds = (data as any[]).map(p => p.id)
    let tagsMap: Record<string, TagRow[]> = {}
    
    if (postIds.length > 0) {
      const { data: postTags } = await supabase
        .from('post_tags')
        .select(`
          post_id,
          tag:tags(*)
        `)
        .in('post_id', postIds)
        
      if (postTags) {
        postTags.forEach((pt: any) => {
          if (!tagsMap[pt.post_id]) tagsMap[pt.post_id] = []
          if (pt.tag) tagsMap[pt.post_id].push(pt.tag)
        })
      }
    }

    const enhancedData = (data as any[]).map(post => ({
      ...post,
      tags: tagsMap[post.id] || []
    })) as PostWithCategoryAndTags[]

    return { data: enhancedData, count: count || 0 }
  } catch (err: any) {
    if (err?.code !== '42P01' && err?.message !== 'fetch failed') console.error('Error in getPosts:', err)
    return { data: [], count: 0 }
  }
}

export async function getPostsByTag(tagSlug: string, page = 1) {
  if (!isConfigured) return { data: [], count: 0 }
  
  const supabase = getPublicClient()
  
  try {
    const { data: tag } = await supabase.from('tags').select('id').eq('slug', tagSlug).single() as { data: { id: string } | null }
    if (!tag) return { data: [], count: 0 }

    const { data: ptData, count } = await supabase
      .from('post_tags')
      .select('post_id', { count: 'exact' })
      .eq('tag_id', tag.id)
      .range((page - 1) * POSTS_PER_PAGE, (page - 1) * POSTS_PER_PAGE + POSTS_PER_PAGE - 1)

    if (!ptData || ptData.length === 0) return { data: [], count: 0 }

    const postIds = (ptData as any[]).map(pt => pt.post_id)

    const { data: posts } = await supabase
      .from('posts')
      .select(`
        *,
        category:categories(*)
      `)
      .in('id', postIds)
      .eq('status', POST_STATUS.PUBLISHED)
      .order('created_at', { ascending: false })

    const enhancedData = ((posts as any[]) || []).map(post => ({
      ...post,
      tags: []
    })) as PostWithCategoryAndTags[]

    return { data: enhancedData, count: count || 0 }
  } catch (err: any) {
    if (err?.code !== '42P01' && err?.message !== 'fetch failed') console.error('Error in getPostsByTag:', err)
    return { data: [], count: 0 }
  }
}

export async function getPostBySlug(slug: string) {
  if (!isConfigured) return null
  
  const supabase = getPublicClient()
  
  try {
    const { data: post } = await supabase
      .from('posts')
      .select(`
        *,
        category:categories(*),
        lead_magnet:lead_magnets(*)
      `)
      .eq('slug', slug)
      .single() as { data: any | null }
      
    if (!post) return null

    const { data: postTags } = await supabase
      .from('post_tags')
      .select('tag:tags(*)')
      .eq('post_id', post.id)

    const tags = (postTags as any[])?.map((pt: any) => pt.tag).filter(Boolean) || []

    return {
      ...post,
      tags
    } as PostWithCategoryAndTags as any
  } catch (err: any) {
    if (err?.code !== '42P01' && err?.message !== 'fetch failed') console.error('Error in getPostBySlug:', err)
    return null
  }
}

export async function getCategories(): Promise<CategoryRow[]> {
  if (!isConfigured) return []
  
  const supabase = getPublicClient()
  try {
    const { data } = await supabase.from('categories').select('*').order('name') as { data: CategoryRow[] | null }
    return data || []
  } catch (err: any) {
    if (err?.code !== '42P01' && err?.message !== 'fetch failed') console.error('Error in getCategories:', err)
    return []
  }
}

export async function getTags(): Promise<TagRow[]> {
  if (!isConfigured) return []
  
  const supabase = getPublicClient()
  try {
    const { data } = await supabase.from('tags').select('*').order('name') as { data: TagRow[] | null }
    return data || []
  } catch (err: any) {
    if (err?.code !== '42P01' && err?.message !== 'fetch failed') console.error('Error in getTags:', err)
    return []
  }
}

export async function getCategoryBySlug(slug: string): Promise<CategoryRow | null> {
  if (!isConfigured) return null
  
  const supabase = getPublicClient()
  try {
    const { data } = await supabase.from('categories').select('*').eq('slug', slug).single() as { data: CategoryRow | null }
    return data
  } catch (err: any) {
    if (err?.code !== '42P01' && err?.message !== 'fetch failed') console.error('Error in getCategoryBySlug:', err)
    return null
  }
}

export async function getTagBySlug(slug: string): Promise<TagRow | null> {
  if (!isConfigured) return null
  
  const supabase = getPublicClient()
  try {
    const { data } = await supabase.from('tags').select('*').eq('slug', slug).single() as { data: TagRow | null }
    return data
  } catch (err: any) {
    if (err?.code !== '42P01' && err?.message !== 'fetch failed') console.error('Error in getTagBySlug:', err)
    return null
  }
}

export async function getSettings(): Promise<Record<string, any>> {
  if (!isConfigured) return {}
  
  const supabase = getPublicClient()
  try {
    const { data } = await supabase.from('settings').select('*');
    if (!data) return {}
    
    return (data as any[]).reduce((acc: Record<string, any>, curr: any) => {
      acc[curr.key] = curr.value
      return acc
    }, {} as Record<string, any>)
  } catch (err: any) {
    if (err?.code !== '42P01' && err?.message !== 'fetch failed') console.error('Error in getSettings:', err)
    return {}
  }
}



// --- From lib/blog/actions.ts ---


export async function createPost(formData: FormData) {
  if (!isConfigured) return { error: { message: 'Supabase is not configured. Please connect to Supabase.' } as any };
  try {
    const supabase = await createServerClient();
    
    const title = formData.get('title') as string;
    let slug = formData.get('slug') as string;
    const excerpt = formData.get('excerpt') as string;
    const content = formData.get('content') as string;
    const author_name = formData.get('author_name') as string;
    const category_id = formData.get('category_id') as string;
    const status = formData.get('status') as string;
    const featured_image_url = formData.get('featured_image_url') as string;
    const meta_title = formData.get('meta_title') as string;
    const meta_description = formData.get('meta_description') as string;
    const tagsStr = formData.get('tags') as string;

    // Auto-generate slug if empty
    if (!slug) {
      slug = title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
    }

    // Check duplicate slug
    const { data: existing } = await supabase.from('posts').select('id').eq('slug', slug).single();
    if (existing) {
      return { error: 'A post with this slug already exists. Please choose a different slug.' };
    }

    let published_at: string | null = null;
    if (status === POST_STATUS.PUBLISHED) {
      published_at = new Date().toISOString();
    } else if (status === POST_STATUS.DRAFT) {
      const scheduledAt = formData.get('scheduled_at') as string;
      if (scheduledAt) {
        published_at = new Date(scheduledAt).toISOString();
      }
    }

    const { data: post, error } = await supabase.from('posts').insert({
      title,
      slug,
      excerpt,
      content,
      category_id: category_id || null,
      author_name: author_name || null,
      status: status as any,
      featured_image_url: featured_image_url || null,
      meta_title: meta_title || null,
      meta_description: meta_description || null,
      published_at
    }).select().single();

    if (error) {
      return { error: error.message };
    }

    await handleTags(supabase, post.id, tagsStr);
    
    // Send email to subscribers if published
    if (status === POST_STATUS.PUBLISHED) {
      const { data: subscribers } = await supabase.from('newsletter_subscribers').select('email').eq('status', SUBSCRIBER_STATUS.ACTIVE);
      if (subscribers && subscribers.length > 0) {
        const emails = subscribers.map(s => s.email);
        // We don't await this so it happens in the background
        sendBlogPostEmail(emails, title, excerpt, slug, featured_image_url || null).catch(console.error);
      }
    }
  } catch (err: any) {
    console.error(err);
    const msg = err.message || '';
    if (msg.includes('fetch failed') || msg.includes('Failed to fetch')) {
      return { error: 'Failed to connect to the database. Please ensure your Supabase environment variables are correctly configured.' };
    }
    return { error: msg || 'Failed to create post.' };
  }

  revalidatePath('/blog');
  revalidatePath('/admin/posts');
  return { success: true };
}

export async function updatePost(id: string, formData: FormData) {
  if (!isConfigured) return { error: { message: 'Supabase is not configured. Please connect to Supabase.' } as any };
  let slugToRevalidate;
  try {
    const supabase = await createServerClient();
    
    const title = formData.get('title') as string;
    let slug = formData.get('slug') as string;
    const excerpt = formData.get('excerpt') as string;
    const content = formData.get('content') as string;
    const author_name = formData.get('author_name') as string;
    const category_id = formData.get('category_id') as string;
    const status = formData.get('status') as string;
    const featured_image_url = formData.get('featured_image_url') as string;
    const meta_title = formData.get('meta_title') as string;
    const meta_description = formData.get('meta_description') as string;
    const tagsStr = formData.get('tags') as string;

    if (!slug) {
      slug = title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
    }
    slugToRevalidate = slug;

    const { data: existing } = await supabase.from('posts').select('id').eq('slug', slug).neq('id', id).single();
    if (existing) {
      return { error: 'A post with this slug already exists.' };
    }

    const { data: currentPost } = await supabase.from('posts').select('status, published_at').eq('id', id).single();
    
    let published_at = currentPost?.published_at;
    if (status === POST_STATUS.PUBLISHED && currentPost?.status !== POST_STATUS.PUBLISHED && !published_at) {
      published_at = new Date().toISOString();
    } else if (status === POST_STATUS.DRAFT) {
      const scheduledAt = formData.get('scheduled_at') as string;
      if (scheduledAt) {
        published_at = new Date(scheduledAt).toISOString();
      } else {
        published_at = null; // Clear scheduled date if not provided
      }
    }

    const { error } = await supabase.from('posts').update({
      title,
      slug,
      excerpt,
      content,
      category_id: category_id || null,
      author_name: author_name || null,
      status: status as any,
      featured_image_url: featured_image_url || null,
      meta_title: meta_title || null,
      meta_description: meta_description || null,
      published_at,
      updated_at: new Date().toISOString()
    }).eq('id', id);

    if (error) {
      return { error: error.message };
    }

    await handleTags(supabase, id, tagsStr);

    // Send email to subscribers if newly published
    if (status === POST_STATUS.PUBLISHED && currentPost?.status !== POST_STATUS.PUBLISHED) {
      const { data: subscribers } = await supabase.from('newsletter_subscribers').select('email').eq('status', SUBSCRIBER_STATUS.ACTIVE);
      if (subscribers && subscribers.length > 0) {
        const emails = subscribers.map(s => s.email);
        // We don't await this so it happens in the background
        sendBlogPostEmail(emails, title, excerpt, slug, featured_image_url || null).catch(console.error);
      }
    }
  } catch (err: any) {
    console.error(err);
    const msg = err.message || '';
    if (msg.includes('fetch failed') || msg.includes('Failed to fetch')) {
      return { error: 'Failed to connect to the database. Please ensure your Supabase environment variables are correctly configured.' };
    }
    return { error: msg || 'Failed to update post.' };
  }

  revalidatePath('/blog');
  if (slugToRevalidate) revalidatePath(`/blog/${slugToRevalidate}`);
  revalidatePath('/admin/posts');
  return { success: true };
}

export async function deletePost(id: string) {
  if (!isConfigured) return { error: { message: 'Supabase is not configured. Please connect to Supabase.' } as any };
  try {
    const supabase = await createServerClient();
    
    const { error } = await supabase.from('posts').delete().eq('id', id);
    if (error) {
      return { error: error.message };
    }
  } catch (err: any) {
    console.error(err);
    return { error: err.message || 'Failed to delete post.' };
  }
  
  revalidatePath('/blog');
  revalidatePath('/admin/posts');
  return { success: true };
}

async function handleTags(supabase: any, postId: string, tagsStr: string) {
  // clear existing
  await supabase.from('post_tags').delete().eq('post_id', postId);

  if (!tagsStr.trim()) return;

  const tagNames = tagsStr.split(',').map(t => t.trim()).filter(Boolean);
  
  for (const name of tagNames) {
    const slug = name.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
    
    // get or create tag
    let { data: tag } = await supabase.from('tags').select('id').eq('slug', slug).single();
    if (!tag) {
      const { data: newTag } = await supabase.from('tags').insert({ name, slug }).select().single();
      tag = newTag;
    }

    if (tag) {
      await supabase.from('post_tags').insert({ post_id: postId, tag_id: tag.id });
    }
  }
}


// --- From lib/newsletter/actions.ts ---


export async function subscribeToNewsletter(formData: FormData) {
  if (!isConfigured) return { error: { message: 'Supabase is not configured. Please connect to Supabase.' } as any };
  const supabase = createAdminClient();
  try {

    
    // Check honeypot
    const honeypot = formData.get('b_name');
    if (honeypot) {
      // Silent rejection
      return { success: 'Thanks for subscribing!' };
    }
    
    const email = formData.get('email') as string;
    const first_name = formData.get('first_name') as string;
    const source = formData.get('source') as string;
    const post_id = formData.get('post_id') as string;
    
    if (!email) {
      return { error: 'Email is required' };
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { error: 'Invalid email format' };
    }

    const { data: existing } = await supabase
      .from('subscribers')
      .select('id, status')
      .eq('email', email)
      .single();

    if (existing) {
      if (existing.status === SUBSCRIBER_STATUS.UNSUBSCRIBED) {
        // Resubscribe
        const { error } = await supabase
          .from('subscribers')
          .update({ status: SUBSCRIBER_STATUS.ACTIVE, consent_given: true, updated_at: new Date().toISOString() })
          .eq('email', email);
          
        if (error) throw error;
        
        // Don't send welcome email again for resubscribes, but we could if we wanted.
        return { success: 'Welcome back! You have been resubscribed.' };
      }
      return { success: 'You are already subscribed!' }; // Don't show error to user for this
    }

    const { error } = await supabase.from('subscribers').insert({
      email,
      first_name: first_name || null,
      source: source || 'website',
      post_id: post_id || null,
      consent_given: true,
      status: SUBSCRIBER_STATUS.ACTIVE
    });

    if (error) {
      return { error: error.message };
    }
    
    // Check if this was from a lead magnet
    if (source.startsWith('magnet_')) {
      const magnetId = source.replace('magnet_', '');
      const { data: magnet } = await supabase
        .from('lead_magnets')
        .select('title, file_url, is_active')
        .eq('id', magnetId)
        .single();
        
      if (magnet && magnet.is_active && magnet.file_url) {
        // Increment download count
        await supabase.rpc('increment_download_count', { row_id: magnetId });
        
        // Send email with resource
        await sendLeadMagnetEmail(email, magnet.title, magnet.file_url, first_name);
        return { success: 'Thanks! Check your email for the download link.' };
      }
    }

    // Default welcome email
    await sendWelcomeEmail(email, first_name);

    return { success: 'Thanks for subscribing!' };
  } catch (err: any) {
    console.error(err);
    return { error: err.message || 'Failed to subscribe.' };
  }
}



// --- From lib/newsletter/leadMagnetActions.ts ---


export async function downloadLeadMagnet(formData: FormData) {
  if (!isConfigured) return { error: { message: 'Supabase is not configured. Please connect to Supabase.' } as any };
  const supabase = createAdminClient();
  try {

    
    // Check honeypot
    const honeypot = formData.get('b_name');
    if (honeypot) {
      // Silent rejection
      return { success: true, message: 'Download ready! We have also emailed you the link.' };
    }
    
    const email = formData.get('email') as string;
    const first_name = formData.get('first_name') as string;
    const lead_magnet_id = formData.get('lead_magnet_id') as string;
    const post_id = formData.get('post_id') as string;
    
    if (!email || !lead_magnet_id) {
      return { error: 'Email and lead magnet ID are required' };
    }

    // Subscribe user or update existing
    let subscriberId = null;
    let isNewSub = false;

    const { data: existingSub } = await supabase
      .from('subscribers')
      .select('id')
      .eq('email', email)
      .single();

    if (existingSub) {
      subscriberId = existingSub.id;
      // ensure active
      await supabase.from('subscribers').update({ status: SUBSCRIBER_STATUS.ACTIVE }).eq('id', subscriberId);
    } else {
      isNewSub = true;
      const { data: newSub } = await supabase.from('subscribers').insert({
        email,
        first_name: first_name || null,
        source: `magnet_${lead_magnet_id}`,
        post_id: post_id || null,
        consent_given: true,
        status: SUBSCRIBER_STATUS.ACTIVE
      }).select('id').single();
      
      if (newSub) subscriberId = newSub.id;
    }

    // Record download
    await supabase.from('lead_magnet_downloads').insert({
      lead_magnet_id,
      subscriber_id: subscriberId,
      email,
      first_name: first_name || null,
      source_post_id: post_id || null
    });

    // Increment download count and get file_url
    const { data: magnet } = await supabase.from('lead_magnets').select('title, download_count, file_url, success_message').eq('id', lead_magnet_id).single();
    
    if (magnet) {
      await supabase.from('lead_magnets').update({ download_count: (magnet.download_count || 0) + 1 }).eq('id', lead_magnet_id);
      
      if (magnet.file_url) {
        await sendLeadMagnetEmail(email, magnet.title, magnet.file_url, first_name);
      }
    }

    // If new subscriber, optionally send welcome email too?
    // We can just send the lead magnet email which can act as a welcome email too.
    
    return { 
      success: true, 
      file_url: magnet?.file_url || null, 
      message: magnet?.success_message || 'Download ready! We have also emailed you the link.' 
    };
  } catch (err: any) {
    console.error(err);
    return { error: err.message || 'Failed to process download.' };
  }
}



export async function createLeadMagnetAdmin(payload: any) {
  if (!isConfigured) return { error: { message: 'Supabase is not configured. Please connect to Supabase.' } as any };
  const supabase = createAdminClient();
  return await supabase.from('lead_magnets').insert(payload);
}
export async function uploadLeadMagnetFile(fileName: string, fileData: any) {
  if (!isConfigured) return { error: { message: 'Supabase is not configured. Please connect to Supabase.' } as any };
  const supabase = createAdminClient();
  await supabase.storage.createBucket(BUCKETS.LEAD_MAGNETS, { public: true });
  
  const { error: uploadError } = await supabase.storage
    .from(BUCKETS.LEAD_MAGNETS)
    .upload(fileName, fileData, {
      upsert: true,
      contentType: 'application/pdf',
    });
    
  if (uploadError) return { error: uploadError };
  
  const { data: publicUrlData } = supabase.storage
    .from(BUCKETS.LEAD_MAGNETS)
    .getPublicUrl(fileName);
    
  return { publicUrl: publicUrlData.publicUrl };
}

export async function updateLeadMagnetAdmin(id: string, payload: any) {
  if (!isConfigured) return { error: { message: 'Supabase is not configured. Please connect to Supabase.' } as any };
  const supabase = createAdminClient();
  return await supabase.from('lead_magnets').update(payload).eq('id', id);
}

export async function deleteLeadMagnetAdmin(id: string) {
  if (!isConfigured) return { error: { message: 'Supabase is not configured. Please connect to Supabase.' } as any };
  const supabase = createAdminClient();
  return await supabase.from('lead_magnets').delete().eq('id', id);
}

export async function processLeadMagnetDownload(email: string, first_name: string | null, lead_magnet_id: string): Promise<{ error?: string; success?: string; fileUrl?: string }> {
  const supabase = createAdminClient();
  let subscriberId = null;
  const { data: existing } = await supabase
    .from('subscribers')
    .select('id, status')
    .eq('email', email)
    .single();

  if (existing) {
    subscriberId = existing.id;
    if (existing.status === 'unsubscribed') {
      await supabase
        .from('subscribers')
        .update({ status: 'active', consent_given: true, updated_at: new Date().toISOString() })
        .eq('email', email);
    }
  } else {
    const { data: newSub, error: subError } = await supabase
      .from('subscribers')
      .insert({
        email,
        first_name,
        source: 'lead_magnet',
        consent_given: true,
        status: 'active'
      })
      .select()
      .single();
    if (subError) throw subError;
    subscriberId = newSub.id;
  }

  const { error: dlError } = await supabase.from('lead_magnet_downloads').insert({
    lead_magnet_id,
    subscriber_id: subscriberId,
    email,
    first_name
  });
  if (dlError) throw dlError;

  const { data: magnet } = await supabase
    .from('lead_magnets')
    .select('download_count, file_url, success_message')
    .eq('id', lead_magnet_id)
    .single();

  if (magnet) {
    await supabase
      .from('lead_magnets')
      .update({ download_count: (magnet.download_count || 0) + 1 })
      .eq('id', lead_magnet_id);
  }

  return { 
    success: magnet?.success_message || 'Thanks! Your download will begin shortly.', 
    fileUrl: magnet?.file_url 
  };
}

export async function publishScheduledPostsAdmin() {
  if (!isConfigured) return [];
  const supabase = createAdminClient();
  const now = new Date().toISOString();
  const { data: scheduledPosts, error: fetchError } = await supabase
    .from('posts')
    .select('id, title, published_at')
    .eq('status', POST_STATUS.DRAFT)
    .lte('published_at', now);
    
  if (fetchError) throw fetchError;
  if (!scheduledPosts || scheduledPosts.length === 0) return [];
  
  const postIds = scheduledPosts.map(p => p.id);
  const { error: updateError } = await supabase
    .from('posts')
    .update({ status: POST_STATUS.PUBLISHED, updated_at: now })
    .in('id', postIds);
    
  if (updateError) throw updateError;
  return scheduledPosts;
}

export async function exportSubscribersCsvAdmin() {
  if (!isConfigured) return { error: { message: 'Supabase is not configured. Please connect to Supabase.' } as any };
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('subscribers')
    .select('email,first_name,status,source,created_at')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  if (!data || data.length === 0) return '';

  const headers = ['Email', 'First Name', 'Status', 'Source', 'Joined At'];
  const rows = data.map((s: any) => [
    s.email,
    s.first_name || '',
    s.status,
    s.source || '',
    new Date(s.created_at).toISOString()
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map((cell: any) => `"${cell}"`).join(','))
  ].join('\n');

  return csvContent;
}

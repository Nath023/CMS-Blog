import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/lib/database.types'

type PostRow = Database['public']['Tables']['posts']['Row']
type CategoryRow = Database['public']['Tables']['categories']['Row']
type TagRow = Database['public']['Tables']['tags']['Row']

export type PostWithCategoryAndTags = PostRow & {
  category: CategoryRow | null
  tags: TagRow[]
  lead_magnet?: any
  view_count?: number
}

const POSTS_PER_PAGE = 9

// We use the raw JS client here without SSR cookies so it works in generateStaticParams.
import { cache } from 'react';

const getPublicClient = cache(() => {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://127.0.0.1',
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder',
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

const isConfigured = !!process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL !== 'YOUR_SUPABASE_URL';

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
      if (error && error.code !== '42P01') console.error('Error fetching posts:', error)
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
    if (err?.code !== '42P01') console.error('Error in getPosts:', err)
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
      .eq('status', 'published')
      .order('created_at', { ascending: false })

    const enhancedData = ((posts as any[]) || []).map(post => ({
      ...post,
      tags: []
    })) as PostWithCategoryAndTags[]

    return { data: enhancedData, count: count || 0 }
  } catch (err: any) {
    if (err?.code !== '42P01') console.error('Error in getPostsByTag:', err)
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
    if (err?.code !== '42P01') console.error('Error in getPostBySlug:', err)
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
    if (err?.code !== '42P01') console.error('Error in getCategories:', err)
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
    if (err?.code !== '42P01') console.error('Error in getTags:', err)
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
    if (err?.code !== '42P01') console.error('Error in getCategoryBySlug:', err)
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
    if (err?.code !== '42P01') console.error('Error in getTagBySlug:', err)
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
    if (err?.code !== '42P01') console.error('Error in getSettings:', err)
    return {}
  }
}

